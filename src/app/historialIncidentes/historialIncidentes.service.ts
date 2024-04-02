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
import { SensorActuadorRepository } from 'src/app/dispositivos/repository/sensor_actuador.repository'
import { AlarmaRepository } from 'src/app/alarma/repository/alarma.repository'
import { EntityManager } from 'typeorm'
import { DispositivoRepository } from 'src/app/dispositivos/repository/dispositivo.repository'
import axios from 'axios'
import * as fs from 'fs'
import { Dispositivo } from 'src/app/dispositivos/entity/dispositivo.entity'
import * as path from 'path'
import { Telegraf } from 'telegraf'
import { AccionConst, SensorActuadorConst, Status } from 'src/common/constants'
import { HistorialActivarDesactivarRepository } from 'src/app/historialActivarDesactivar/historialActivarDesactivar.repository'
import { MensajeriaService } from '../mensajeria/mensajeria.service'
@Injectable()
export class HistorialIncidentesService {
  constructor(
    private historialIncidentesRepositorio: HistorialIncidenteRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository,
    private dispositivoRepositorio: DispositivoRepository,
    private historialRepository: HistorialActivarDesactivarRepository,
    private mensajeriaService: MensajeriaService
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

    const fotosCapturadas: string[] = await this.guardarFotos(
      [dispositivo],
      3,
      5000
    )

    const historialIncidente = this.historialIncidentesRepositorio.crear({
      idSensor: sensor.id,
      idAlarma: alarma.id,
      fecha: new Date(),
      fotos: fotosCapturadas,
    })
    this.mensajeriaService.enviarMensajeFotosPorTelegramUsuarios(
      fotosCapturadas,
      `El sensor ${sensor.descripcion} detectó un incidente de seguridad en ${sensor.ubicacion.nombre}`,
      'Ingresar al sistema para revisar'
    )
    if (alarma.envio_noti === '3')
      this.mensajeriaService.enviarMensajeFotosPorTelegramContactos(
        alarma.id,
        fotosCapturadas,
        `El sensor ${sensor.descripcion} detectó un incidente de seguridad en ${sensor.ubicacion.nombre} en el hogar de la familia `
      )
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
    }
    console.log('activarSonido', atencionIncidentesDto.activarSonido)
    if (atencionIncidentesDto.activarSonido) {
      await this.accionSirenas(AccionConst.ENCENDER)
    }
    if (atencionIncidentesDto.notificacionContactos) {
      this.mensajeriaService.enviarMensajeFotosPorTelegramContactos(
        incidente.idAlarma,
        incidente.fotos.map((foto) => foto.foto),
        'Se detectó un incidente de seguridad en el hogar de la familia A'
      )
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
            headers: {
              Authorization: `Bearer ${dispositivo.contrasenia}`,
            },
          })
          .catch((error) => {
            console.log(error)
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
        console.log('sirena', sirena)
        try {
          await axios.post(
            `http://${dispositivos[j].direccionLan}/actuador`,
            {
              pin: sirena.pin,
              accion: accion,
            },
            {
              headers: {
                Authorization: `Bearer ${dispositivos[j].contrasenia}`,
              },
              timeout: tiempoLimite,
            }
          )
          console.log('entregó correctamente')
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
