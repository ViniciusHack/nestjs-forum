interface UploaderParams {
  body: Buffer
  fileName: string
  fileType: string
}

export abstract class Uploader {
  abstract upload({
    body,
    fileName,
    fileType,
  }: UploaderParams): Promise<{ link: string }>
}
