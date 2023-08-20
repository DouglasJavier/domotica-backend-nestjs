import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horarios } from './horario.entity';
import { HorariosController } from './horario.controller';
import { HorariosService } from './horario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Horarios])],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService],
})
export class HorariosModule {}
