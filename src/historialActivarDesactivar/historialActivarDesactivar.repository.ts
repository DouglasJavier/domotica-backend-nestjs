import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarCRUDType } from './dto/historialActivarDesactivarCRUDType';

@Injectable()
export class HistorialActivarDesactivarRepository {
  constructor(private dataSource: DataSource) {}

  async crear(
    historialDto: HistorialActivarDesactivarCRUDType,
    transaction: EntityManager,
  ) {
    const historial = new HistorialActivarDesactivar();
    historial.accion = historialDto.accion;
    historial.fecha = historialDto.fecha;
    historial.idAlarma = historialDto.idAlarma;
    historial.idUsuario = historialDto.idUsuario;
    return await transaction
      .getRepository(HistorialActivarDesactivar)
      .save(historial);
  }
}
