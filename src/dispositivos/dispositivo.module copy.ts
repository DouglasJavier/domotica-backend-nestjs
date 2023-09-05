import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Horario } from 'src/simulador/entity/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Horario])],
})
export class HorarioModule {}
