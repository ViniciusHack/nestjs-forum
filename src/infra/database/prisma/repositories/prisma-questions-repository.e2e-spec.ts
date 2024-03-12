import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { RedisCacheRepository } from '@/infra/cache/redis/redis-cache-repository'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'
import { PrismaQuestionsRepository } from './prisma-questions-repository'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let questionsRepository: PrismaQuestionsRepository
  let cacheRepository: RedisCacheRepository

  beforeAll(async () => {
    // Run application for tests
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionsRepository = moduleRef.get(QuestionsRepository)
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })

  it('should be able to cache question details', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    await questionsRepository.findDetailsBySlug(question.slug.value)

    const cacheHit = await cacheRepository.get(
      `question:${question.slug.value}:details`,
    )

    expect(cacheHit).not.toBeNull()
  })

  it('should be able to get cached question details', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    await cacheRepository.set(
      `question:${question.slug.value}:details`,
      JSON.stringify({ empty: true }),
    )

    const questionDetails = await questionsRepository.findDetailsBySlug(
      question.slug.value,
    )

    expect(questionDetails).toEqual({ empty: true })
  })

  it('should be able to reset cached question details on save', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    await cacheRepository.set(
      `question:${question.slug.value}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionsRepository.save(question)

    const questionDetails = await cacheRepository.get(
      `question:${question.slug.value}:details`,
    )
    expect(questionDetails).toBeNull()
  })
})
