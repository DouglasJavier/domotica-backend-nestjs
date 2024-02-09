import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Alarma } from '../entity/alarmas.entity'
import { AlarmaCRUDType } from '../dto/alarmaCRUDType'
import { Simulador } from 'src/simulador/entity/simulador.entity'
import { AlarmaContacto } from 'src/alarma/entity/alarmasContactos.entity'
import { UbicacionAlarma } from 'src/alarma/entity/ubicacionesAlarmas.entity'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Status } from 'src/common/constants'

@Injectable()
export class AlarmaRepository {
  constructor(private dataSource: DataSource) {}
  async listaAlarmas() {
    const respuesta = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .leftJoin(
        'alarma.alarmaContactos',
        'alarmaContacto',
        'alarmaContacto.estado != :estado',
        { estado: Status.ACTIVE }
      )
      .leftJoin('alarmaContacto.contacto', 'contacto')
      .leftJoin('alarma.ubicacionAlarmas', 'ubicacionAlarmas')
      .leftJoin('ubicacionAlarmas.ubicacion', 'ubicacion')
      .leftJoin('alarma.simulador', 'simulador')
      .select([
        'alarma',
        'alarmaContacto.id',
        'contacto.id',
        'contacto.nombre',
        'contacto.apellido',
        'ubicacionAlarmas.id',
        'ubicacion.id',
        'ubicacion.nombre',
        'simulador.id',
        'simulador.nombre',
      ])
      .orderBy('alarma.id', 'DESC')
      .andWhere('alarma.estado != :estado', { estado: 'INACTIVO' })
      .getManyAndCount()
    return respuesta
  }
  async buscarPorId(id: string) {
    const alarma = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .leftJoin('alarma.ubicacionAlarmas', 'ubicaciones')
      .leftJoin('alarma.alarmaContactos', 'alarmaContactos')
      .leftJoin('alarmaContactos.contacto', 'contacto')
      .select(['alarma', 'alarmaContactos.id', 'contacto'])
      .where('alarma.id = :id', { id: id })
      .andWhere('alarmaContactos.estado = :estado', { estado: Status.ACTIVE })
      .getOne()
    if (!alarma) throw new NotFoundException('Articulo no encontrado')
    return alarma
  }
  async buscarAlarmaEncendida() {
    const alarma = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .select(['alarma'])
      .where('alarma.estado = :estado', { estado: 'ENCENDIDO' })
      .getOne()
    return alarma
  }
  async buscarEncendido() {
    const alarma = await this.dataSource
      .getRepository(Alarma)
      .createQueryBuilder('alarma')
      .select(['alarma'])
      .where('alarma.estado = :estado', { estado: 'ENCENDIDO' })
      .getMany()
    if (!alarma) throw new NotFoundException('Articulo no encontrado')
    return alarma
  }
  async crear(alarmaDto: AlarmaCRUDType, transaction: EntityManager) {
    const alarma = new Alarma()
    alarma.nombre = alarmaDto.nombre
    alarma.seguridadBienes = alarmaDto.seguridadBienes
    alarma.sensoresHumo = alarmaDto.sensoresHumo
    alarma.envio_noti = alarmaDto.envio_noti
    alarma.idSimulador = alarmaDto.idSimulador || null
    alarma.sonido = alarmaDto.sonido
    alarma.alumbradoAutomatico = alarmaDto.alumbradoAutomatico
    alarma.estado = 'ACTIVO'
    const result = await transaction.getRepository(Alarma).save(alarma)
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(alarmaDto.idContactos)
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    await alarmaDto.idContactos.map(async (idContacto) => {
      const alarmaContacto = new AlarmaContacto()
      alarmaContacto.idContacto = idContacto
      alarmaContacto.idAlarma = result.id
      alarmaContacto.estado = 'ACTIVO'
      await transaction.getRepository(AlarmaContacto).save(alarmaContacto)
    })
    await alarmaDto.idUbicaciones.map(async (idUbicacion) => {
      const alarmaUbicacion = new UbicacionAlarma()
      alarmaUbicacion.idUbicacion = idUbicacion
      alarmaUbicacion.idAlarma = result.id
      alarmaUbicacion.estado = 'ACTIVO'
      await transaction.getRepository(UbicacionAlarma).save(alarmaUbicacion)
    })
    return result
  }
  async actualizar(
    id: string,
    alarmaDto: Partial<Alarma>,
    transaction: EntityManager
  ) {
    const alarma = alarmaDto
    delete alarma.alarmaContactos
    delete alarma.ubicacionAlarmas
    delete alarma.historialActivarDesactivar
    delete alarma.historialIncidentes

    const datosActualizar: QueryDeepPartialEntity<Alarma> = new Alarma({
      ...alarmaDto,
    })
    return await transaction
      .createQueryBuilder()
      .update(Alarma)
      .set(datosActualizar)
      .where({ id: id })
      .execute()
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }
}
