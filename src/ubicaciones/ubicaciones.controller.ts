import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { UbicacionService } from './ubicaciones.service';
import { Ubicacion } from './ubicaciones.entity';
import { PaginacionQueryDto } from '../common/dto/paginacionDto';
import { CrearUbicacionDto } from './dto/crear-ubicacionDto';
import { ParamIdDto } from 'src/common/dto/params-id.dto';

@Controller('ubicaciones')
export class UbicacionController {
  constructor(private ubicacionServicio: UbicacionService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.ubicacionServicio.listar(paginacionQueryDto);
    return result;
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: CrearUbicacionDto) {
    const result = await this.ubicacionServicio.crear(parametroDto);
    return result;
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: CrearUbicacionDto,
  ) {
    const { id: idUbicacion } = params;
    const result = await this.ubicacionServicio.actualizar(
      idUbicacion,
      parametroDto,
    );
    return result;
  }

  @Patch(':id/activar')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params;
    const result = await this.ubicacionServicio.activar(idUbicacion);
    return result;
  }

  @Patch(':id/inactivar')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params;
    const result = await this.ubicacionServicio.inactivar(idUbicacion);
    return result;
  }
}
