import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class JwtAuthModule {}
