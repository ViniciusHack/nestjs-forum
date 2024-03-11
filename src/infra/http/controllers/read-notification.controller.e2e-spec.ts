import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification'
import { StudentFactory } from 'test/factories/make-student'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    // Run application for tests
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /notifications/:id/read', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: student.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: student.id.toString(),
      },
    })

    expect(notificationOnDatabase).toEqual(
      expect.objectContaining({ readAt: expect.any(Date) }),
    )
  })
})
