import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HistorialIncidentes } from './historialIncidentes.entity'
import { HistorialIncidentesController } from './historialIncidentes.controller'
import { HistorialIncidentesService } from './historialIncidentes.service'
import { Fotos } from './fotos.entity'
import { HistorialIncidenteRepository } from './historialIncidentes.repository'
import { SensorActuadorRepository } from 'src/dispositivos/repository/sensor_actuador.repository'
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'

@Module({
  imports: [TypeOrmModule.forFeature([HistorialIncidentes, Fotos])],
  controllers: [HistorialIncidentesController],
  providers: [
    HistorialIncidentesService,
    HistorialIncidenteRepository,
    SensorActuadorRepository,
    AlarmaRepository,
    DispositivoRepository,
  ],
  exports: [HistorialIncidentesService],
})
export class HistorialIncidentesModule {}
