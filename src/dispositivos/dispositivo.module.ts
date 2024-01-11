import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dispositivo } from './entity/dispositivo.entity'
import { DispositivoController } from './controller/dispositivo.controller'
import { DispositivoService } from './service/dispositivo.service'
import { SensorActuador } from './entity/sensor_actuador.entity'
import { DispositivoRepository } from './repository/dispositivo.repository'
import { SensorActuadorRepository } from './repository/sensor_actuador.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Dispositivo, SensorActuador])],
  controllers: [DispositivoController],
  providers: [
    DispositivoService,
    DispositivoRepository,
    SensorActuadorRepository,
  ],
  exports: [DispositivoService],
})
export class DispositivoModule {}
