import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulador } from './simulador.entity';
import { SimuladorController } from './simulador.controller';
import { SimuladorService } from './simulador.service';

@Module({
  imports: [TypeOrmModule.forFeature([Simulador])],
  controllers: [SimuladorController],
  providers: [SimuladorService],
  exports: [SimuladorService],
})
export class SimuladorModule {}
