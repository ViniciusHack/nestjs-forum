import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { Student } from '../../enterprise/entities/student'
import { RegisterStudentUseCase } from './register-student'

let sut: RegisterStudentUseCase
let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()

    const hashedPassword = await fakeHasher.hash('123456')
    expect(inMemoryStudentRepository.items[0].password).toBe(hashedPassword)
  })

  it('should not be able to register a student with the same email', async () => {
    await inMemoryStudentRepository.create(
      Student.create({
        email: 'johndoe@test.com',
        name: 'John Doe',
        password: '123456',
      }),
    )
    await sut.execute({
      email: 'johndoe@test.com',
      name: 'any name',
      password: 'any password',
    })
  })
})
