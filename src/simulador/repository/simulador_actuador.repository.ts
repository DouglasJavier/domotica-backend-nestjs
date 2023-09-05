import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SimuladorActuador } from '../entity/simulador_actuador.entity';
import { SimuladorActuadorDto } from '../dto/crear-simulador.dto';

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
      .execute();
  }
  async crear(
    idSimulador: string,
    simuladorActuador: SimuladorActuadorDto,
    transaction: EntityManager,
  ) {
    const nuevoSimuladorActuador = new SimuladorActuador();
    nuevoSimuladorActuador.idSimulador = idSimulador;
    nuevoSimuladorActuador.idActuador = simuladorActuador.idActuador;
    nuevoSimuladorActuador.estado = 'ACTIVO';
    const simulador = await transaction
      .getRepository(SimuladorActuador)
      .save(nuevoSimuladorActuador);
    return simulador;
  }
}
