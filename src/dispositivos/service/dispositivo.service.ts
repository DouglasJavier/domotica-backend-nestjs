import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Dispositivo } from '../entity/dispositivo.entity';
import { DispositivoRepository } from '../repository/dispositivo.repository';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto';
import { SensorActuadorRepository } from '../repository/sensor_actuador.repository';

@Injectable()
export class DispositivoService {
  constructor(
    @Inject(DispositivoRepository)
    private dispositivoRepositorio: DispositivoRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository,
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.dispositivoRepositorio.listar(paginacionQueryDto);
  }

  async crear(ubicacionDto: DispositivoCrearDto) {
    const op = async (transaction: EntityManager) => {
      const dispositivo = await this.dispositivoRepositorio.crear(
        ubicacionDto,
        transaction,
      );
      return dispositivo;
    };
    return this.dispositivoRepositorio.runTransaction(op);
  }

  async actualizar(id: string, dispositivoDto: DispositivoCrearDto) {
    const op = async (transaction: EntityManager) => {
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          ...dispositivoDto,
          sensoresActuadores: [],
        },
        transaction,
      );
      await this.sensorActuadorRepositorio._inactivar(id, transaction);
      await this.sensorActuadorRepositorio._crear(
        id,
        dispositivoDto.idUbicacion,
        dispositivoDto.sensoresActuadores,
        transaction,
      );
      return { id };
    };
    return this.dispositivoRepositorio.runTransaction(op);
  }

  async activar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          estado: 'ACTIVO',
        },
        transaction,
      );
      return { id };
    };
    return this.dispositivoRepositorio.runTransaction(op);
  }

  async inactivar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          estado: 'INACTIVO',
        },
        transaction,
      );
      return { id };
    };
    return this.dispositivoRepositorio.runTransaction(op);
  }
}
