import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorActuador } from '../entity/sensor_actuador.entity';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(SensorActuador)
    private sensorRepository: Repository<SensorActuador>,
  ) {}
}
