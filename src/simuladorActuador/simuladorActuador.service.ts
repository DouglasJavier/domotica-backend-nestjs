import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimuladorActuador } from './simuladorActuador.entity';

@Injectable()
export class SimuladorActuadorService {
  constructor(
    @InjectRepository(SimuladorActuador)
    private simuladorActuadorRepository: Repository<SimuladorActuador>,
  ) {}
}
