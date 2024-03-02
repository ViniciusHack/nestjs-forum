import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id,
      content: answer.content,
      authorId: answer.authorId,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
