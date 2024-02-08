import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { AuthService } from '../authentication.service'
import { UsuarioService } from 'src/core/usuario/usuario.service'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import { JwtService } from '@nestjs/jwt'
import { UsuarioRepository } from 'src/core/usuario/usuario.repository'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'local',
    }),
  ],
  providers: [
    LocalStrategy,
    AuthService,
    UsuarioService,
    DispositivoRepository,
    JwtService,
    UsuarioRepository,
  ],
  exports: [LocalStrategy],
})
export class LocalAuthModule {}
