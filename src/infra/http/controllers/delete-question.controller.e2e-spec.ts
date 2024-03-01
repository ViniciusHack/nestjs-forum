import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete question (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService

  let jwt: JwtService

  beforeAll(async () => {
    // Run application for tests
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[DELETE] /questions/:id', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
      title: 'New question title',
    })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionOnDatabase).toBe(null)
  })
})
