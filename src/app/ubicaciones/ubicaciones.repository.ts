import { Injectable } from '@nestjs/common'
import { Brackets, DataSource } from 'typeorm'
import { PaginacionQueryDto } from '../../common/dto/paginacionDto'
import { Ubicacion } from './ubicaciones.entity'
import { CrearUbicacionDto } from './dto/crear-ubicacionDto'

@Injectable()
export class UbicacionRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Ubicacion)
      .createQueryBuilder('ubicacion')
      .leftJoin('ubicacion.dispositivos', 'dispositivos')
      .leftJoin('ubicacion.sensores', 'sensores')
      .leftJoin('ubicacion.ubicacionesAlarmas', 'ubicacionesAlarmas')
      .leftJoin('ubicacionesAlarmas.alarma', 'alarma')
      .select(['ubicacion.id', 'ubicacion.nombre', 'ubicacion.estado'])
      .where('ubicacion.estado != :estado', { estado: 'INACTIVO' })
    if (limite) query.take(limite)
    if (salto) query.skip(salto)
    switch (campo) {
      case 'id':
        query.addOrderBy('ubicacion.id', sentido)
        break
      case 'nombre':
        query.addOrderBy('ubicacion.nombre', sentido)
        break
      default:
        query.orderBy('ubicacion.id', 'ASC')
    }
    return await query.getManyAndCount()
  }
  async crear(ubicacionDto: CrearUbicacionDto) {
    return await this.dataSource
      .getRepository(Ubicacion)
      .save(new Ubicacion({ ...ubicacionDto, estado: 'ACTIVO' }))
  }
  async actualizar(id: string, productoDto: Partial<Ubicacion>) {
    return await this.dataSource.getRepository(Ubicacion).update(
      id,
      new Ubicacion({
        ...productoDto,
      })
    )
  }
}
