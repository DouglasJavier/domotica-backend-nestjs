import { Injectable } from '@nestjs/common'
import { PaginacionQueryDto } from '../../common/dto/paginacionDto'
import { UbicacionRepository } from './ubicaciones.repository'
import { CrearUbicacionDto } from './dto/crear-ubicacionDto'

@Injectable()
export class UbicacionService {
  constructor(private ubicacionRepositorio: UbicacionRepository) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.ubicacionRepositorio.listar(paginacionQueryDto)
    return result
  }

  async crear(ubicacionDto: CrearUbicacionDto) {
    const ubicacion = await this.ubicacionRepositorio.crear(ubicacionDto)
    return ubicacion
  }

  async actualizar(id: string, ubicacionDto: CrearUbicacionDto) {
    await this.ubicacionRepositorio.actualizar(id, ubicacionDto)
    return { id }
  }

  async activar(id: string) {
    await this.ubicacionRepositorio.actualizar(id, {
      estado: 'ACTIVO',
    })
    return { id }
  }

  async inactivar(id: string) {
    await this.ubicacionRepositorio.actualizar(id, {
      estado: 'INACTIVO',
    })
    return { id }
  }
}
