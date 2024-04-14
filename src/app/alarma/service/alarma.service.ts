import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { AlarmaRepository } from '../repository/alarma.repository'
import { AlarmaCRUDType, BotonPanicoType } from '../dto/alarmaCRUDType'
import { HistorialActivarDesactivarRepository } from 'src/app/historialActivarDesactivar/historialActivarDesactivar.repository'
import { AlarmaContactoRepository } from 'src/app/alarma/repository/alarmasContactos.repository'
import { ubicacionAlarmaRepository } from '../repository/ubicacionAlarma.repository'
import { EntityManager } from 'typeorm'
import axios from 'axios'
import { DispositivoRepository } from 'src/app/dispositivos/repository/dispositivo.repository'
import { HistorialIncidentesService } from 'src/app/historialIncidentes/historialIncidentes.service'
import { AccionConst, Status, TiposSensores } from 'src/common/constants'

@Injectable()
export class AlarmaService {
  constructor(
    @Inject(AlarmaRepository)
    private alarmaRepository: AlarmaRepository,
    private historialRepository: HistorialActivarDesactivarRepository,
    private alarmasContactosRepository: AlarmaContactoRepository,
    private ubicacionesAlarmasRepository: ubicacionAlarmaRepository,
    private dispositivoRepository: DispositivoRepository,
    private incidentesService: HistorialIncidentesService
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
  async crear(alarmaDto: AlarmaCRUDType, usuarioAuditoria: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.crear(alarmaDto, transaction)
      await this.historialRepository.crear(
        {
          accion: 'CREAR',
          fecha: new Date(),
          idAlarma: result.id,
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async editar(
    alarmaDto: AlarmaCRUDType,
    id: string,
    usuarioAuditoria: string
  ) {
    if (id === '1' || id === '2')
      throw new BadRequestException('Acción no permitida')
    const existe = this.alarmaRepository.buscarPorId(id)
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado')
    const idContactos = alarmaDto.idContactos
    const idUbicaciones = alarmaDto.idUbicaciones
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
      await this.ubicacionesAlarmasRepository.inactivarUbicaciones(
        id,
        transaction
      )
      await this.ubicacionesAlarmasRepository.crearUbicaciones(
        idUbicaciones,
        id,
        transaction
      )
      await this.historialRepository.crear(
        {
          accion: 'EDITAR',
          fecha: new Date(),
          idAlarma: id,
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async editarBotonPanico(
    botonPanicoDto: BotonPanicoType,
    idAlarma: string,
    usuarioAuditoria: string
  ) {
    if (idAlarma !== '1' && idAlarma !== '2')
      throw new BadRequestException('Acción no permitida')
    const op = async (transaction: EntityManager) => {
      await this.alarmasContactosRepository.inactivarContactos(
        idAlarma,
        transaction
      )
      const result = await this.alarmasContactosRepository.crearContactos(
        botonPanicoDto.idContactos,
        idAlarma,
        transaction
      )
      await this.historialRepository.crear(
        {
          accion: 'EDITAR',
          fecha: new Date(),
          idAlarma: idAlarma,
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async encender(id: string, usuarioAuditoria: string) {
    if (id === '1' || id === '2')
      throw new BadRequestException('Acción no permitida')
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
    const dispositivos =
      await this.dispositivoRepository.buscarPorIdUbicacionesSensoresTipo(
        alarma.ubicacionAlarmas.map((ubicacion) => ubicacion.idUbicacion),
        alarma.seguridadBienes ? TiposSensores.tipoSeguridadBienes : [],
        alarma.sensoresHumo ? TiposSensores.tipoHumo : [],
        alarma.alumbradoAutomatico ? TiposSensores.tipoAlumbrado : []
      )
    //Alumbredo automatico
    for (let j = 0; j < dispositivos.length; j++) {
      /* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      console.log(dispositivos[j])
      console.log('ubicacion', alarma.ubicacionAlarmas)
      console.log('sensoresActuadores: ', dispositivos[j].sensoresActuadores)
      console.log('alumbradoAutomatico: ', alarma.alumbradoAutomatico)
      console.log(
        'enviarReporte: ',
        alarma.seguridadBienes || alarma.sensoresHumo
      )
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&') */
      await axios
        .post(
          `http://${dispositivos[j].direccionLan}/sensores`,
          {
            sensoresActuadores: dispositivos[j].sensoresActuadores,
            alumbradoAutomatico: alarma.alumbradoAutomatico,
            enviarReporte: alarma.seguridadBienes || alarma.sensoresHumo,
          },
          {
            headers: {
              Authorization: `Bearer ${dispositivos[j].contrasenia}`,
            },
          }
        )
        .catch((error) => {
          console.log(`error al activar sensor en ${dispositivos[j].nombre}`)
          console.log(error)
          throw new NotFoundException(
            `error al activar sensor en ${dispositivos[j].nombre}`
          )
        })
    }
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
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async apagar(id: string, usuarioAuditoria: string) {
    if (id === '1' || id === '2')
      throw new BadRequestException('Acción no permitida')
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
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      await this.incidentesService.accionSirenas(AccionConst.APAGAR)
      for (let i = 0; i < alarma.ubicacionAlarmas.length; i++) {
        const dispositivos = await this.dispositivoRepository.listarCompleto()
        /* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        console.log(dispositivos)
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&') */
        console.log(dispositivos)
        for (let j = 0; j < dispositivos.length; j++) {
          await axios
            .post(
              `http://${dispositivos[j].direccionLan}/sensores`,
              {
                sensoresActuadores: [],
                alumbradoAutomatico: false,
                enviarReporte: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${dispositivos[j].contrasenia}`,
                },
              }
            )
            .catch((error) => {
              console.log(
                `error al desactivar sensores en ${dispositivos[j].nombre}`
              )
              console.log(error)
              throw new NotFoundException(
                `error al desactivar sensores en ${dispositivos[j].nombre}`
              )
            })
        }
      }
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async inactivar(id: string, usuarioAuditoria: string) {
    if (id === '1' || id === '2')
      throw new BadRequestException('Acción no permitida')
    const existe = this.alarmaRepository.buscarPorId(id)
    if (!existe)
      throw new NotFoundException('No existe el articulo selecionado')
    const op = async (transaction: EntityManager) => {
      const result = await this.alarmaRepository.actualizar(
        id,
        {
          estado: Status.INACTIVE,
        },
        transaction
      )
      this.historialRepository.crear(
        {
          accion: AccionConst.ELIMINAR,
          fecha: new Date(),
          idAlarma: id,
          idUsuario: usuarioAuditoria,
        },
        transaction
      )
      return result
    }
    return this.alarmaRepository.runTransaction(op)
  }
  async apagarSirenas(usuarioAuditoria: string) {
    console.log(usuarioAuditoria)
    await this.incidentesService.accionSirenas(AccionConst.APAGAR)
  }
}
