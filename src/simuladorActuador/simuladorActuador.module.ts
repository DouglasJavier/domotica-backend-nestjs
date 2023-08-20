import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimuladorActuador } from './simuladorActuador.entity';
import { SimuladorActuadorController } from './simuladorActuador.controller';
import { SimuladorActuadorService } from './simuladorActuador.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimuladorActuador])],
  controllers: [SimuladorActuadorController],
  providers: [SimuladorActuadorService],
  exports: [SimuladorActuadorService],
})
export class SimuladorActuadorModule {}
