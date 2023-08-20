import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarRepository } from './historialActivarDesactivar.repository';

@Injectable()
export class HistorialActivarDesactivarService {
  constructor(
    @Inject(HistorialActivarDesactivarRepository)
    private hisorialActivarDesactivarRepository: HistorialActivarDesactivarRepository,
  ) {}
}
