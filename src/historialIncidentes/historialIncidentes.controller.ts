import { Body, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { HistorialIncidentesService } from './historialIncidentes.service';
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto';
import { RegistroIncidenteDto } from './dto/crear-historialIncidenteDto';
import { ParamIdDto } from 'src/common/dto/params-id.dto';

@Controller('historialIncidentes')
export class HistorialIncidentesController {
  constructor(private historialServicio: HistorialIncidentesService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialServicio.listar(paginacionQueryDto);
    return result;
  }
  @Post()
  async crear(@Req() req, @Body() registroDto: RegistroIncidenteDto) {
    const result = await this.historialServicio.crear(registroDto);
    return result;
  }
  @Patch('/limpiarPorFecha')
  async limpiarPorFecha(@Body() intevaloFechaDto: IntervaloFechasDto) {
    const result = await this.historialServicio.inactivarPorFecha(
      intevaloFechaDto,
    );
    return result;
  }
  @Patch('/:id/limpiar')
  async limpiar(@Param() params: ParamIdDto) {
    const { id: idHistorial } = params;
    const result = await this.historialServicio.inactivar(idHistorial);
    return result;
  }
}
