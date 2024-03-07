import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Prisma, Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(question: PrismaQuestion): Question {
    return Question.create(
      {
        title: question.title,
        slug: Slug.create(question.slug),
        content: question.content,
        authorId: new UniqueEntityID(question.authorId),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        bestAnswerId: question.bestAnswerId
          ? new UniqueEntityID(question.bestAnswerId)
          : null,
      },
      new UniqueEntityID(question.id),
    )
  }

  static toPersistence(
    question: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId?.toString(),
    }
  }
}
