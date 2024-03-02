import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('answers/:id/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.chooseQuestionBestAnswer.execute({
      answerId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
