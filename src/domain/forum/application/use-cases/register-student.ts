import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentRepository } from '../repositories/student-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

export interface RegisterStudentsUseCaseRequest {
  name: string
  email: string
  password: string
}

export type RegisterStudentsUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

export class CreateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    data: RegisterStudentsUseCaseRequest,
  ): Promise<RegisterStudentsUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(
      data.email,
    )

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(data.email))
    }

    const hashedPassword = await this.hashGenerator.generate(data.password)

    const student = Student.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    await this.studentRepository.create(student)

    return right({
      student,
    })
  }
}
