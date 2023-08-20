import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { AlarmaContactoService } from './alarmasContactos.service';

@Controller('alarmaContacto')
export class AlarmaContactoController {
  constructor(private alarmaContactoService: AlarmaContactoService) {}
}
