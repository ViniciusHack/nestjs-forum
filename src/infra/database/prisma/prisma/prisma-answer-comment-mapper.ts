import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment } from '@prisma/client'
export class PrismaAnswerCommentMapper {
  static toDomain(raw: Comment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }
    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(comment: AnswerComment): Comment {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      answerId: comment.answerId.toString(),
      questionId: null,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt ?? null,
    }
  }
}
