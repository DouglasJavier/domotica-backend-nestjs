import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Controller } from '@nestjs/common'
import { HistorialIncidentesService } from './historialIncidentes.service'
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto'
import {
  AtencionIncidentesDto,
  RegistroIncidenteDto,
} from './dto/crear-historialIncidenteDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { JwtAuthGuard } from 'src/core/authentication/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { Request } from 'express'
import { AuthService } from 'src/core/authentication/authentication.service'
@Controller('historialIncidentes')
export class HistorialIncidentesController {
  constructor(
    private historialServicio: HistorialIncidentesService,
    private authService: AuthService
  ) {}
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialServicio.listar(paginacionQueryDto)
    return result
  }

  @Post()
  async crear(@Req() req, @Body() registroDto: RegistroIncidenteDto) {
    const key = req.headers['key']
    await this.authService.validarDispositivo(registroDto.idDispositivo, key)
    const result = await this.historialServicio.crear(registroDto)
    return result
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/:id/botonPanico')
  async accionarBotonPanico(@Req() req, @Param() params: ParamIdDto) {
    const usuarioAuditoria = req.user.id
    const { id: idBoton } = params
    const result = await this.historialServicio.accionarBotonPanico(
      idBoton,
      usuarioAuditoria
    )
    return result
  }
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/atender')
  async antenderIncidentes(
    @Req() req: Request,
    @Param() params: ParamIdDto,
    @Body() atencionIncidentesDto: AtencionIncidentesDto
  ) {
    const usuarioAuditoria = req.user.id
    const { id: idHistorial } = params
    const result = await this.historialServicio.atencionIncidentes(
      idHistorial,
      atencionIncidentesDto,
      usuarioAuditoria
    )
    return result
  }
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/descartar')
  async descartarIncidentes(@Req() req: Request, @Param() params: ParamIdDto) {
    const usuarioAuditoria = req.user.id
    const { id: idHistorial } = params
    const result = await this.historialServicio.descartarIncidentes(
      idHistorial,
      usuarioAuditoria
    )
    return result
  }
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/limpiarPorFecha')
  async limpiarPorFecha(@Body() intevaloFechaDto: IntervaloFechasDto) {
    const result = await this.historialServicio.inactivarPorFecha(
      intevaloFechaDto
    )
    return result
  }
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/limpiar')
  async limpiar(@Param() params: ParamIdDto) {
    const { id: idHistorial } = params
    const result = await this.historialServicio.inactivar(idHistorial)
    return result
  }
  @UseGuards(JwtAuthGuard)
  @Get('/fotos/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'fotos' })
  }
}
