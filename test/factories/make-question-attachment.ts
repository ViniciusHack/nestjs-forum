import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
): QuestionAttachment {
  const question = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ) {
    const questionAttachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
    })

    return questionAttachment
  }
}
