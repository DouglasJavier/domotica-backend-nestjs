import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { SimuladorActuador } from '../entity/simulador_actuador.entity'
import { SimuladorActuadorDto } from '../dto/crear-simulador.dto'

@Injectable()
export class SimuladorActuadorRepository {
  constructor(private dataSource: DataSource) {}
  async _inactivar(idSimulador: string, transaction: EntityManager) {
    return await transaction
      .getRepository(SimuladorActuador)
      .createQueryBuilder()
      .update(SimuladorActuador)
      .set({
        estado: 'INACTIVO',
      })
      .where('id_simulador = :idSimulador', { idSimulador })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute()
  }
  async crear(
    idSimulador: string,
    simuladorActuador: SimuladorActuadorDto,
    transaction: EntityManager
  ) {
    const nuevoSimuladorActuador = new SimuladorActuador()
    nuevoSimuladorActuador.idSimulador = idSimulador
    nuevoSimuladorActuador.idActuador = simuladorActuador.idActuador
    nuevoSimuladorActuador.estado = 'ACTIVO'
    const simulador = await transaction
      .getRepository(SimuladorActuador)
      .save(nuevoSimuladorActuador)
    return simulador
  }
  async listarActuadoresSimulador(idAlarma: string) {
    const query = this.dataSource
      .getRepository(SimuladorActuador)
      .createQueryBuilder('simuladorActuador')
      .leftJoin('simuladorActuador.simulador', 'simulador')
      .leftJoin('simulador.alarmas', 'alarma')
      .leftJoin('simuladorActuador.actuador', 'actuador')
      .leftJoin('actuador.dispositivo', 'dispositivo')
      .leftJoin('simuladorActuador.horarios', 'horario')
      .select([
        'simulador.id',
        'alarma.id',
        'simuladorActuador',
        'simulador',
        'actuador.pin',
        'dispositivo',
        'horario.horaInicio',
        'horario.horaFin',
      ])
      .where('simuladorActuador.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('dispositivo.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('alarma.id = :idAlarma', { idAlarma })

    return query.getMany()
  }
}
