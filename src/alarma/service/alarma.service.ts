import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { AlarmaRepository } from '../repository/alarma.repository'
import { AlarmaCRUDType } from '../dto/alarmaCRUDType'
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository'
import { AlarmaContactoRepository } from 'src/alarma/repository/alarmasContactos.repository'
import { ubicacionAlarmaRepository } from '../repository/ubicacionAlarma.repository'
import { EntityManager } from 'typeorm'
import axios from 'axios'
import { DispositivoRepository } from 'src/dispositivos/repository/dispositivo.repository'

@Injectable()
export class AlarmaService {
  constructor(
    @Inject(AlarmaRepository)
    private alarmaRepository: AlarmaRepository,
    private historialRepository: HistorialActivarDesactivarRepository,
    private alarmasContactosRepository: AlarmaContactoRepository,
    private ubicacionesAlarmasRepository: ubicacionAlarmaRepository,
    private dispositivoRepository: DispositivoRepository
  ) {}
  async listaAlarmas() {
    const respuesta = this.alarmaRepository.listaAlarmas()
    return respuesta
  }
  async alarmaPorId(id: string) {
    const alarma = this.alarmaRepository.buscarPorId(id)
    if (!alarma) throw new NotFoundException('Articulo no encontrado')
    return alarma
  }
  async crear(alarmaDto: AlarmaCRUDType) {
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.crear(alarmaDto, transaction)
      await this.historialRepository.crear(
        {
          accion: 'CREAR',
          fecha: new Date(),
          idAlarma: result.id,
          idUsuario: '1',
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async editar(alarmaDto: AlarmaCRUDType, id: string) {
    const existe = this.alarmaRepository.buscarPorId(id)
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado')
    await this.ubicacionesAlarmasRepository.inactivarUbicaciones(id)
    const idContactos = alarmaDto.idContactos
    const alarma = alarmaDto
    delete alarma.idContactos
    delete alarma.idSimulador
    delete alarma.idUbicaciones
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.actualizar(
        id,
        alarma,
        transaction
      )
      await this.alarmasContactosRepository.inactivarContactos(id, transaction)
      await this.alarmasContactosRepository.crearContactos(
        idContactos,
        id,
        transaction
      )
      await this.historialRepository.crear(
        {
          accion: 'EDITAR',
          fecha: new Date(),
          idAlarma: id,
          idUsuario: '1',
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async encender(id: string) {
    const alarma = await this.alarmaRepository.buscarPorId(id)
    if (!alarma)
      throw new NotFoundException('No existe la alarma selecionada selecionado')
    const encendidos = await this.alarmaRepository.buscarEncendido()
    if (encendidos.length > 0) {
      throw new HttpException(
        'Ya hay una alarma encendida',
        HttpStatus.CONFLICT
      )
    }
    //Envio de información a los dispositivos
    /* for (let i = 0; i < alarma.ubicacionAlarmas.length; i++) {
      const dispositivos =
        await this.dispositivoRepository.buscarPorIdUbicaciónSensores(
          alarma.ubicacionAlarmas[i].idUbicacion
        )
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      console.log(dispositivos)
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      console.log(dispositivos)
      for (let j = 0; j < dispositivos.length; j++) {
        const respuestaEnvio = await axios
          .post(`http://${dispositivos[j].direccionLan}/sensores`, {
            sensoresActuadores: dispositivos[j].sensoresActuadores,
          })
          .catch((error) => {
            console.log(`error al activar sensor en ${dispositivos[j].nombre}`)
            console.log(error)
            throw new NotFoundException(
              `error al activar sensor en ${dispositivos[j].nombre}`
            )
          })
      }
    } */
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.actualizar(
        id,
        {
          estado: 'ENCENDIDO',
        },
        transaction
      )
      this.historialRepository.crear(
        {
          accion: 'ENCENDER',
          fecha: new Date(),
          idAlarma: id,
          idUsuario: '1',
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async apagar(id: string) {
    const alarma = await this.alarmaRepository.buscarPorId(id)
    if (!alarma)
      throw new NotFoundException('No existe el articulo selecionado')
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.actualizar(
        id,
        {
          estado: 'ACTIVO',
        },
        transaction
      )
      this.historialRepository.crear(
        {
          accion: 'APAGAR',
          fecha: new Date(),
          idAlarma: id,
          idUsuario: '1',
        },
        transaction
      )
      for (let i = 0; i < alarma.ubicacionAlarmas.length; i++) {
        const dispositivos =
          await this.dispositivoRepository.buscarPorIdUbicaciónSensores(
            alarma.ubicacionAlarmas[i].idUbicacion
          )
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        console.log(dispositivos)
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        console.log(dispositivos)
        for (let j = 0; j < dispositivos.length; j++) {
          const respuestaEnvio = await axios
            .post(`http://${dispositivos[j].direccionLan}/sensores`, {
              sensoresActuadores: [],
            })
            .catch((error) => {
              console.log(
                `error al activar sensor en ${dispositivos[j].nombre}`
              )
              console.log(error)
              throw new NotFoundException(
                `error al activar sensor en ${dispositivos[j].nombre}`
              )
            })
        }
      }
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async inactivar(id: string) {
    const existe = this.alarmaRepository.buscarPorId(id)
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado')
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.actualizar(
        id,
        {
          estado: 'INACTIVO',
        },
        transaction
      )
      this.historialRepository.crear(
        {
          accion: 'ELIMINAR',
          fecha: new Date(),
          idAlarma: id,
          idUsuario: '1',
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
}
