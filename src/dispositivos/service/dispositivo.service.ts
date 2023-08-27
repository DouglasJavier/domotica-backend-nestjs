import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispositivo } from '../entity/dispositivo.entity';
import { DispositivoRepository } from '../repository/dispositivo.repository';

@Injectable()
export class DispositivoService {
  constructor(
    @Inject(DispositivoRepository)
    private dispositivoRepository: DispositivoRepository,
  ) {}
}
