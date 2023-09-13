import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarService } from './historialActivarDesactivar.service';
import {
  IntervaloFechasDto,
  PaginacionQueryDto,
} from 'src/common/dto/paginacionDto';
import { ParamIdDto } from 'src/common/dto/params-id.dto';

@Controller('historialActivarDesactivar')
export class HistorialActivarDesactivarController {
  constructor(
    private historialActivarDesactivarServicio: HistorialActivarDesactivarService,
  ) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.historialActivarDesactivarServicio.listar(
      paginacionQueryDto,
    );
    return result;
  }
  @Patch('/limpiarPorFecha')
  async limpiarPorFecha(@Body() intevaloFechaDto: IntervaloFechasDto) {
    const result =
      await this.historialActivarDesactivarServicio.inactivarPorFecha(
        intevaloFechaDto,
      );
    return result;
  }
  @Patch('/:id/limpiar')
  async limpiar(@Param() params: ParamIdDto) {
    const { id: idHistorial } = params;
    const result = await this.historialActivarDesactivarServicio.inactivar(
      idHistorial,
    );
    return result;
  }
}
