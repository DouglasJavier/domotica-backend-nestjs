import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Alarma } from './entity/alarmas.entity'
import { AlarmaController } from './controller/alarma.controller'
import { AlarmaService } from './service/alarma.service'
import { AlarmaRepository } from './repository/alarma.repository'
import { HistorialActivarDesactivarRepository } from 'src/app/historialActivarDesactivar/historialActivarDesactivar.repository'
import { AlarmaContactoRepository } from 'src/app/alarma/repository/alarmasContactos.repository'
import { ubicacionAlarmaRepository } from './repository/ubicacionAlarma.repository'
import { DispositivoRepository } from 'src/app/dispositivos/repository/dispositivo.repository'
import { HistorialIncidentesService } from 'src/app/historialIncidentes/historialIncidentes.service'
import { HistorialIncidenteRepository } from 'src/app/historialIncidentes/historialIncidentes.repository'
import { SensorActuadorRepository } from 'src/app/dispositivos/repository/sensor_actuador.repository'
import { MensajeriaService } from '../mensajeria/mensajeria.service'
import { UsuarioRepository } from 'src/core/usuario/usuario.repository'

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
    MensajeriaService,
    UsuarioRepository,
  ],
  exports: [AlarmaService],
})
export class AlarmaModule {}
