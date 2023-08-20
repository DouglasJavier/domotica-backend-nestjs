import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actuador } from './actuador.entity';
import { ActuadorController } from './actuador.controller';
import { ActuadorService } from './actuador.service';

@Module({
  imports: [TypeOrmModule.forFeature([Actuador])],
  controllers: [ActuadorController],
  providers: [ActuadorService],
  exports: [ActuadorService],
})
export class ActuadorModule {}
