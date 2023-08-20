import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UbicacionAlarma } from './ubicacionesAlarmas.entity';

@Injectable()
export class UbicacionAlarmaService {
  constructor(
    @InjectRepository(UbicacionAlarma)
    private ubicacionAlarmaRepository: Repository<UbicacionAlarma>,
  ) {}
}
