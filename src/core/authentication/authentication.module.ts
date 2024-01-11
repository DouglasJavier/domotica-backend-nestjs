import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './authentication.controller'
import { AuthService } from './authentication.service'
import { JwtStrategy } from './jwt.strategy'
import { UsuarioService } from '../usuario/usuario.service'
import { UsuarioRepository } from '../usuario/usuario.repository'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
          secret: process.env.JWT_SECRET,
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    UsuarioService,
    UsuarioRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
