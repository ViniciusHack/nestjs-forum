import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator {
  // constructor(private readonly salt: number) {}
  private HASH_SALT_LENGTH = 8

  hash(plaintext: string): Promise<string> {
    return hash(plaintext, this.HASH_SALT_LENGTH)
  }

  compare(plaintext: string, hash: string): Promise<boolean> {
    return compare(plaintext, hash)
  }
}
