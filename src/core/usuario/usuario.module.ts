import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './usuario.entity'
import { UsuarioController } from './usuario.controller'
import { UsuarioService } from './usuario.service'
import { UsuarioRepository } from './usuario.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
  exports: [UsuarioService],
})
export class UsuarioModule {}
