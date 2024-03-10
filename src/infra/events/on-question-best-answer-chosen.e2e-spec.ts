import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { waitFor } from 'test/utils/wait-for'

describe('On question best answer chosen (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let prisma: PrismaService

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
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send notification when a best answer is chosen', async () => {
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
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId: student.id.toString(),
        },
      })

      expect(notification).not.toBeNull()
    })
  })
})
