import { Encoder } from '@/domain/forum/application/cryptography/encoder'

export class FakeEncoder implements Encoder {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
