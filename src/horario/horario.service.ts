import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horarios } from './horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horarios)
    private horariosRepository: Repository<Horarios>,
  ) {}
}
