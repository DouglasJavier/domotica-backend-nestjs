import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { ContactoService } from './contactos.service';
import { ContactoCRUDType } from './dto/ContactoCRUDType';

@Controller('contactos')
export class ContactoController {
  constructor(private contactoService: ContactoService) {}
  @Get()
  async listaContactos() {
    const lista = this.contactoService.listar();
    return lista;
  }

  @Post()
  async crearContacto(@Body() contactoDto: ContactoCRUDType) {
    const result = this.contactoService.crear(contactoDto);
    return result;
  }
} 
