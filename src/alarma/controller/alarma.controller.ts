import { Body, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'

import { Controller } from '@nestjs/common'
import { AlarmaService } from '../service/alarma.service'
import { AlarmaCRUDType } from '../dto/alarmaCRUDType'
import { JwtAuthGuard } from 'src/core/authentication/usuario/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'
import { Request } from 'express'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('alarmas')
export class AlarmaController {
  constructor(private alarmaService: AlarmaService) {}

  @Get()
  async listaAlarmas() {
    const lista = this.alarmaService.listaAlarmas()
    return lista
  }

  @Get(':id')
  async buscarAlarma(@Param('id') id: string) {
    const lista = this.alarmaService.alarmaPorId(id)
    return lista
  }

  @Post()
  async crearAlarma(@Body() alarmaDto: AlarmaCRUDType, @Req() req: Request) {
    const usuarioAuditoria = req.user.id

    const result = this.alarmaService.crear(alarmaDto, usuarioAuditoria)
    return result
  }

  @Patch('/apagarSirenas')
  async apagarSirenas(@Req() req: Request) {
    const usuarioAuditoria = req.user.id
    const result = this.alarmaService.apagarSirenas(usuarioAuditoria)
    return result
  }

  @Patch(':id')
  async editarAlarma(
    @Body() alarmaDto: AlarmaCRUDType,
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const usuarioAuditoria = req.user.id

    const result = this.alarmaService.editar(alarmaDto, id, usuarioAuditoria)
    return result
  }
  @Patch(':id/editarBoton')
  async editarBotonPanico(
    @Body() alarmaDto: AlarmaCRUDType,
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const usuarioAuditoria = req.user.id

    const result = this.alarmaService.editarBotonPanico(
      alarmaDto,
      id,
      usuarioAuditoria
    )
    return result
  }
  @Patch(':id/encender')
  async encenderAlarma(@Param('id') id: string, @Req() req: Request) {
    const usuarioAuditoria = req.user.id
    const result = this.alarmaService.encender(id, usuarioAuditoria)
    return result
  }
  @Patch(':id/apagar')
  async apagarAlarma(@Param('id') id: string, @Req() req: Request) {
    const usuarioAuditoria = req.user.id

    const result = this.alarmaService.apagar(id, usuarioAuditoria)
    return result
  }
  @Patch(':id/eliminar')
  async eliminarAlarma(@Param('id') id: string, @Req() req: Request) {
    const usuarioAuditoria = req.user.id

    const result = this.alarmaService.inactivar(id, usuarioAuditoria)
    return result
  }
}
