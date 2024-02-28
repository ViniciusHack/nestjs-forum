import { Encoder } from '@/domain/forum/application/cryptography/encoder'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncoder } from './jwt-encoder'

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: Encoder,
      useClass: JwtEncoder,
    },
  ],
  exports: [HashGenerator, Encoder, HashComparer],
})
export class CryptographyModule {}
