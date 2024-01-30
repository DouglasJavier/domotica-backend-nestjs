import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Alarma } from './entity/alarmas.entity'
import { AlarmaController } from './controller/alarma.controller'
import { AlarmaService } from './service/alarma.service'
import { AlarmaRepository } from './repository/alarma.repository'
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository'
import { AlarmaContactoRepository } from 'src/alarma/repository/alarmasContactos.repository'
import { ubicacionAlarmaRepository } from './repository/ubicacionAlarma.repository'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import { HistorialIncidentesService } from 'src/historialIncidentes/historialIncidentes.service'
import { HistorialIncidenteRepository } from 'src/historialIncidentes/historialIncidentes.repository'
import { SensorActuadorRepository } from 'src/dispositivos/repository/sensor_actuador.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Alarma])],
  controllers: [AlarmaController],
  providers: [
    AlarmaService,
    AlarmaRepository,
    HistorialActivarDesactivarRepository,
    AlarmaContactoRepository,
    ubicacionAlarmaRepository,
    DispositivoRepository,
    HistorialIncidentesService,
    HistorialIncidenteRepository,
    SensorActuadorRepository,
  ],
  exports: [AlarmaService],
})
export class AlarmaModule {}
