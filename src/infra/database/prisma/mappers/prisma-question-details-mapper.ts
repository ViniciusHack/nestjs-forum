import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

type PrismaQuestionDetails = PrismaQuestion & {
  author: {
    name: string
  }
  attachments: {
    title: string
    url: string
    id: string
  }[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(questionDetails: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      title: questionDetails.title,
      slug: Slug.create(questionDetails.slug),
      content: questionDetails.content,
      authorId: new UniqueEntityID(questionDetails.authorId),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      bestAnswerId: questionDetails.bestAnswerId
        ? new UniqueEntityID(questionDetails.bestAnswerId)
        : null,
      attachments: questionDetails.attachments.map((attachment) =>
        Attachment.create(
          {
            title: attachment.title,
            link: attachment.url,
          },
          new UniqueEntityID(attachment.id),
        ),
      ),
      author: questionDetails.author.name,
      questionId: new UniqueEntityID(questionDetails.id),
    })
  }
}
