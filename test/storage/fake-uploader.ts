import { randomUUID } from 'crypto'

interface Upload {
  link: string
  fileName: string
}

export class FakeUploader {
  public uploads: Upload[] = []

  async upload({ fileName }) {
    const link = `https://www.ignite-test-05-attachments.com/${fileName}/${randomUUID}`
    this.uploads.push({
      link,
      fileName,
    })

    return { link }
  }
}
