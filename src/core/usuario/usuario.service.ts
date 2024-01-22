import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsuarioCRUDType, UsuarioEditarType } from './dto/UsuarioCRUDType'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { UsuarioRepository } from './usuario.repository'
import { Usuario } from './usuario.entity'
import { TextService } from 'src/common/lib/text.service'

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.usuarioRepositorio.listar(paginacionQueryDto)
  }

  async verPerfil(idUsuario: string) {
    const result = await this.usuarioRepositorio.buscarPorId(idUsuario)
    if (!result) throw new UnauthorizedException('Usuario no encontrado')
    delete result.contrasenia
    delete result.intentos
    return result
  }

  async crear(contactoDto: UsuarioCRUDType) {
    const DEFAULT_PASS = '123'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    contactoDto.contrasenia = pass
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

  async editar(id: string, usuarioDto: UsuarioEditarType) {
    const usuario = await this.usuarioRepositorio.buscarPorId(id)
    if (usuario.estado === 'BLOQUADO')
      throw new UnauthorizedException('Usuario bloqueado')
    const pass = await TextService.decodeBase64(usuarioDto.contrasenia1)
    if (!(await TextService.compare(pass, usuario.contrasenia))) {
      await this._actualizar(usuario.id, {
        intentos: usuario.intentos + 1,
      })
      if (usuario.intentos + 1 > 5)
        await this._actualizar(usuario.id, {
          estado: 'BLOQUEADO',
        })
      throw new BadRequestException('Credenciales invalidos')
    }

    if (usuarioDto.contrasenia2) {
      const pass = await TextService.decodeBase64(usuarioDto.contrasenia2)
      const pass2 = await TextService.encrypt(pass)
      await this._actualizar(id, {
        contrasenia: pass2,
      })
    }

    const result = await this._actualizar(id, {
      usuario: usuarioDto.usuario,
    })

    return result
  }

  async activar(id: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(id)
    if (usuario.estado !== 'INACTIVO' && usuario.estado !== 'BLOQUEADO')
      throw new BadRequestException('Accion no permitida')

    const result = await this.usuarioRepositorio.actualizar(id, {
      estado: 'ACTIVO',
      intentos: 0,
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
