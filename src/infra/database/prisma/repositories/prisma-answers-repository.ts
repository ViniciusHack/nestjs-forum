import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../prisma/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)
    await this.prisma.answer.update({
      where: { id: data.id },
      data,
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyRecent(params: PaginationParams): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      take: 20,
      skip: (params.page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }
}
