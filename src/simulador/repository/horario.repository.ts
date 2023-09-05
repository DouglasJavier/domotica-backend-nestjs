import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { HorarioDto } from '../dto/crear-simulador.dto';
import { Horario } from '../entity/horario.entity';

@Injectable()
export class HorarioRepository {
  constructor(private dataSource: DataSource) {}
  async _inactivar(idSimuladorActuador: string, transaction: EntityManager) {
    return await transaction
      .getRepository(Horario)
      .createQueryBuilder()
      .update(Horario)
      .set({
        estado: 'INACTIVO',
      })
      .where('id_simulador_actuador = :idSimuladorActuador', {
        idSimuladorActuador,
      })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute();
  }
  async _crear(
    idSimuladorActuador: string,
    horarios: HorarioDto[],
    transaction: EntityManager,
  ) {
    const nuevosHorarios: Horario[] = horarios.map((horario) => {
      const nuevoHorario = new Horario();
      nuevoHorario.idSimuladorActuador = idSimuladorActuador;
      nuevoHorario.horaInicio = horario.horaInicio;
      nuevoHorario.horaFin = horario.horaFin;
      return nuevoHorario;
    });
    return await transaction
      .createQueryBuilder()
      .insert()
      .into(Horario)
      .values(nuevosHorarios)
      .execute();
  }
}
