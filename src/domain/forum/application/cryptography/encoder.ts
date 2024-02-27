export abstract class Encoder {
  abstract encrypt(value: string): Promise<string>
}
