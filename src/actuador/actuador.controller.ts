import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Actuador } from './actuador.entity';
import { ActuadorService } from './actuador.service';

import { Controller } from '@nestjs/common';

@Controller('actuadores')
export class ActuadorController {
  constructor(private actuadorService: ActuadorService) {}
}
