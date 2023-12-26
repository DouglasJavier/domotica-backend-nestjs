import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto';
import { HistorialIncidenteRepository } from './historialIncidentes.repository';
import { RegistroIncidenteDto } from './dto/crear-historialIncidenteDto';
import { SensorActuadorRepository } from 'src/dispositivos/repository/sensor_actuador.repository';
import { AlarmaRepository } from 'src/alarma/repository/alarma.repository';
import { EntityManager } from 'typeorm';
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository';
import axios from 'axios';
import * as fs from 'fs';
import { Dispositivo } from 'src/dispositivos/entity/dispositivo.entity';
import * as path from 'path';
import { Telegraf } from 'telegraf';
@Injectable()
export class HistorialIncidentesService {
  constructor(
    private historialIncidentesRepositorio: HistorialIncidenteRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository,
    private alarmaRepositorio: AlarmaRepository,
    private dispositivoRepositorio: DispositivoRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialIncidentesRepositorio.listar(
      paginacionQueryDto,
    );
    return result;
  }

  async crear(registroIncidenteDto: RegistroIncidenteDto) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('entró a crear historial');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    const alarma = await this.alarmaRepositorio.buscarAlarmaEncendida();
    if (!alarma) throw new NotFoundException('No se encontró la alarma');
    const dispositivo = await this.dispositivoRepositorio.buscarPorId(
      registroIncidenteDto.idDispositivo,
    );
    const sensor = await this.sensorActuadorRepositorio.buscarPorPinDisposotivo(
      registroIncidenteDto.idDispositivo,
      registroIncidenteDto.pin,
    );
    if (!sensor) throw new NotFoundException('No se encontró el sensor');
    const fotosCapturadas: string[] = await this.guardarFotos(dispositivo);

    const historialIncidente = this.historialIncidentesRepositorio.crear({
      idSensor: sensor.id,
      idAlarma: alarma.id,
      fecha: new Date(),
      fotos: fotosCapturadas,
    });
    this.enviarFotosPorTelegram(fotosCapturadas);
    return historialIncidente;
  }

  async inactivarPorFecha(intervaloFecha: IntervaloFechasDto) {
    //const fechaInicio = new Date(intervaloFecha.fechaInicio);
    //const fechaFin = new Date(intervaloFecha.fechaFin);
    const op = async (transaction: EntityManager) => {
      const result =
        await this.historialIncidentesRepositorio.inactivarPorFecha(
          intervaloFecha.fechaInicio,
          intervaloFecha.fechaFin,
          transaction,
        );
      return result;
    };
    return this.historialIncidentesRepositorio.runTransaction(op);
  }

  async inactivar(idHistorial: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.historialIncidentesRepositorio.inactivar(
        idHistorial,
        transaction,
      );
      return result;
    };
    return this.historialIncidentesRepositorio.runTransaction(op);
  }

  async guardarFotos(dispositivo: Dispositivo) {
    const fotosCapturadas: string[] = [];
    /* try { */
    for (let i = 0; i < 3; i++) {
      // Esperar 1 segundo antes de capturar la siguiente foto
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Capturar la foto
      const respuestaFoto = await axios
        .get(`http://${dispositivo.direccionLan}/jpg`, {
          responseType: 'stream',
        })
        .catch((error) => {
          throw new NotFoundException('error al capturar las fotos');
        });

      // Crear un directorio "fotos" si no existe
      if (!fs.existsSync('fotos')) {
        fs.mkdirSync('fotos');
      }

      // Crear un nombre de archivo basado en la fecha y hora actual
      const fechaHoraActual = new Date();
      const nombreArchivo = `${
        dispositivo.ubicacion.nombre
      } - ${fechaHoraActual.toISOString()}.jpg`;
      const rutaArchivo = path.join('fotos', nombreArchivo);

      // Guardar la foto en el directorio
      const archivoDeFoto = fs.createWriteStream(rutaArchivo);
      respuestaFoto.data.pipe(archivoDeFoto);

      // Esperar a que se complete la escritura del archivo
      await new Promise((resolve, reject) => {
        archivoDeFoto.on('finish', resolve);
        archivoDeFoto.on('error', reject);
      });

      // Agregar la dirección HTTP de la foto a la lista
      fotosCapturadas.push(`${nombreArchivo}`);
    }
    return fotosCapturadas;
    /*  } catch (error) {
      throw new NotFoundException(
        'Dirección de dispositivo no válida o error al capturar las fotos',
      );
    } */
  }
  async enviarFotosPorTelegram(fotos: string[]) {
    const bot = new Telegraf('6678960088:AAFAxPCtsAS2k55z9K6x9iOoEpN5mRh6OXg'); // Reemplaza con el token de tu bot de Telegram
    /* const chatId = obtenerChatIdPorTelefono('+591 71923457'); */
    const chatIds = ['526101081']; // Reemplaza con los IDs de los contactos a los que deseas enviar las fotos

    try {
      for (const chatId of chatIds) {
        for (const fotoUrl of fotos) {
          // Envía la foto a través del bot de Telegram
          await bot.telegram.sendPhoto(chatId, { source: 'fotos/' + fotoUrl });
        }
      }
    } catch (error) {
      console.error('Error al enviar fotos por Telegram:', error);
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
