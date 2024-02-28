import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const result = await this.authenticateStudent.execute(
      authenticateBodySchema.parse(body),
    )

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException('Invalid credentials')
        default:
          throw new BadRequestException()
      }
    }

    return { access_token: result.value.accessToken }
  }
}
