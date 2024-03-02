import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete question comment (E2E)', () => {
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PrismaService,
        StudentFactory,
        QuestionFactory,
        QuestionCommentFactory,
      ],
    }).compile()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('[DELETE] /questions/comments/:id', async () => {
    const student = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: student.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: student.id,
      })

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionComment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
    const questionCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: questionComment.id.toString(),
      },
    })

    expect(questionCommentOnDatabase).toBe(null)
  })
})
