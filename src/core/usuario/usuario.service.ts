import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsuarioCRUDType } from './dto/UsuarioCRUDType'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { UsuarioRepository } from './usuario.repository'
import { Usuario } from './usuario.entity'

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.usuarioRepositorio.listar(paginacionQueryDto)
  }

  async crear(contactoDto: UsuarioCRUDType) {
    contactoDto.contrasenia = '123'
    const contacto = await this.usuarioRepositorio.crear(contactoDto)
    return contacto
  }

  async actualizar(id: string, contactoDto: UsuarioCRUDType) {
    const result = await this.usuarioRepositorio.actualizar(id, contactoDto)
    return result
  }

  async _actualizar(id: string, usuarioDto: Partial<Usuario>) {
    const result = await this.usuarioRepositorio.actualizar(id, usuarioDto)
    return result
  }

  async buscarPorUser(user: string) {
    const result = await this.usuarioRepositorio.buscarPorUser(user)
    return result
  }
  async activar(id: string) {
    const result = await this.usuarioRepositorio.actualizar(id, {
      estado: 'ACTIVO',
    })
    return result
  }

  async inactivar(id: string) {
    const result = await this.usuarioRepositorio.actualizar(id, {
      estado: 'INACTIVO',
    })
    return result
  }
}
