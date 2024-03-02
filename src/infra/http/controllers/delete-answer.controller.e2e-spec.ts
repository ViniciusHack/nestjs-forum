import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answer (E2E)', () => {
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PrismaService,
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
      ],
    }).compile()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('[DELETE] /answers/:id', async () => {
    const student = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: student.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: student.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answer.id.toString(),
      },
    })

    expect(answerOnDatabase).toBe(null)
  })
})
