import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmaContacto } from './alarmasContactos.entity';
import { AlarmaContactoRepository } from './alarmasContactos.repository';

@Injectable()
export class AlarmaContactoService {
  constructor(
    @InjectRepository(AlarmaContactoRepository)
    private carsRepository: Repository<AlarmaContacto>,
  ) {}
}
