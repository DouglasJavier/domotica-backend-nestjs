import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto';
import { HistorialIncidenteRepository } from './historialIncidentes.repository';
import { RegistroIncidenteDto } from './dto/crear-historialIncidenteDto';
import { SensorActuadorRepository } from 'src/dispositivos/repository/sensor_actuador.repository';
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class HistorialIncidentesService {
  constructor(
    private historialIncidentesRepositorio: HistorialIncidenteRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialIncidentesRepositorio.listar(
      paginacionQueryDto,
    );
    return result;
  }

  async crear(registroIncidenteDto: RegistroIncidenteDto) {
    const sensor = await this.sensorActuadorRepositorio.buscarPorPinDisposotivo(
      registroIncidenteDto.idDispositivo,
      registroIncidenteDto.pin,
    );
    if (!sensor) throw new NotFoundException('No se encontró el sensor');
    const alarma = await this.alarmaRepositorio.buscarAlarmaEncendida();
    if (!alarma) throw new NotFoundException('No se encontró la alarma');
    const historialIncidente = this.historialIncidentesRepositorio.crear({
      idSensor: sensor.id,
      idAlarma: alarma.id,
      fecha: new Date(),
    });
    return historialIncidente;
  }

  async inactivarPorFecha(intervaloFecha: IntervaloFechasDto) {
    //const fechaInicio = new Date(intervaloFecha.fechaInicio);
    //const fechaFin = new Date(intervaloFecha.fechaFin);
    const op = async (transaction: EntityManager) => {
      const result =
        await this.historialIncidentesRepositorio.inactivarPorFecha(
          intervaloFecha.fechaInicio,
          intervaloFecha.fechaFin,
          transaction,
        );
      return result;
    };
    return this.historialIncidentesRepositorio.runTransaction(op);
  }

  async inactivar(idHistorial: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.historialIncidentesRepositorio.inactivar(
        idHistorial,
        transaction,
      );
      return result;
    };
    return this.historialIncidentesRepositorio.runTransaction(op);
  }
}
