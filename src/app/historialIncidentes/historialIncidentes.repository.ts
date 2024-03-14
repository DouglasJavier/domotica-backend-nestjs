import { Injectable, NotFoundException } from '@nestjs/common'
import { Brackets, DataSource, EntityManager } from 'typeorm'
import { PaginacionQueryDto } from '../../common/dto/paginacionDto'
import { HistorialIncidentes } from './historialIncidentes.entity'
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones.entity'
import { CrearHistorialIncidentesDto } from './dto/crear-historialIncidenteDto'
import { Fotos } from './fotos.entity'
import { Status } from 'src/common/constants'

@Injectable()
export class HistorialIncidenteRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido, estado } = paginacionQueryDto

    const query = this.dataSource
      .getRepository(HistorialIncidentes)
      .createQueryBuilder('historialIncidentes')
      .leftJoin('historialIncidentes.fotos', 'fotos')
      .leftJoin('historialIncidentes.alarma', 'alarma')
      .leftJoin('historialIncidentes.sensor', 'sensor')
      .leftJoin('sensor.ubicacion', 'ubicacion')
      .select([
        'historialIncidentes',
        'fotos',
        'alarma.id',
        'alarma.nombre',
        'alarma.estado',
        'sensor.id',
        'sensor.pin',
        'sensor.tipo',
        'sensor.descripcion',
        'ubicacion',
      ])
      .where('historialIncidentes.estado != :estado2', { estado2: 'INACTIVO' })
    if (limite) query.take(limite)
    if (salto) query.skip(salto)
    if (estado)
      query.andWhere('historialIncidentes.estado = :estado', { estado })
    switch (campo) {
      case 'id':
        query.addOrderBy('historialIncidentes.id', sentido)
        break
      case 'fecha':
        query.addOrderBy('historialIncidentes.fecha', sentido)
        break
      default:
        query.orderBy('historialIncidentes.id', 'DESC')
    }
    return await query.getManyAndCount()
  }

  async buscarPorId(id: string) {
    const result = await this.dataSource
      .getRepository(HistorialIncidentes)
      .createQueryBuilder('historialIncidente')
      .leftJoin('historialIncidente.alarma', 'alarma')
      .select(['historialIncidente', 'alarma'])
      .where('historialIncidente.id = :id', { id: id })
      .getOne()
    return result
  }

  async crear(
    insidenteDto: CrearHistorialIncidentesDto,
    transaction?: EntityManager
  ) {
    const nuevoHistorialIncidentes = new HistorialIncidentes()
    nuevoHistorialIncidentes.fecha = insidenteDto.fecha
    nuevoHistorialIncidentes.idAlarma = insidenteDto.idAlarma
    nuevoHistorialIncidentes.idSensor = insidenteDto.idSensor
    nuevoHistorialIncidentes.estado = 'DESATENDIDO'

    const result = await (
      transaction?.getRepository(HistorialIncidentes) ??
      this.dataSource.getRepository(HistorialIncidentes)
    ).save(nuevoHistorialIncidentes)
    /* insidenteDto.fotos.map(async (foto) => {
      const nuevaFoto = new Fotos()
      nuevaFoto.foto = foto
      nuevaFoto.idIncidente = result.id
      await this.dataSource.getRepository(Fotos).save(nuevaFoto)
    }) */
    return result
  }
  async inactivar(id: string, transaction: EntityManager) {
    return await transaction
      .getRepository(HistorialIncidentes)
      .createQueryBuilder()
      .update(HistorialIncidentes)
      .set({
        estado: 'INACTIVO',
      })
      .where('id = :id', { id })
      .execute()
  }
  async cambiarEstados(id: string, estado: string, usuarioAuditoria: string) {
    return await this.dataSource
      .getRepository(HistorialIncidentes)
      .createQueryBuilder()
      .update(HistorialIncidentes)
      .set({
        estado: estado,
        idUsuarioAuditoria: usuarioAuditoria,
      })
      .where('id = :id', { id })
      .execute()
  }
  async inactivarPorFecha(
    fechaInicio: string,
    fechaFin: string,
    transaction: EntityManager
  ) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    console.log(fechaInicio)
    console.log(fechaFin)
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

    return await transaction
      .getRepository(HistorialIncidentes)
      .createQueryBuilder()
      .update(HistorialIncidentes)
      .set({
        estado: 'INACTIVO',
      })
      .where('fecha >= :fecha1', { fecha1: fechaInicio })
      .andWhere('fecha <= :fecha2', { fecha2: fechaFin })
      .andWhere('estado != :estado', { estado: Status.DESATENDIDO })
      .execute()
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }
}
