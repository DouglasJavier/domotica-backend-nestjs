import { Injectable } from '@nestjs/common';
import { Brackets, DataSource } from 'typeorm';
import { PaginacionQueryDto } from '../common/dto/paginacionDto';
import { Ubicacion } from './ubicaciones.entity';
import { CrearUbicacionDto } from './dto/crear-ubicacionDto';

@Injectable()
export class UbicacionRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto;
    const query = this.dataSource
      .getRepository(Ubicacion)
      .createQueryBuilder('ubicacion')
      .select(['ubicacion.id', 'ubicacion.nombre']);
    if (limite) query.take(limite);
    if (salto) query.skip(salto);
    switch (campo) {
      case 'id':
        query.addOrderBy('ubicacion.id', sentido);
        break;
      case 'nombre':
        query.addOrderBy('ubicacion.nombre', sentido);
        break;
      default:
        query.orderBy('ubicacion.id', 'ASC');
    }
    return await query.getManyAndCount();
  }
  async crear(ubicacionDto: CrearUbicacionDto) {
    return await this.dataSource
      .getRepository(Ubicacion)
      .save(new Ubicacion({ ...ubicacionDto }));
  }
  async editar(id: string, productoDto: CrearUbicacionDto) {
    return await this.dataSource.getRepository(Ubicacion).update(
      id,
      new Ubicacion({
        ...productoDto,
      }),
    );
  }
}
