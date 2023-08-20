import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Simulador } from './simulador.entity';

@Injectable()
export class SimuladorService {
  constructor(
    @InjectRepository(Simulador)
    private simuladorRepository: Repository<Simulador>,
  ) {}
}
