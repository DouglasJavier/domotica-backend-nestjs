import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Dispositivo } from '../entity/dispositivo.entity'
import { DispositivoRepository } from '../repository/dispositivo.repository'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto'
import { SensorActuadorRepository } from '../repository/sensor_actuador.repository'
import axios from 'axios'
import { TextService } from 'src/common/lib/text.service'
import { Response } from 'express'
@Injectable()
export class DispositivoService {
  constructor(
    @Inject(DispositivoRepository)
    private dispositivoRepositorio: DispositivoRepository,
    private sensorActuadorRepositorio: SensorActuadorRepository
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.dispositivoRepositorio.listar(paginacionQueryDto)
  }

  async crear(dispositivoDto: DispositivoCrearDto) {
    const op = async (transaction: EntityManager) => {
      const pass = TextService.decodeBase64(dispositivoDto.contrasenia)
      const contrasenia = await TextService.encryptSHA256(pass)
      dispositivoDto.contrasenia = contrasenia
      const dispositivo = await this.dispositivoRepositorio.crear(
        dispositivoDto,
        transaction
      )

      const tiempoLimite = 5000 // 5000 milisegundos (5 segundos)

      try {
        const respuestaDisp = await axios.post(
          `http://${dispositivoDto.direccionLan}/conf_pin`,
          {
            idDispositivo: dispositivo.id,
            sensoresActuadores: dispositivoDto.sensoresActuadores,
          },
          {
            headers: {
              Authorization: `Bearer ${contrasenia}`,
            },
            timeout: tiempoLimite,
          }
        )

        // El resto de tu lógica aquí para manejar la respuesta exitosa
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            // Manejar el error de tiempo de espera aquí
            console.error('La solicitud ha excedido el tiempo límite de espera')
            throw new NotFoundException('Dirección de dispositivo no válida')
          } else {
            // Otros errores de Axios
            throw new NotFoundException('Error en la solicitud')
          }
        } else {
          // Otros tipos de errores
          throw error
        }
      }
      return dispositivo
    }
    return this.dispositivoRepositorio.runTransaction(op)
  }

  async actualizar(id: string, dispositivoDto: DispositivoCrearDto) {
    const dispositivo = await this.dispositivoRepositorio.buscarPorId(id)
    console.log(dispositivoDto.sensoresActuadores)
    const pass = TextService.decodeBase64(dispositivoDto.contrasenia)
    console.log(pass)
    const contrasenia = await TextService.encryptSHA256(pass)
    console.log(contrasenia)
    dispositivoDto.contrasenia = contrasenia
    const op = async (transaction: EntityManager) => {
      const tiempoLimite = 5000
      try {
        const respuestaDisp = await axios.post(
          `http://${dispositivoDto.direccionLan}/conf_pin`,
          {
            idDispositivo: dispositivo.id,
            sensoresActuadores: dispositivoDto.sensoresActuadores,
          },
          {
            headers: {
              Authorization: `Bearer ${contrasenia}`,
            },
            timeout: tiempoLimite,
          }
        )
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            // Manejar el error de tiempo de espera aquí
            console.error('La solicitud ha excedido el tiempo límite de espera')
            throw new NotFoundException('Dirección de dispositivo no válida')
          } else {
            // Otros errores de Axios
            throw new NotFoundException('Error en la solicitud')
          }
        } else {
          // Otros tipos de errores
          throw error
        }
      }
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          ...dispositivoDto,
          sensoresActuadores: [],
        },
        transaction
      )
      await this.sensorActuadorRepositorio._inactivar(id, transaction)
      await this.sensorActuadorRepositorio._crear(
        id,
        dispositivoDto.idUbicacion,
        dispositivoDto.sensoresActuadores,
        transaction
      )
      return { id }
    }
    return this.dispositivoRepositorio.runTransaction(op)
  }

  async activar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          estado: 'ACTIVO',
        },
        transaction
      )
      return { id }
    }
    return this.dispositivoRepositorio.runTransaction(op)
  }

  async inactivar(id: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.dispositivoRepositorio.actualizar(
        id,
        {
          estado: 'INACTIVO',
        },
        transaction
      )
      return { id }
    }
    return this.dispositivoRepositorio.runTransaction(op)
  }

  async listarActuadores() {
    return await this.sensorActuadorRepositorio.listarActuadores()
  }
  async listarCamaras() {
    return await this.dispositivoRepositorio.listarCamaras()
  }

  async buscarPorId(id: string) {
    return await this.dispositivoRepositorio.buscarPorId(id)
  }

  async streamVideo(response: Response, idDispositivo: string): Promise<void> {
    const dispostivo = await this.dispositivoRepositorio.buscarPorId(
      idDispositivo
    )
    response.setHeader(
      'Content-Type',
      'multipart/x-mixed-replace; boundary=--jpegboundary'
    )
    response.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0'
    )
    response.setHeader('Pragma', 'no-cache')
    response.setHeader('Connection', 'close')

    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${dispostivo.contrasenia}`,
      },
      responseType: 'stream',
    })

    try {
      const responseStream = await axiosInstance.get(
        dispostivo.direccionLan + '/mjpeg'
      )

      responseStream.data.on('data', (chunk) => {
        response.write(
          `--jpegboundary\r\nContent-Type: image/jpeg\r\nContent-Length: ${chunk.length}\r\n\r\n`
        )
        response.write(chunk, 'binary')
        response.write('\r\n')
      })

      responseStream.data.on('end', () => {
        response.end()
      })

      responseStream.data.on('error', (error) => {
        console.error('Error streaming from camera:', error)
        response.end()
      })

      response.on('close', () => {
        responseStream.data.destroy()
      })
    } catch (error) {
      console.error('Error connecting to camera:', error)
      response.end()
    }
  }
}
