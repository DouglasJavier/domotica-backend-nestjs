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
import { SimuladorService } from '../service/simulador.service'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { SimuladorCrearDto } from '../dto/crear-simulador.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { JwtAuthGuard } from 'src/core/authentication/usuario/jwt-auth.guard'
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('simuladores')
export class SimuladorController {
  constructor(private simuladorServicio: SimuladorService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.simuladorServicio.listar(paginacionQueryDto)
    return result
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: SimuladorCrearDto) {
    const result = await this.simuladorServicio.crear(parametroDto)
    return result
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Body() parametroDto: SimuladorCrearDto
  ) {
    const { id: idUbicacion } = params
    const result = await this.simuladorServicio.actualizar(
      idUbicacion,
      parametroDto
    )
    return result
  }

  @Patch(':id/activar')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.simuladorServicio.activar(idUbicacion)
    return result
  }

  @Patch(':id/inactivar')
  async inactivar(@Param() params: ParamIdDto) {
    const { id: idUbicacion } = params
    const result = await this.simuladorServicio.inactivar(idUbicacion)
    return result
  }
}
