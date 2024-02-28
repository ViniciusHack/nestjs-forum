import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { Encoder } from '../cryptography/encoder'
import { HashComparer } from '../cryptography/hash-comparer'
import { StudentsRepository } from '../repositories/student-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

export type AuthenticateStudentUseCaseResponse = Either<
  InvalidCredentialsError | NotAllowedError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: Encoder,
  ) {}

  async execute(
    data: AuthenticateStudentUseCaseRequest,
  ): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(data.email)

    if (!student) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      data.password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.tokenGenerator.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
