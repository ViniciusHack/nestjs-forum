import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { Injectable } from '@nestjs/common'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private cache: CacheRepository,
  ) {}

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await Promise.all([
      this.prisma.question.update({
        where: { id: data.id },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      this.cache.delete(`question:${question.slug.value}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    if (cacheHit) {
      const cachedQuestion = JSON.parse(cacheHit)
      return PrismaQuestionDetailsMapper.toDomain(cachedQuestion)
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        attachments: {
          select: {
            title: true,
            url: true,
            id: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!question) return null

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (params.page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }
}
