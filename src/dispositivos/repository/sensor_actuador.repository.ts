import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SensorActuador } from '../entity/sensor_actuador.entity';
import { SensorActuadorDto } from '../dto/crear-dispositivo.dto';

@Injectable()
export class SensorActuadorRepository {
  constructor(private dataSource: DataSource) {}
  async _inactivar(idDispositivo: string, transaction: EntityManager) {
    return await transaction
      .getRepository(SensorActuador)
      .createQueryBuilder()
      .update(SensorActuador)
      .set({
        estado: 'INACTIVO',
      })
      .where('id_dispositivo = :idDispositivo', { idDispositivo })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute();
  }
  async _crear(
    idDispositivo: string,
    idUbicacion: string,
    sensoresActuadores: SensorActuadorDto[],
    transaction: EntityManager,
  ) {
    const sensorActuador: SensorActuador[] = sensoresActuadores.map(
      (sensorActuador) => {
        const nuevoSensorActuador = new SensorActuador();
        nuevoSensorActuador.idDispositivo = idDispositivo;
        nuevoSensorActuador.descripcion = sensorActuador.descripcion;
        nuevoSensorActuador.estado = 'ACTIVO';
        nuevoSensorActuador.idUbicacion =
          sensorActuador.idUbicacion || idUbicacion;
        nuevoSensorActuador.pin = sensorActuador.pin;
        nuevoSensorActuador.tipo = sensorActuador.tipo;
        return nuevoSensorActuador;
      },
    );
    return await transaction
      .createQueryBuilder()
      .insert()
      .into(SensorActuador)
      .values(sensorActuador)
      .execute();
  }
  async buscarPorPinDisposotivo(idDispositivo: string, pin: string) {
    const query = this.dataSource
      .getRepository(SensorActuador)
      .createQueryBuilder('sensorActuador')
      .leftJoin('sensorActuador.dispositivo', 'dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .leftJoin('sensorActuador.ubicacion', 'ubicacionSensorActuador')
      .select([
        'sensorActuador',
        'dispositivo',
        'ubicacionSensorActuador',
        'ubicacionDispositivo',
      ])
      .where('dispositivo.id = :id', { id: idDispositivo })
      .andWhere('sensorActuador.pin = :pin', { pin })
      .andWhere('sensorActuador.tipo = :tipo', { tipo: 'SENSOR' })
      .andWhere('sensorActuador.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('dispositivo.estado = :estado');
    return query.getOne();
  }

  async listarActuadores() {
    const query = this.dataSource
      .getRepository(SensorActuador)
      .createQueryBuilder('sensorActuador')
      .leftJoin('sensorActuador.ubicacion', 'ubicacionSensorActuador')
      .select(['sensorActuador', 'ubicacionSensorActuador'])
      .andWhere('sensorActuador.tipo = :tipo', { tipo: 'ACTUADOR' })
      .andWhere('sensorActuador.estado = :estado', { estado: 'ACTIVO' });
    return query.getManyAndCount();
  }
}
