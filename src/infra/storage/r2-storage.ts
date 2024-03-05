import { Uploader } from '@/domain/forum/application/storage/uploader'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${envService.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_KEY_ID'),
      },
    })
  }

  async upload({ body, fileName, fileType }) {
    const uniqueFile = `${randomUUID()}-${fileName}`
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFile,
        Body: body,
        ContentType: fileType,
      }),
    )

    return { link: uniqueFile }
  }
}
