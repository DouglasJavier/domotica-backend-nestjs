import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, EntityManager } from 'typeorm';
import { PaginacionQueryDto } from '../common/dto/paginacionDto';
import { HistorialIncidentes } from './historialIncidentes.entity';
import { Ubicacion } from 'src/ubicaciones/ubicaciones.entity';
import { CrearHistorialIncidentesDto } from './dto/crear-historialIncidenteDto';

@Injectable()
export class HistorialIncidenteRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto;

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
      .where('historialIncidentes.estado != :estado', { estado: 'INACTIVO' });
    switch (campo) {
      case 'id':
        query.addOrderBy('historialIncidentes.id', sentido);
        break;
      case 'fecha':
        query.addOrderBy('historialIncidentes.fecha', sentido);
        break;
      default:
        query.orderBy('historialIncidentes.id', 'DESC');
    }
    return await query.getManyAndCount();
  }
  async crear(insidenteDto: CrearHistorialIncidentesDto) {
    const nuevoHistorialIncidentes = new HistorialIncidentes();
    nuevoHistorialIncidentes.fecha = insidenteDto.fecha;
    nuevoHistorialIncidentes.idAlarma = insidenteDto.idAlarma;
    nuevoHistorialIncidentes.idSensor = insidenteDto.idSensor;
    nuevoHistorialIncidentes.estado = 'ACTIVO';
    return await this.dataSource
      .getRepository(HistorialIncidentes)
      .save(nuevoHistorialIncidentes);
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
      .execute();
  }
  async inactivarPorFecha(
    fechaInicio: string,
    fechaFin: string,
    transaction: EntityManager,
  ) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    console.log(fechaInicio);
    console.log(fechaFin);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    return await transaction
      .getRepository(HistorialIncidentes)
      .createQueryBuilder()
      .update(HistorialIncidentes)
      .set({
        estado: 'INACTIVO',
      })
      .where('fecha >= :fecha1', { fecha1: fechaInicio })
      .andWhere('fecha <= :fecha2', { fecha2: fechaFin })
      .execute();
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op);
  }
}
