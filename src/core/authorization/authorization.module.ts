import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  exports: [],
  controllers: [],
  providers: [ConfigService],
})
export class AuthorizationModule {}
