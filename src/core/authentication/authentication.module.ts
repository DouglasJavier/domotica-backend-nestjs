// auth.module.ts
import { Module } from '@nestjs/common'
import { AuthController } from './authentication.controller'
import { AuthService } from './authentication.service'

import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import { UsuarioRepository } from '../usuario/usuario.repository'
import { UsuarioService } from '../usuario/usuario.service'
import { DispositivoAuthModule } from './dispositivo/dispositivo-auth.module'
import { JwtAuthModule } from './usuario/jwt-auth.module'
import { LocalAuthModule } from './usuario/local-auth.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [JwtAuthModule, LocalAuthModule, DispositivoAuthModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    UsuarioService,
    UsuarioRepository,
    DispositivoRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
