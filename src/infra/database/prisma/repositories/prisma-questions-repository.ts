import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../prisma/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)
    await this.prisma.question.update({
      where: { id: data.id },
      data,
    })
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
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