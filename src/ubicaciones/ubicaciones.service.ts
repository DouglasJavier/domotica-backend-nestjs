import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicacion } from './ubicaciones.entity';
import { PaginacionQueryDto } from '../common/dto/paginacionDto';
import { UbicacionRepository } from './ubicaciones.repository';
import { CrearUbicacionDto } from './dto/crear-ubicacionDto';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepositorio: UbicacionRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.ubicacionRepositorio.listar(paginacionQueryDto);
  }

  async crear(ubicacionDto: CrearUbicacionDto) {
    const ubicacion = await this.ubicacionRepositorio.crear(ubicacionDto);
    return ubicacion;
  }

  async actualizar(id: string, ubicacionDto: CrearUbicacionDto) {
    const result = await this.ubicacionRepositorio.editar(id, ubicacionDto);
  }
}
