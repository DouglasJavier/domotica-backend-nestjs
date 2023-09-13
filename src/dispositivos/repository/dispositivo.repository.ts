import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Dispositivo } from '../entity/dispositivo.entity';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto';
import { SensorActuador } from '../entity/sensor_actuador.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class DispositivoRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto;
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .leftJoin('dispositivo.sensoresActuadores', 'sensorActuador')
      .leftJoin('sensorActuador.ubicacion', 'ubicacionSensorActuador')
      .select([
        'dispositivo.id',
        'dispositivo.nombre',
        'dispositivo.tipo',
        'dispositivo.direccionLan',
        'dispositivo.direccionWan',
        'sensorActuador.id',
        'sensorActuador.tipo',
        'sensorActuador.descripcion',
        'sensorActuador.pin',
        'ubicacionSensorActuador.nombre',
        'ubicacionDispositivo.nombre',
      ])
      .where('dispositivo.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('sensorActuador.estado = :estado');

    if (limite) query.take(limite);
    if (salto) query.skip(salto);
    switch (campo) {
      case 'id':
        query.addOrderBy('dispositivo.id', sentido);
        break;
      case 'nombre':
        query.addOrderBy('dispositivo.nombre', sentido);
        break;
      case 'tipo':
        query.addOrderBy('dispositivo.tipo', sentido);
        break;
      default:
        query.orderBy('dispositivo.id', 'ASC');
    }
    return await query.getManyAndCount();
  }
  async buscarPorId(idDispositivo: string) {
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .leftJoin('dispositivo.sensoresActuadores', 'sensorActuador')
      .leftJoin('sensorActuador.ubicacion', 'ubicacionSensorActuador')
      .select([
        'dispositivo',
        'sensorActuador',
        'ubicacionSensorActuador',
        'ubicacionDispositivo',
      ])
      .where('dispositivo.id = :id', { id: idDispositivo });
    return query.getOne();
  }
  async crear(dispositivoDto: DispositivoCrearDto, transaction: EntityManager) {
    const nuevoDispositivo = new Dispositivo();
    nuevoDispositivo.nombre = dispositivoDto.nombre;
    nuevoDispositivo.tipo = dispositivoDto.tipo;
    nuevoDispositivo.idUbicacion = dispositivoDto.idUbicacion;
    nuevoDispositivo.direccionLan = dispositivoDto.direccionLan;
    nuevoDispositivo.direccionWan = dispositivoDto.direccionWan;
    nuevoDispositivo.estado = 'ACTIVO';
    const dispositivo = await transaction
      .getRepository(Dispositivo)
      .save(nuevoDispositivo);
    const sensoresActuadores: QueryDeepPartialEntity<SensorActuador>[] =
      dispositivoDto.sensoresActuadores.map((sensorActuador) => {
        const nuevoSensorActuador = new SensorActuador();
        nuevoSensorActuador.tipo = sensorActuador.tipo;
        nuevoSensorActuador.descripcion = sensorActuador.descripcion;
        nuevoSensorActuador.idDispositivo = dispositivo.id;
        nuevoSensorActuador.idUbicacion =
          sensorActuador.idUbicacion || nuevoDispositivo.idUbicacion;
        nuevoSensorActuador.pin = sensorActuador.pin;
        nuevoSensorActuador.estado = 'ACTIVO';
        return nuevoSensorActuador;
      });
    await transaction
      .createQueryBuilder()
      .insert()
      .into(SensorActuador)
      .values(sensoresActuadores)
      .execute();
    return dispositivo;
  }
  async actualizar(
    id: string,
    dispositivoDto: Partial<Dispositivo>,
    transaction: EntityManager,
  ) {
    const disp = dispositivoDto;
    delete disp.sensoresActuadores;
    const datosActualizar: QueryDeepPartialEntity<Dispositivo> =
      new Dispositivo({
        ...disp,
      });
    return await transaction
      .createQueryBuilder()
      .update(Dispositivo)
      .set(datosActualizar)
      .where({ id: id })
      .execute();
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op);
  }
}
