import { FakeEncoder } from 'test/cryptography/fake-encoder'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

let sut: AuthenticateStudentUseCase
let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncoder: FakeEncoder

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncoder = new FakeEncoder()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncoder,
    )
  })

  it('should be able to authenticate a student', async () => {
    const plainPassword = '123456'
    const passwordHash = await fakeHasher.hash(plainPassword)
    const student = makeStudent({
      email: 'johndoe@test.com',
      password: passwordHash,
    })
    await inMemoryStudentRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@test.com',
      password: plainPassword,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({ accessToken: expect.any(String) }),
    )
  })
})
