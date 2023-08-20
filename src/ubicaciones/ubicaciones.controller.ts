import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { UbicacionService } from './ubicaciones.service';
import { Ubicacion } from './ubicaciones.entity';
import { PaginacionQueryDto } from '../common/dto/paginacionDto';
import { CrearUbicacionDto } from './dto/crear-ubicacionDto';

@Controller('ubicaciones')
export class UbicacionController {
  constructor(private ubicacionServicio: UbicacionService) {}
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.ubicacionServicio.listar(paginacionQueryDto);
    return result;
  }

  @Post()
  async crear(@Req() req, @Body() parametroDto: CrearUbicacionDto) {
    /* const user = req.user.id;
    if (!user) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`,
      );
    }
    const usuarioAuditoria = user; */
    const result = await this.ubicacionServicio.crear(
      parametroDto,
      //usuarioAuditoria,
    );
    return result;
  }
}

/*

@Controller('car')
export class CarController {
  constructor(private carService: CarService) {}

  @Get()
  async getCarByColor(@Query('color') color) {
    return this.carService.getCarByColor(color);
  }
  @Get()
  async getCars(): Promise<Car[]> {
    return this.carService.getAllCars();
  }
  @Get(':id')
  async getOneCar(@Param('id') cid: string): Promise<Car> {
    return this.carService.getCarById(cid);
  }
  @Post()
  async postCar(@Body() request: CreateCarDTO) {
    return this.carService.postCar(request);
  }
  @Delete(':id')
  async deleteCar(@Param('id') cid: string) {
    return this.carService.deleteCarById(cid);
  }
  @Put(':id')
  async updateCar(@Param('id') cid: string, @Body() request: UpdateCarDTO) {
    return this.carService.putCarById(cid, request);
  }
}
*/
