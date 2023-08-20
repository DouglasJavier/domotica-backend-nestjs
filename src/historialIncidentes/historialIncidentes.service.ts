import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialIncidentes } from './historialIncidentes.entity';

@Injectable()
export class HistorialIncidentesService {
  constructor(
    @InjectRepository(HistorialIncidentes)
    private historialIncidentesRepository: Repository<HistorialIncidentes>,
  ) {}
}
