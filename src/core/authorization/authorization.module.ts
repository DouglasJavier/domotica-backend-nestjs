import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CasbinRule } from './entity/casbin.entity'

@Module({
  imports: [ConfigModule],
  exports: [],
  controllers: [],
  providers: [ConfigService],
})
export class AuthorizationModule {}
