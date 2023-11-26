import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Dispositivo } from '../entity/dispositivo.entity';
import { DispositivoRepository } from '../repository/dispositivo.repository';
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto';
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto';
import { SensorActuadorRepository } from '../repository/sensor_actuador.repository';
import axios from 'axios';

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

  async crear(dispositivoDto: DispositivoCrearDto) {
    const op = async (transaction: EntityManager) => {
      const dispositivo = await this.dispositivoRepositorio.crear(
        dispositivoDto,
        transaction,
      );
      const respuestaDisp = await axios
        .post(`http://${dispositivoDto.direccionLan}/conf_pin`, {
          idDispositivo: dispositivo.id,
          sensoresActuadores: dispositivoDto.sensoresActuadores,
        })
        .catch((err) => {
          throw new NotFoundException('Direcion de dispositivo no valida');
        });
      if (!respuestaDisp) {
        throw new NotFoundException('Respuesta invalida');
      }
      return dispositivo;
    };
    return this.dispositivoRepositorio.runTransaction(op);
  }

  async actualizar(id: string, dispositivoDto: DispositivoCrearDto) {
    const dispositivo = await this.dispositivoRepositorio.buscarPorId(id);
    console.log(dispositivoDto.sensoresActuadores);
    const respuestaDisp = await axios
      .post(`http://${dispositivoDto.direccionLan}/conf_pin`, {
        idDispositivo: dispositivo.id,
        sensoresActuadores: dispositivoDto.sensoresActuadores,
      })
      .catch((err) => {
        throw new NotFoundException('Direcion de dispositivo no valida');
      });
    if (!respuestaDisp) {
      throw new NotFoundException('Respuesta invalida');
    }
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

  async listarActuadores() {
    return await this.sensorActuadorRepositorio.listarActuadores();
  }
  async listarCamaras() {
    return await this.dispositivoRepositorio.listarCamaras();
  }
}
