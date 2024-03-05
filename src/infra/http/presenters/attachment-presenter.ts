import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      id: attachment.id,
      link: attachment.link,
      title: attachment.title,
    }
  }
}
