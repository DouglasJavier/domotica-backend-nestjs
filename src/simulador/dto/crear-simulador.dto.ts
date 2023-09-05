export class SimuladorCrearDto {
  nombre: string;
  simuladoresActuadores: SimuladorActuadorDto[];
}
export class SimuladorActuadorDto {
  idActuador: string;
  horarios: HorarioDto[];
}
export class HorarioDto {
  horaInicio: string;
  horaFin: string;
}
