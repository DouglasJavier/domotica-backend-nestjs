import { Module } from '@nestjs/common';
import { TaskSimuladorService } from './taskSimulador.service';
import { SimuladorActuadorRepository } from 'src/simulador/repository/simulador_actuador.repository';

@Module({
  imports: [], // Importa el módulo HttpModule para realizar solicitudes HTTP
  providers: [TaskSimuladorService, SimuladorActuadorRepository],
  exports: [TaskSimuladorService],
})
export class TaskSimuladorModule {}
