import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  const answer = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answer
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}) {
    const answerAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
    })

    return answerAttachment
  }
}
