import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Dispositivo } from '../entity/dispositivo.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto'
import { SensorActuador } from '../entity/sensor_actuador.entity'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  DispositivoConts,
  Status,
  TipoSalidaSensor,
} from 'src/common/constants'

@Injectable()
export class DispositivoRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto?: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .leftJoin(
        'dispositivo.sensoresActuadores',
        'sensorActuador',
        'sensorActuador.estado = :estado2',
        { estado2: Status.ACTIVE }
      )
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
        'ubicacionSensorActuador.id',
        'ubicacionDispositivo.nombre',
        'ubicacionDispositivo.id',
      ])
      .where('dispositivo.estado = :estado', { estado: Status.ACTIVE })

    if (limite) query.take(limite)
    if (salto) query.skip(salto)
    switch (campo) {
      case 'id':
        query.addOrderBy('dispositivo.id', sentido)
        break
      case 'nombre':
        query.addOrderBy('dispositivo.nombre', sentido)
        break
      case 'tipo':
        query.addOrderBy('dispositivo.tipo', sentido)
        break
      default:
        query.orderBy('dispositivo.id', 'ASC')
    }
    return await query.getManyAndCount()
  }

  async listarCompleto() {
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .leftJoin(
        'dispositivo.sensoresActuadores',
        'sensorActuador',
        'sensorActuador.estado = :estado2',
        { estado2: Status.ACTIVE }
      )
      .leftJoin('sensorActuador.ubicacion', 'ubicacionSensorActuador')
      .select([
        'dispositivo',
        'sensorActuador.id',
        'sensorActuador.tipo',
        'sensorActuador.descripcion',
        'sensorActuador.pin',
        'ubicacionSensorActuador.nombre',
        'ubicacionSensorActuador.id',
        'ubicacionDispositivo.nombre',
        'ubicacionDispositivo.id',
      ])
      .where('dispositivo.estado = :estado', { estado: Status.ACTIVE })
    return await query.getMany()
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
      .where('dispositivo.id = :id', { id: idDispositivo })
      .andWhere('sensorActuador.estado = :estado', { estado: Status.ACTIVE })
    return query.getOne()
  }
  async crear(dispositivoDto: DispositivoCrearDto, transaction: EntityManager) {
    const nuevoDispositivo = new Dispositivo()
    nuevoDispositivo.nombre = dispositivoDto.nombre
    nuevoDispositivo.tipo = dispositivoDto.tipo
    nuevoDispositivo.idUbicacion = dispositivoDto.idUbicacion
    nuevoDispositivo.direccionLan = dispositivoDto.direccionLan
    nuevoDispositivo.direccionWan = dispositivoDto.direccionWan
    nuevoDispositivo.contrasenia = dispositivoDto.contrasenia
    nuevoDispositivo.estado = 'ACTIVO'
    const dispositivo = await transaction
      .getRepository(Dispositivo)
      .save(nuevoDispositivo)
    const sensoresActuadores: QueryDeepPartialEntity<SensorActuador>[] =
      dispositivoDto.sensoresActuadores.map((sensorActuador) => {
        const nuevoSensorActuador = new SensorActuador()
        nuevoSensorActuador.tipo = sensorActuador.tipo
        nuevoSensorActuador.descripcion = sensorActuador.descripcion
        nuevoSensorActuador.idDispositivo = dispositivo.id
        nuevoSensorActuador.idUbicacion =
          sensorActuador.idUbicacion || nuevoDispositivo.idUbicacion
        nuevoSensorActuador.pin = sensorActuador.pin
        nuevoSensorActuador.tipoSalida = TipoSalidaSensor.pullDown.includes(
          sensorActuador.descripcion
        )
          ? 'pullDown'
          : TipoSalidaSensor.pullUp.includes(sensorActuador.descripcion)
          ? 'pullUp'
          : ''
        nuevoSensorActuador.estado = 'ACTIVO'
        return nuevoSensorActuador
      })
    await transaction
      .createQueryBuilder()
      .insert()
      .into(SensorActuador)
      .values(sensoresActuadores)
      .execute()
    return dispositivo
  }
  async actualizar(
    id: string,
    dispositivoDto: Partial<Dispositivo>,
    transaction: EntityManager
  ) {
    const disp = dispositivoDto
    delete disp.sensoresActuadores
    const datosActualizar: QueryDeepPartialEntity<Dispositivo> =
      new Dispositivo({
        ...disp,
      })
    return await transaction
      .createQueryBuilder()
      .update(Dispositivo)
      .set(datosActualizar)
      .where({ id: id })
      .execute()
  }

  async listarCamaras() {
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.ubicacion', 'ubicacionDispositivo')
      .select([
        'dispositivo.id',
        'dispositivo.nombre',
        'dispositivo.direccionLan',
        'dispositivo.direccionWan',
        'dispositivo.contrasenia',
        'ubicacionDispositivo.nombre',
        'ubicacionDispositivo.id',
      ])
      .where('dispositivo.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('dispositivo.tipo = :tipo', { tipo: DispositivoConts.ESP32CAM })
    return await query.getManyAndCount()
  }
  async buscarPorIdUbicacionesSensoresTipo(
    idUbicaciones: string[],
    tipoBienes: string[],
    tipoHumo: string[],
    tipoAlumbrado: string[]
  ) {
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.sensoresActuadores', 'sensorActuador')
      .select([
        'dispositivo',
        'sensorActuador.pin',
        'sensorActuador.tipoSalida',
      ])
      .where('sensorActuador.idUbicacion IN (:...idUbicaciones)', {
        idUbicaciones,
      })
      .andWhere('dispositivo.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('sensorActuador.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('sensorActuador.tipo = :tipo', { tipo: 'SENSOR' })

    // Se agregan condiciones de filtro basadas en las descripciones
    if (
      tipoBienes.length > 0 ||
      tipoHumo.length > 0 ||
      tipoAlumbrado.length > 0
    ) {
      query.andWhere('sensorActuador.descripcion IN (:...descripciones)', {
        descripciones: [...tipoBienes, ...tipoHumo, ...tipoAlumbrado],
      })
    }

    return query.getMany()
  }

  async buscarPorDescricionSensoresActuadores(tipo: string) {
    const query = this.dataSource
      .getRepository(Dispositivo)
      .createQueryBuilder('dispositivo')
      .leftJoin('dispositivo.sensoresActuadores', 'sensorActuador')
      .select(['dispositivo', 'sensorActuador.pin'])
      .where('sensorActuador.descripcion = :tipo', { tipo })
      .andWhere('dispositivo.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('sensorActuador.estado = :estado', { estado: 'ACTIVO' })
    return query.getMany()
  }

  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }
}
