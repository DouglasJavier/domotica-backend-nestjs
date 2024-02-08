import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './authentication.controller'
import { AuthService } from './authentication.service'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import { UsuarioRepository } from '../usuario/usuario.repository'
import { UsuarioService } from '../usuario/usuario.service'
import { DispositivoStrategy } from './dispositivo.strategy'
import { PassportModule } from '@nestjs/passport'

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
    DispositivoStrategy,
    JwtStrategy,
    LocalStrategy,
    UsuarioService,
    UsuarioRepository,
    DispositivoRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
