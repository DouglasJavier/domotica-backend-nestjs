import { Body, Get, Param, Patch, Query, UseGuards } from '@nestjs/common'

import { Controller } from '@nestjs/common'
import { HistorialActivarDesactivarService } from './historialActivarDesactivar.service'
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { JwtAuthGuard } from 'src/core/authentication/usuario/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('historialActivarDesactivar')
export class HistorialActivarDesactivarController {
  constructor(
    private historialActivarDesactivarServicio: HistorialActivarDesactivarService
  ) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialActivarDesactivarServicio.listar(
      paginacionQueryDto
    )
    return result
  }
  @Patch('/limpiarPorFecha')
  async limpiarPorFecha(@Body() intevaloFechaDto: IntervaloFechasDto) {
    const result =
      await this.historialActivarDesactivarServicio.inactivarPorFecha(
        intevaloFechaDto
      )
    return result
  }
  @Patch('/:id/limpiar')
  async limpiar(@Param() params: ParamIdDto) {
    const { id: idHistorial } = params
    const result = await this.historialActivarDesactivarServicio.inactivar(
      idHistorial
    )
    return result
  }
}
