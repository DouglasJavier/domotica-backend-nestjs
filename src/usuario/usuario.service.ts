import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioCRUDType } from './dto/UsuarioCRUDType';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(UsuarioRepository)
    private contactoRepositorio: UsuarioRepository,
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.contactoRepositorio.listar(paginacionQueryDto);
  }

  async crear(contactoDto: UsuarioCRUDType) {
    const contacto = await this.contactoRepositorio.crear(contactoDto);
    return contacto;
  }

  async actualizar(id: string, contactoDto: UsuarioCRUDType) {
    const result = await this.contactoRepositorio.actualizar(id, contactoDto);
    return result;
  }

  async activar(id: string) {
    const result = await this.contactoRepositorio.actualizar(id, {
      estado: 'ACTIVO',
    });
    return result;
  }

  async inactivar(id: string) {
    const result = await this.contactoRepositorio.actualizar(id, {
      estado: 'INACTIVO',
    });
    return result;
  }
}
