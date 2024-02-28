export abstract class Encoder {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
