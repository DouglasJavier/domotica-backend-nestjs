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
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { UsuarioService } from './usuario.service'
import { UsuarioCRUDType } from './dto/UsuarioCRUDType'
import { JwtAuthGuard } from '../authentication/jwt-auth.guard'
import { CasbinGuard } from '../authorization/guards/casbin.guard'

@Controller('usuarios')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UsuarioController {
  constructor(private contactoServicio: UsuarioService) {}

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.contactoServicio.listar(paginacionQueryDto)
    return result
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: UsuarioCRUDType) {
    const result = await this.contactoServicio.crear(parametroDto)
    return result
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: UsuarioCRUDType
  ) {
    const { id: idUbicacion } = params
    const result = await this.contactoServicio.actualizar(
      idUbicacion,
      parametroDto
    )
    return result
  }

  @Patch(':id/activar')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.contactoServicio.activar(idUbicacion)
    return result
  }

  @Patch(':id/inactivar')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.contactoServicio.inactivar(idUbicacion)
    return result
  }
}
