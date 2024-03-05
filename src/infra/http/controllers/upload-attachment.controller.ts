import { left } from '@/core/either'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 /* 2MB */ }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachmentUseCase.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    })

    if (result.isLeft()) {
      return left(new BadRequestException())
    }
    const { attachment } = result.value

    return { attachmentId: attachment.id.toString() }
  }
}
