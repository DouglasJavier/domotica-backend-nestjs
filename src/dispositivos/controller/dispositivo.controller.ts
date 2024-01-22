import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Controller } from '@nestjs/common'
import { DispositivoService } from '../service/dispositivo.service'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { DispositivoCrearDto } from '../dto/crear-dispositivo.dto'
import { JwtAuthGuard } from 'src/core/authentication/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('dispositivos')
export class DispositivoController {
  constructor(private dispositivoServicio: DispositivoService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.dispositivoServicio.listar(paginacionQueryDto)
    return result
  }

  @Get('/listarActuadores')
  async listarActuadores() {
    const result = await this.dispositivoServicio.listarActuadores()
    return result
  }

  @Get('/camaras')
  async listarCamaras() {
    const result = await this.dispositivoServicio.listarCamaras()
    return result
  }
  @Post()
  async crear(@Req() req, @Body() parametroDto: DispositivoCrearDto) {
    const result = await this.dispositivoServicio.crear(parametroDto)
    return result
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: DispositivoCrearDto
  ) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.actualizar(
      idUbicacion,
      parametroDto
    )
    return result
  }

  @Patch(':id/activar')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.activar(idUbicacion)
    return result
  }

  @Patch(':id/inactivar')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.dispositivoServicio.inactivar(idUbicacion)
    return result
  }
}
