import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      url: attachment.link,
      title: attachment.title,
    }
  }
}
