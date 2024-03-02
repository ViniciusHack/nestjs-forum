import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
