import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto'
import { HistorialIncidenteRepository } from './historialIncidentes.repository'
import {
  AtencionIncidentesDto,
  RegistroIncidenteDto,
} from './dto/crear-historialIncidenteDto'
import { SensorActuadorRepository } from 'src/dispositivos/repository/sensor_actuador.repository'
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository'
import { EntityManager } from 'typeorm'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'
import axios from 'axios'
import * as fs from 'fs'
import { Dispositivo } from 'src/dispositivos/entity/dispositivo.entity'
import * as path from 'path'
import { Telegraf } from 'telegraf'
import { AccionConst, SensorActuadorConst, Status } from 'src/common/constants'
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository'
@Injectable()
export class HistorialIncidentesService {
  constructor(
    private historialIncidentesRepositorio: HistorialIncidenteRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository,
    private dispositivoRepositorio: DispositivoRepository,
    private historialRepository: HistorialActivarDesactivarRepository
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialIncidentesRepositorio.listar(
      paginacionQueryDto
    )
    return result
  }

  async crear(registroIncidenteDto: RegistroIncidenteDto) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('entró a crear historial')
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    const alarma = await this.alarmaRepositorio.buscarAlarmaEncendida()

    if (!alarma) throw new NotFoundException('No se encontró la alarma')
    const dispositivo = await this.dispositivoRepositorio.buscarPorId(
      registroIncidenteDto.idDispositivo
    )
    const sensor = await this.sensorActuadorRepositorio.buscarPorPinDisposotivo(
      registroIncidenteDto.idDispositivo,
      registroIncidenteDto.pin
    )
    if (!sensor) throw new NotFoundException('No se encontró el sensor')
    if (alarma.sonido === '3') this.accionSirenas(AccionConst.ENCENDER)

    /* const fotosCapturadas: string[] = await this.guardarFotos(dispositivo) */

    const historialIncidente = this.historialIncidentesRepositorio.crear({
      idSensor: sensor.id,
      idAlarma: alarma.id,
      fecha: new Date(),
      /* fotos: fotosCapturadas, */
    })
    /* this.enviarFotosPorTelegram(fotosCapturadas) */
    return historialIncidente
  }

  async accionarBotonPanico(idAlarma: string, usuarioAuditoria: string) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('entró a crear historial encender boton panico')
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    if (!(idAlarma === '1' || idAlarma === '2'))
      throw new BadRequestException('Acción no permitida')
    const dispositivos = await this.dispositivoRepositorio.listarCamaras()
    const alarma = await this.alarmaRepositorio.buscarPorId(idAlarma)
    if (alarma.sonido === '3') this.accionSirenas(AccionConst.ENCENDER)

    const fotosCapturadas: string[] = await this.guardarFotos(
      dispositivos[0],
      1,
      1000
    )
    const op = async (transaction: EntityManager) => {
      const historialIncidente = this.historialIncidentesRepositorio.crear({
        idSensor: null,
        idAlarma: idAlarma,
        fecha: new Date(),
        fotos: fotosCapturadas,
      })
      await this.historialRepository.crear(
        {
          accion: AccionConst.ENCENDER,
          fecha: new Date(),
          idAlarma: idAlarma,
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return historialIncidente
    }
    /* this.enviarFotosPorTelegram(fotosCapturadas) */
    return this.historialRepository.runTransaction(op)
  }

  async atencionIncidentes(
    idIncidente,
    atencionIncidentesDto: AtencionIncidentesDto,
    usuarioAuditoria: string
  ) {
    const incidente = await this.historialIncidentesRepositorio.buscarPorId(
      idIncidente
    )
    if (!incidente) throw new NotFoundException('Incidente no encontrado')
    if (!(incidente.idAlarma === '1' || incidente.idAlarma === '2')) {
      if (
        (incidente.alarma.envio_noti === '1' &&
          atencionIncidentesDto.notificacionContactos === true) ||
        (incidente.alarma.envio_noti === '3' &&
          atencionIncidentesDto.notificacionContactos === false) ||
        (incidente.alarma.sonido === '1' &&
          atencionIncidentesDto.activarSonido === true) ||
        (incidente.alarma.sonido === '3' &&
          atencionIncidentesDto.activarSonido === false)
      )
        throw new HttpException(
          'La acción no coresponde con la configuracion de la alarma',
          HttpStatus.CONFLICT
        )
      if (atencionIncidentesDto.activarSonido) {
        await this.accionSirenas(AccionConst.ENCENDER)
      }
      if (atencionIncidentesDto.notificacionContactos) {
        console.log('Envio whatsapp')
      }
    }
    await this.historialIncidentesRepositorio.cambiarEstados(
      idIncidente,
      Status.ATENDIDO,
      usuarioAuditoria
    )
  }

  async descartarIncidentes(idIncidente, usuario_auditoria) {
    this.historialIncidentesRepositorio.cambiarEstados(
      idIncidente,
      Status.DESCARTADO,
      usuario_auditoria
    )
  }

  async inactivarPorFecha(intervaloFecha: IntervaloFechasDto) {
    //const fechaInicio = new Date(intervaloFecha.fechaInicio);
    //const fechaFin = new Date(intervaloFecha.fechaFin);
    const op = async (transaction: EntityManager) => {
      const result =
        await this.historialIncidentesRepositorio.inactivarPorFecha(
          intervaloFecha.fechaInicio,
          intervaloFecha.fechaFin,
          transaction
        )
      return result
    }
    return this.historialIncidentesRepositorio.runTransaction(op)
  }

  async inactivar(idHistorial: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.historialIncidentesRepositorio.inactivar(
        idHistorial,
        transaction
      )
      return result
    }
    return this.historialIncidentesRepositorio.runTransaction(op)
  }

  async guardarFotos(
    dispositivos: Dispositivo[],
    numeroFotos: number,
    tiempoEspera: number
  ) {
    const fotosCapturadas: string[] = []
    /* try { */
    console.log('FFFFFFFFFFFFFFFFFFFFFFFFF')
    console.log(dispositivos)
    console.log('FFFFFFFFFFFFFFFFFFFFFFFFF')
    for (let i = 0; i < dispositivos.length; i++) {
      const dispositivo = dispositivos[i]
      for (let j = 0; j < numeroFotos; j++) {
        // Esperar 1 segundo antes de capturar la siguiente foto
        await new Promise((resolve) => setTimeout(resolve, tiempoEspera))
        // Capturar la foto
        const respuestaFoto = await axios
          .get(`http://${dispositivo.direccionLan}/jpg`, {
            responseType: 'stream',
          })
          .catch((error) => {
            throw new NotFoundException('error al capturar las fotos')
          })

        // Crear un directorio "fotos" si no existe
        if (!fs.existsSync('fotos')) {
          fs.mkdirSync('fotos')
        }

        // Crear un nombre de archivo basado en la fecha y hora actual
        const fechaHoraActual = new Date()
        const nombreArchivo = `${
          dispositivo.ubicacion.nombre
        } - ${fechaHoraActual.toISOString()}.jpg`
        const rutaArchivo = path.join('fotos', nombreArchivo)

        // Guardar la foto en el directorio
        const archivoDeFoto = fs.createWriteStream(rutaArchivo)
        respuestaFoto.data.pipe(archivoDeFoto)

        // Esperar a que se complete la escritura del archivo
        await new Promise((resolve, reject) => {
          archivoDeFoto.on('finish', resolve)
          archivoDeFoto.on('error', reject)
        })

        // Agregar la dirección HTTP de la foto a la lista
        fotosCapturadas.push(`${nombreArchivo}`)
      }
    }
    return fotosCapturadas
    /*  } catch (error) {
      throw new NotFoundException(
        'Dirección de dispositivo no válida o error al capturar las fotos',
      );
    } */
  }
  async enviarFotosPorTelegram(fotos: string[]) {
    const bot = new Telegraf('6678960088:AAFAxPCtsAS2k55z9K6x9iOoEpN5mRh6OXg') // Reemplaza con el token de tu bot de Telegram
    /* const chatId = obtenerChatIdPorTelefono('+591 71923457'); */
    const chatIds = ['526101081'] // Reemplaza con los IDs de los contactos a los que deseas enviar las fotos

    try {
      for (const chatId of chatIds) {
        for (const fotoUrl of fotos) {
          // Envía la foto a través del bot de Telegram
          await bot.telegram.sendPhoto(chatId, { source: 'fotos/' + fotoUrl })
        }
      }
    } catch (error) {
      console.error('Error al enviar fotos por Telegram:', error)
    }
  }
  async accionSirenas(accion: string) {
    const dispositivos =
      await this.dispositivoRepositorio.buscarPorDescricionSensoresActuadores(
        SensorActuadorConst.SIRENA
      )
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    console.log(dispositivos)
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    const tiempoLimite = 5000
    for (let i = 0; i < dispositivos.length; i++) {
      for (let j = 0; j < dispositivos[i].sensoresActuadores.length; j++) {
        const sirena = dispositivos[i].sensoresActuadores[j]
        /* await axios
          .post(`http://${dispositivos[j].direccionLan}/actudador`, {
            pin: sirena.pin,
            accion: accion,
          })
          .catch((error) => {
            console.log(`error al activar actuador en ${sirena.pin}`)
            console.log(error)
            throw new NotFoundException(
              `error al activar sirena en ${dispositivos[j].nombre}`
            )
          }) */

        try {
          await axios.post(
            `http://${dispositivos[j].direccionLan}/actudador`,
            {
              pin: sirena.pin,
              accion: accion,
            },
            {
              timeout: tiempoLimite,
            }
          )

          // El resto de tu lógica aquí para manejar la respuesta exitosa
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              // Manejar el error de tiempo de espera aquí
              console.error(
                'La solicitud ha excedido el tiempo límite de espera'
              )
              throw new NotFoundException(
                `error al activar sirena en ${dispositivos[j].nombre}`
              )
            } else {
              // Otros errores de Axios
              throw new NotFoundException(
                `error al activar sirena en ${dispositivos[j].nombre}`
              )
            }
          } else {
            // Otros tipos de errores
            throw error
          }
        }
      }
    }
  }
  async guardarGrabacion() {
    /////////////////// GRABADORA DE VIDEO /////////////////////////////
    /* try {
      const respuestaDisp = await axios.get(
        `http://${dispositivo.direccionLan}/mjpeg`,
        {
          responseType: 'stream', // Indicar que esperamos un flujo de datos
        },
      );

      // Crear un archivo para guardar la transmisión
      const archivoDeVideo = fs.createWriteStream('video.mjpeg');

      // Configurar un temporizador para detener la grabación después de 10 minutos
      const tiempoDeGrabacionEnMs = 10 * 60 * 1000; // 10 minutos en milisegundos
      setTimeout(() => {
        archivoDeVideo.close(); // Cerrar el archivo después del tiempo especificado
      }, tiempoDeGrabacionEnMs);

      // Pipe la transmisión de respuesta al archivo
      respuestaDisp.data.pipe(archivoDeVideo);

      // Esperar a que se complete la grabación antes de continuar
      await new Promise((resolve, reject) => {
        archivoDeVideo.on('finish', resolve);
        archivoDeVideo.on('error', reject);
      });
    } catch (error) {
      throw new NotFoundException('Error al grabar el video');
    } */
    ////////////////////////////////////////////////////////////////////////////////////////
  }
}
