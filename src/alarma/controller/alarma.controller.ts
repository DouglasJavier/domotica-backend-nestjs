import { Body, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'

import { Controller } from '@nestjs/common'
import { AlarmaService } from '../service/alarma.service'
import { AlarmaCRUDType } from '../dto/alarmaCRUDType'
import { JwtAuthGuard } from 'src/core/authentication/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'

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
  async crearAlarma(@Body() alarmaDto: AlarmaCRUDType) {
    const result = this.alarmaService.crear(alarmaDto)
    return result
  }

  @Patch(':id')
  async editarAlarma(
    @Body() alarmaDto: AlarmaCRUDType,
    @Param('id') id: string
  ) {
    const result = this.alarmaService.editar(alarmaDto, id)
    return result
  }
  @Patch(':id/encender')
  async encenderAlarma(@Param('id') id: string) {
    const result = this.alarmaService.encender(id)
    return result
  }
  @Patch(':id/apagar')
  async apagarAlarma(@Param('id') id: string) {
    const result = this.alarmaService.apagar(id)
    return result
  }
  @Patch(':id/eliminar')
  async eliminarAlarma(@Param('id') id: string) {
    const result = this.alarmaService.inactivar(id)
    return result
  }
}
