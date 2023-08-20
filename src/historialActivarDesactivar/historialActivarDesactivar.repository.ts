import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarCRUDType } from './dto/historialActivarDesactivarCRUDType';

@Injectable()
export class HistorialActivarDesactivarRepository {
  constructor(private dataSource: DataSource) {}

  async crear(historialDto: HistorialActivarDesactivarCRUDType) {
    const historial = new HistorialActivarDesactivar();
    historial.accion = historialDto.accion;
    historial.fecha = historialDto.fecha;
    historial.idAlarma = historialDto.idAlarma;
    historial.idUsuario = historialDto.idUsuario;
    return await this.dataSource
      .getRepository(HistorialActivarDesactivar)
      .save(historial);
  }
}
