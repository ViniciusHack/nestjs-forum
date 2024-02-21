import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-acoount.controller'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './src/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
