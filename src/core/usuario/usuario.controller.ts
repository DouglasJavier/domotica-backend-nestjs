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
import { UsuarioCRUDType, UsuarioEditarType } from './dto/UsuarioCRUDType'
import { JwtAuthGuard } from '../authentication/jwt-auth.guard'
import { CasbinGuard } from '../authorization/guards/casbin.guard'
import { Request } from 'express'

@Controller('usuarios')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UsuarioController {
  constructor(private contactoServicio: UsuarioService) {}

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.contactoServicio.listar(paginacionQueryDto)
    return result
  }

  @Get('/perfil')
  async verPerfil(@Req() req: Request) {
    const usuarioAuditoria = req.user.id
    console.log(usuarioAuditoria)
    const result = await this.contactoServicio.verPerfil(usuarioAuditoria)
    return result
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: UsuarioCRUDType) {
    const result = await this.contactoServicio.crear(parametroDto)
    return result
  }

  @Patch('/editar')
  async editarUsuario(
    @Req() req: Request,
    @Body() usuarioDto: UsuarioEditarType
  ) {
    const usuarioAuditoria = req.user.id
    console.log(usuarioAuditoria)
    const result = await this.contactoServicio.editar(
      usuarioAuditoria,
      usuarioDto
    )
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
