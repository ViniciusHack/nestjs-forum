import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let sut: UploadAndCreateAttachmentUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let uploader: FakeUploader

describe('Register Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      uploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      body: Buffer.from('any buffer'),
      fileName: 'any file name',
      fileType: 'image/png',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAttachmentsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'any file name',
      }),
    )
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0].fileName).toBe('any file name')
  })

  it('should not be able to register a new attachment with invalid file type', async () => {
    const result = await sut.execute({
      body: Buffer.from('any buffer'),
      fileName: 'any file name',
      fileType: 'application/mp4',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
