import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Simulador } from '../entity/simulador.entity';
import { SimuladorRepository } from '../repository/simulador.repository';
import { SimuladorActuadorRepository } from '../repository/simulador_actuador.repository';
import { HorarioRepository } from '../repository/horario.repository';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { SimuladorCrearDto } from '../dto/crear-simulador.dto';

@Injectable()
export class SimuladorService {
  constructor(
    private simuladorRepositorio: SimuladorRepository,
    private simuladorActuadorRepositorio: SimuladorActuadorRepository,
    private horarioRepositorio: HorarioRepository,
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.simuladorRepositorio.listar(paginacionQueryDto);
  }

  async crear(simuladorDto: SimuladorCrearDto) {
    const op = async (transaction: EntityManager) => {
      const dispositivo = await this.simuladorRepositorio.crear(
        simuladorDto,
        transaction,
      );
      for (let i = 0; i < simuladorDto.simuladoresActuadores.length; i++) {
        const simuladorActuador = simuladorDto.simuladoresActuadores[i];
        const simuladorActuadorResult =
          await this.simuladorActuadorRepositorio.crear(
            dispositivo.id,
            simuladorActuador,
            transaction,
          );
        await this.horarioRepositorio._crear(
          simuladorActuadorResult.id,
          simuladorActuador.horarios,
          transaction,
        );
      }
      return dispositivo;
    };
    return this.simuladorRepositorio.runTransaction(op);
  }

  async actualizar(id: string, simuladorDto: SimuladorCrearDto) {
    const op = async (transaction: EntityManager) => {
      const result = await this.simuladorRepositorio.actualizar(
        id,
        {
          nombre: simuladorDto.nombre,
        },
        transaction,
      );
      await this.simuladorActuadorRepositorio._inactivar(id, transaction);
      for (let i = 0; i < simuladorDto.simuladoresActuadores.length; i++) {
        const simuladorActuador = simuladorDto.simuladoresActuadores[i];
        const simuladorActuadorResult =
          await this.simuladorActuadorRepositorio.crear(
            id,
            simuladorActuador,
            transaction,
          );
        await this.horarioRepositorio._crear(
          simuladorActuadorResult.id,
          simuladorActuador.horarios,
          transaction,
        );
      }
      return { id };
    };
    return this.simuladorRepositorio.runTransaction(op);
  }

  async activar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.simuladorRepositorio.actualizar(
        id,
        {
          estado: 'ACTIVO',
        },
        transaction,
      );
      return { id };
    };
    return this.simuladorRepositorio.runTransaction(op);
  }

  async inactivar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.simuladorRepositorio.actualizar(
        id,
        {
          estado: 'INACTIVO',
        },
        transaction,
      );
      return { id };
    };
    return this.simuladorRepositorio.runTransaction(op);
  }
}
