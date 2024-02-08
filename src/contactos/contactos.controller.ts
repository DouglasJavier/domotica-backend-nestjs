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
import { ContactoService } from './contactos.service'
import { ContactoCRUDType } from './dto/ContactoCRUDType'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { JwtAuthGuard } from 'src/core/authentication/usuario/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('contactos')
export class ContactoController {
  constructor(private contactoServicio: ContactoService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.contactoServicio.listar(paginacionQueryDto)
    return result
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: ContactoCRUDType) {
    const result = await this.contactoServicio.crear(parametroDto)
    return result
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: ContactoCRUDType
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
