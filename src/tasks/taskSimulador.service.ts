import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { SimuladorActuadorRepository } from 'src/simulador/repository/simulador_actuador.repository';

@Injectable()
export class TaskSimuladorService {
  constructor(
    private simuladorActuadorRepositorio: SimuladorActuadorRepository,
  ) {}

  @Interval(Number(10000))
  async handleCronTracing() {
    /* const result =
      await this.simuladorActuadorRepositorio.listarActuadoresSimulador('1');
    console.log('##################################');
    console.log(result);
    console.log('##################################'); */
  }

  /* @Cron(CronExpression.EVERY_MINUTE) // Puedes ajustar la frecuencia según tus necesidades
  async handleCron() {
    // Verifica los horarios y ejecuta las acciones en consecuencia
    const result =
      await this.simuladorActuadorRepositorio.listarActuadoresSimulador('1');
    console.log('##################################');
    console.log(result);
    console.log('##################################');
    /* const now = new Date();
    const actuadores = [
      {
        pin: 14,
        horarios: [
          { horaInicio: '19:30', horaFin: '20:02' },
          { horaInicio: '14:02', horaFin: '21:01' },
        ],
      },
      {
        pin: 15,
        horarios: [
          { horaInicio: '18:40', horaFin: '11:36' },
          { horaInicio: '13:21', horaFin: '13:59' },
        ],
      },
    ];

    actuadores.forEach((actuador) => {
      actuador.horarios.forEach((horario) => {
        const horaInicio = new Date(now);
        horaInicio.setHours(
          Number(horario.horaInicio.split(':')[0]),
          Number(horario.horaInicio.split(':')[1]),
          0,
        );

        const horaFin = new Date(now);
        horaFin.setHours(
          Number(horario.horaFin.split(':')[0]),
          Number(horario.horaFin.split(':')[1]),
          0,
        );

        if (now >= horaInicio && now <= horaFin) {
          // Estamos dentro del horario, ejecuta la acción correspondiente
          // this.actuadorService.encenderActuador(actuador.pin);
          console.log('ENCENDER');
        } else {
          // Fuera del horario, apaga el actuador si estaba encendido
          // this.actuadorService.apagarActuador(actuador.pin);
          console.log('APAGAR');
        }
      });
    }); */
  /*  } */
}
