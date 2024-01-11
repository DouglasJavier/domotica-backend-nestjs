import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Simulador } from './entity/simulador.entity'
import { SimuladorController } from './controller/simulador.controller'
import { SimuladorService } from './service/simulador.service'
import { SimuladorRepository } from './repository/simulador.repository'
import { SimuladorActuadorRepository } from './repository/simulador_actuador.repository'
import { HorarioRepository } from './repository/horario.repository'
import { SimuladorActuador } from './entity/simulador_actuador.entity'
import { Horario } from './entity/horario.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Horario, Simulador, SimuladorActuador]),
    Horario,
  ],
  controllers: [SimuladorController],
  providers: [
    SimuladorService,
    SimuladorRepository,
    SimuladorActuadorRepository,
    HorarioRepository,
  ],
  exports: [SimuladorService],
})
export class SimuladorModule {}
