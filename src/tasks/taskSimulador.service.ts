import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron, CronExpression, Interval } from '@nestjs/schedule'
import axios from 'axios'
import e from 'express'
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository'
import { SimuladorActuadorRepository } from 'src/simulador/repository/simulador_actuador.repository'

@Injectable()
export class TaskSimuladorService {
  constructor(
    private simuladorActuadorRepositorio: SimuladorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository
  ) {}

  @Interval(Number(10000))
  async handleCronTracing() {
    /* const result =
      await this.simuladorActuadorRepositorio.listarActuadoresSimulador('1');
    console.log('##################################');
    console.log(result);
    console.log('##################################'); */
  }

  @Cron(CronExpression.EVERY_MINUTE) // Puedes ajustar la frecuencia según tus necesidades
  async handleCron() {
    // Verifica los horarios y ejecuta las acciones en consecuencia
    const alarmaActiva = await this.alarmaRepositorio.buscarEncendido()
    console.log('################# ALARMA #################')
    console.log(alarmaActiva)
    console.log('##################################')
    if (alarmaActiva.length > 0) {
      const result =
        await this.simuladorActuadorRepositorio.listarActuadoresSimulador(
          alarmaActiva[0].id
        )
      console.log('################# RESULT #################')
      console.log(result)
      console.log('##################################')
      const now = new Date()
      const actuadores = result

      actuadores.forEach((actuador) => {
        console.log('xxxxxxxxxxxxhorarioxxxxxxxxxxxx')
        console.log(actuador.horarios)
        console.log(actuador.actuador.dispositivo)
        console.log('xxxxxxxxxxxxxxxxxxxxxxxx')
        actuador.horarios.forEach(async (horario) => {
          const horaInicio = new Date(horario.horaInicio)
          const horaFin = new Date(horario.horaFin)

          const horaActualHoras = now.getHours()
          const horaActualMinutos = now.getMinutes()
          const horaInicioHoras = horaInicio.getHours()
          const horaInicioMinutos = horaInicio.getMinutes()
          const horaFinHoras = horaFin.getHours()
          const horaFinMinutos = horaFin.getMinutes()
          if (
            horaActualHoras === horaInicioHoras &&
            horaActualMinutos === horaInicioMinutos
          ) {
            console.log('ENCENDER')
            const respuestaAccion = await axios
              .post(
                `http://${actuador.actuador.dispositivo.direccionLan}/actuador`,
                {
                  pin: actuador.actuador.pin,
                  accion: 'ENCENDER',
                },
                {
                  headers: {
                    Authorization: `Bearer ${actuador.actuador.dispositivo.contrasenia}`,
                  },
                }
              )
              .catch((error) => {
                console.log(error)
                throw new NotFoundException('error al enviar acción')
              })
          }
          if (
            horaActualHoras === horaFinHoras &&
            horaActualMinutos === horaFinMinutos
          ) {
            console.log('APAGAR')
            const respuestaAccion = await axios
              .post(
                `http://${actuador.actuador.dispositivo.direccionLan}/actuador`,
                {
                  pin: actuador.actuador.pin,
                  accion: 'APAGAR',
                },
                {
                  headers: {
                    Authorization: `Bearer ${actuador.actuador.dispositivo.contrasenia}`,
                  },
                }
              )
              .catch((error) => {
                console.log(error)
                throw new NotFoundException('error al enviar acción')
              })
          }
        })
      })
    }
  }
}
