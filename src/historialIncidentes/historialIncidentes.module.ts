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
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository'
import { AuthService } from 'src/core/authentication/authentication.service'
import { UsuarioService } from 'src/core/usuario/usuario.service'
import { JwtService } from '@nestjs/jwt'
import { UsuarioRepository } from 'src/core/usuario/usuario.repository'

@Module({
  imports: [TypeOrmModule.forFeature([HistorialIncidentes, Fotos])],
  controllers: [HistorialIncidentesController],
  providers: [
    HistorialIncidentesService,
    HistorialIncidenteRepository,
    SensorActuadorRepository,
    AlarmaRepository,
    DispositivoRepository,
    HistorialActivarDesactivarRepository,
    AuthService,
    UsuarioService,
    JwtService,
    UsuarioRepository,
  ],
  exports: [HistorialIncidentesService],
})
export class HistorialIncidentesModule {}
