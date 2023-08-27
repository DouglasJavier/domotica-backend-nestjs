import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { DispositivoService } from '../service/dispositivo.service';

@Controller('dispositivos')
export class DispositivoController {
  constructor(private dsipositivoService: DispositivoService) {}
}
