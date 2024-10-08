import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity'
import { HistorialActivarDesactivarCRUDType } from './dto/historialActivarDesactivarCRUDType'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'

@Injectable()
export class HistorialActivarDesactivarRepository {
  constructor(private dataSource: DataSource) {}

  async crear(
    historialDto: HistorialActivarDesactivarCRUDType,
    transaction: EntityManager
  ) {
    const historial = new HistorialActivarDesactivar()
    historial.accion = historialDto.accion
    historial.fecha = historialDto.fecha
    historial.idAlarma = historialDto.idAlarma
    historial.idUsuario = historialDto.idUsuario
    historial.estado = 'ACTIVO'
    return await transaction
      .getRepository(HistorialActivarDesactivar)
      .save(historial)
  }
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, pagina, campo, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(HistorialActivarDesactivar)
      .createQueryBuilder('historialActivarDesactivar')
      .leftJoin('historialActivarDesactivar.usuario', 'usuario')
      .leftJoin('historialActivarDesactivar.alarma', 'alarma')
      .select([
        'historialActivarDesactivar',
        'usuario.id',
        'usuario.nombres',
        'usuario.apellidos',
        'alarma.id',
        'alarma.nombre',
      ])
      .where('historialActivarDesactivar.estado != :estado', {
        estado: 'INACTIVO',
      })
    /* .skip((pagina - 1) * limite)
      .take(limite) */

    switch (campo) {
      case 'id':
        query.addOrderBy('historialActivarDesactivar.id', sentido)
        break
      case 'fecha':
        query.addOrderBy('historialActivarDesactivar.fecha', sentido)
        break
      default:
        query.orderBy('historialActivarDesactivar.id', 'DESC')
    }
    if (pagina) query.skip((pagina - 1) * limite)
    if (limite) query.take(limite)
    return await query.getManyAndCount()
  }
  async inactivar(id: string, transaction: EntityManager) {
    return await transaction
      .getRepository(HistorialActivarDesactivar)
      .createQueryBuilder()
      .update(HistorialActivarDesactivar)
      .set({
        estado: 'INACTIVO',
      })
      .where('id = :id', { id })
      .execute()
  }
  async inactivarPorFecha(
    fechaInicio: string,
    fechaFin: string,
    transaction: EntityManager
  ) {
    return await transaction
      .getRepository(HistorialActivarDesactivar)
      .createQueryBuilder()
      .update(HistorialActivarDesactivar)
      .set({
        estado: 'INACTIVO',
      })
      .where('fecha >= :fecha1', { fecha1: fechaInicio })
      .andWhere('fecha <= :fecha2', { fecha2: fechaFin })
      .execute()
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }
}
