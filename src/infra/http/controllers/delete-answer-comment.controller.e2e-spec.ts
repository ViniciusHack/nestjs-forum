import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answer comment (E2E)', () => {
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PrismaService,
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('[DELETE] /answers/comments/:id', async () => {
    const student = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerComment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
    const answerCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerComment.id.toString(),
      },
    })

    expect(answerCommentOnDatabase).toBe(null)
  })
})
