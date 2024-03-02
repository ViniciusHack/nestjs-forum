import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch questions answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  let jwt: JwtService
  beforeAll(async () => {
    // Run application for tests
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PrismaService,
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  it('[GET] /questions/:questionId/answers', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await Promise.all([
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: student.id,
        content: 'First content',
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: student.id,
        content: 'Second content',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'First content' }),
        expect.objectContaining({ content: 'Second content' }),
      ]),
    )
  })
})
