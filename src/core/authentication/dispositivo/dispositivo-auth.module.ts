import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { DispositivoStrategy } from './dispositivo.strategy'
import { JwtService } from '@nestjs/jwt'
import { UsuarioRepository } from 'src/core/usuario/usuario.repository'
import { UsuarioService } from 'src/core/usuario/usuario.service'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import { AuthService } from '../authentication.service'

@Module({
  imports: [],
  providers: [
    DispositivoStrategy,
    AuthService,
    UsuarioService,
    DispositivoRepository,
    JwtService,
    UsuarioRepository,
  ],
  exports: [DispositivoStrategy],
})
export class DispositivoAuthModule {}
