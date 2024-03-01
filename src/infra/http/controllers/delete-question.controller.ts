import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
