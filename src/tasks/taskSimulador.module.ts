import { Module } from '@nestjs/common';
import { TaskSimuladorService } from './taskSimulador.service';
import { SimuladorActuadorRepository } from 'src/simulador/repository/simulador_actuador.repository';
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository';

@Module({
  imports: [], // Importa el módulo HttpModule para realizar solicitudes HTTP
  providers: [
    TaskSimuladorService,
    SimuladorActuadorRepository,
    AlarmaRepository,
  ],
  exports: [TaskSimuladorService],
})
export class TaskSimuladorModule {}
