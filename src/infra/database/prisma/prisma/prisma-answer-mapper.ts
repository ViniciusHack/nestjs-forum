import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'
export class PrismaAnswerMapper {
  static toDomain(answer: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: answer.content,
        authorId: new UniqueEntityID(answer.authorId),
        questionId: new UniqueEntityID(answer.questionId),
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      },
      new UniqueEntityID(answer.id),
    )
  }

  static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
