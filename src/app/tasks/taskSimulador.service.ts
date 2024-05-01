import { Injectable } from '@nestjs/common'
import { Cron, CronExpression, Interval } from '@nestjs/schedule'
import axios from 'axios'
import { AlarmaRepository } from 'src/app/alarma/repository/alarma.repository'
import { SimuladorActuadorRepository } from 'src/app/simulador/repository/simulador_actuador.repository'
import { DispositivoRepository } from '../dispositivos/repository/dispositivo.repository'

@Injectable()
export class TaskSimuladorService {
  constructor(
    private simuladorActuadorRepositorio: SimuladorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository,
    private dispositivoRepositorio: DispositivoRepository
  ) {}

  @Interval(Number(100000))
  async handleCronTracing() {
    const dispositivos = await this.dispositivoRepositorio.listarCompleto()
    for (let index = 0; index < dispositivos.length; index++) {
      const dispositivo = dispositivos[index]
      try {
        await axios.post(`http://${dispositivo.direccionLan}`)
      } catch (error) {
        console.log(
          'error de coneccion con el revalidador ' + dispositivo.direccionLan
        )
      }
    }
  }

  /* @Cron(CronExpression.EVERY_10_MINUTES)
  async comprobarRevalidacion() {
    try {
      console.log('revalidando :' + process.env.URL_REVALIDATE)
      await axios.get(`${process.env.URL_REVALIDATE}/status`)
    } catch (error) {
      console.log(
        'error de conexion con el revalidador ' + process.env.URL_REVALIDATE
      )
    }
  } */

  @Cron(CronExpression.EVERY_MINUTE) // Puedes ajustar la frecuencia según tus necesidades
  async handleCron() {
    // Verifica los horarios y ejecuta las acciones en consecuencia
    const alarmaActiva = await this.alarmaRepositorio.buscarEncendido()
    console.log('################# ALARMA ACTIVA #################')
    console.log(alarmaActiva)
    if (alarmaActiva.length > 0) {
      const result =
        await this.simuladorActuadorRepositorio.listarActuadoresSimulador(
          alarmaActiva[0].id
        )
      console.log('Similador actuador:')
      console.log(result)
      const now = new Date()
      const actuadores = result

      for (let index = 0; index < actuadores.length; index++) {
        const actuador = actuadores[index]
        console.log('-----------Horarios-----------')
        console.log(actuador.horarios)
        console.log(actuador.actuador.dispositivo)
        console.log('------------------------------')
        for (let j = 0; j < actuador.horarios.length; j++) {
          const horario = actuador.horarios[j]

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
            try {
              await axios.post(
                `http://${actuador.actuador.dispositivo.direccionLan}/alumbradoAutomatico`,
                {
                  alumbradoAutomatico: false,
                },
                {
                  headers: {
                    Authorization: `Bearer ${actuador.actuador.dispositivo.contrasenia}`,
                  },
                }
              )
              await axios.post(
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
            } catch (error) {
              console.log(
                'error al enviar acción a ' +
                  actuador.actuador.dispositivo.direccionLan
              )
            }
          }
          if (
            horaActualHoras === horaFinHoras &&
            horaActualMinutos === horaFinMinutos
          ) {
            console.log('APAGAR')
            try {
              await axios.post(
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
              await axios.post(
                `http://${actuador.actuador.dispositivo.direccionLan}/alumbradoAutomatico`,
                {
                  alumbradoAutomatico: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${actuador.actuador.dispositivo.contrasenia}`,
                  },
                }
              )
            } catch (error) {
              console.log(
                'error al enviar acción a ' +
                  actuador.actuador.dispositivo.direccionLan
              )
            }
          }
        }
      }
    }
  }
}
