import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(question: PrismaQuestion) {
    return Question.create(
      {
        title: question.title,
        slug: Slug.create(question.slug),
        content: question.content,
        authorId: new UniqueEntityID(question.authorId),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        bestAnswerId: undefined,
      },
      new UniqueEntityID(question.id),
    )
  }
}
