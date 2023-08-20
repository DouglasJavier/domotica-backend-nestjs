import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialIncidentes } from './historialIncidentes.entity';
import { HistorialIncidentesController } from './historialIncidentes.controller';
import { HistorialIncidentesService } from './historialIncidentes.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialIncidentes])],
  controllers: [HistorialIncidentesController],
  providers: [HistorialIncidentesService],
  exports: [HistorialIncidentesService],
})
export class HistorialIncidentesModule {}
