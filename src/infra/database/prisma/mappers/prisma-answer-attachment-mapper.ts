import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-Attachment'
import { Attachment } from '@prisma/client'
export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: Attachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }
    return AnswerAttachment.create(
      {
        // title: answer.title,
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
