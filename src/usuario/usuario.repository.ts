import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { Usuario } from './usuario.entity';
import { UsuarioCRUDType } from './dto/UsuarioCRUDType';

@Injectable()
export class UsuarioRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto;
    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario'])
      .where('usuario.estado = :estado', { estado: 'ACTIVO' });
    //.andWhere('alarmaUsuarios.estado = :estado');
    if (limite) query.take(limite);
    if (salto) query.skip(salto);
    switch (campo) {
      case 'id':
        query.addOrderBy('usuario.id', sentido);
        break;
      case 'nombres':
        query.addOrderBy('usuario.nombres', sentido);
        break;
      case 'apellidos':
        query.addOrderBy('usuario.nombres', sentido);
        break;
      case 'usuario':
        query.addOrderBy('usuario.usuario', sentido);
        break;
      default:
        query.orderBy('usuario.id', 'ASC');
    }
    return await query.getManyAndCount();
  }
  async crear(usuarioDto: UsuarioCRUDType) {
    return await this.dataSource
      .getRepository(Usuario)
      .save(new Usuario({ ...usuarioDto, estado: 'ACTIVO' }));
  }
  async actualizar(id: string, contactoDto: Partial<Usuario>) {
    return await this.dataSource.getRepository(Usuario).update(
      id,
      new Usuario({
        ...contactoDto,
      }),
    );
  }
}
