import { Module } from '@nestjs/common'
import { SimuladorActuadorRepository } from 'src/app/simulador/repository/simulador_actuador.repository'
import { AlarmaRepository } from 'src/app/alarma/repository/alarma.repository'
import { TaskSimuladorService } from './taskSimulador.service'
import { DispositivoRepository } from '../dispositivos/repository/dispositivo.repository'

@Module({
  imports: [], // Importa el módulo HttpModule para realizar solicitudes HTTP
  providers: [
    TaskSimuladorService,
    SimuladorActuadorRepository,
    AlarmaRepository,
    DispositivoRepository,
  ],
  exports: [TaskSimuladorService],
})
export class TaskSimuladorModule {}
