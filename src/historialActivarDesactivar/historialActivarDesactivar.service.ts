import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity'
import { HistorialActivarDesactivarRepository } from './historialActivarDesactivar.repository'
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto'

@Injectable()
export class HistorialActivarDesactivarService {
  constructor(
    @Inject(HistorialActivarDesactivarRepository)
    private hisorialActivarDesactivarRepositorio: HistorialActivarDesactivarRepository
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.hisorialActivarDesactivarRepositorio.listar(
      paginacionQueryDto
    )
    return result
  }
  async inactivarPorFecha(intervaloFecha: IntervaloFechasDto) {
    const op = async (transaction: EntityManager) => {
      const result =
        await this.hisorialActivarDesactivarRepositorio.inactivarPorFecha(
          intervaloFecha.fechaInicio,
          intervaloFecha.fechaFin,
          transaction
        )
      return result
    }
    return this.hisorialActivarDesactivarRepositorio.runTransaction(op)
  }

  async inactivar(idHistorial: string) {
    const op = async (transaction: EntityManager) => {
      const result = await this.hisorialActivarDesactivarRepositorio.inactivar(
        idHistorial,
        transaction
      )
      return result
    }
    return this.hisorialActivarDesactivarRepositorio.runTransaction(op)
  }
}
