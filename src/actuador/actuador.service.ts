import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actuador } from './actuador.entity';

@Injectable()
export class ActuadorService {
  constructor(
    @InjectRepository(Actuador)
    private actuadorRepository: Repository<Actuador>,
  ) {}
}
