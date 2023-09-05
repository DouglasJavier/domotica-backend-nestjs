import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Simulador } from '../entity/simulador.entity';
import { SimuladorCrearDto } from '../dto/crear-simulador.dto';

@Injectable()
export class SimuladorRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto;
    const query = this.dataSource
      .getRepository(Simulador)
      .createQueryBuilder('simulador')
      .leftJoin('simulador.simuladoresActuadores', 'simuladorActuador')
      .leftJoin('simuladorActuador.horarios', 'horario')
      .select([
        'simulador.id',
        'simulador.nombre',
        'simuladorActuador.idActuador',
        'horario.horaInicio',
        'horario.horaFin',
      ])
      .where('simulador.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('simuladorActuador.estado = :estado')
      .andWhere('horario.estado = :estado');

    if (limite) query.take(limite);
    if (salto) query.skip(salto);
    switch (campo) {
      case 'id':
        query.addOrderBy('simulador.id', sentido);
        break;
      case 'nombre':
        query.addOrderBy('simulador.nombre', sentido);
        break;
      default:
        query.orderBy('simulador.id', 'ASC');
    }
    return await query.getManyAndCount();
  }
  async crear(simuladorDto: SimuladorCrearDto, transaction: EntityManager) {
    const nuevoSimulador = new Simulador();
    nuevoSimulador.nombre = simuladorDto.nombre;
    nuevoSimulador.estado = 'ACTIVO';
    const simulador = await transaction
      .getRepository(Simulador)
      .save(nuevoSimulador);

    return simulador;
  }
  async actualizar(
    id: string,
    simuladorDto: Partial<Simulador>,
    transaction: EntityManager,
  ) {
    const simulador = simuladorDto;
    delete simulador.simuladoresActuadores;
    const datosActualizar: QueryDeepPartialEntity<Simulador> = new Simulador({
      ...simulador,
    });
    return await transaction
      .createQueryBuilder()
      .update(Simulador)
      .set(datosActualizar)
      .where({ id: id })
      .execute();
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op);
  }
}
