import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SimuladorActuadorService } from './simuladorActuador.service';

import { Controller } from '@nestjs/common';

@Controller('simuladorAcutador')
export class SimuladorActuadorController {
  constructor(private simuladorActuadorService: SimuladorActuadorService) {}
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
