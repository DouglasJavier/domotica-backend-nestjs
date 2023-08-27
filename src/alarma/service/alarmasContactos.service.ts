import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmaContacto } from '../entity/alarmasContactos.entity';
import { AlarmaContactoRepository } from '../repository/alarmasContactos.repository';

@Injectable()
export class AlarmaContactoService {
  constructor(
    @InjectRepository(AlarmaContactoRepository)
    private carsRepository: Repository<AlarmaContacto>,
  ) {}
}
