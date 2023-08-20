import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Controller } from '@nestjs/common';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarService } from './historialActivarDesactivar.service';

@Controller('historialActivarDesactivar')
export class HistorialActivarDesactivarController {
  constructor(
    private historialActivarDesactivarService: HistorialActivarDesactivarService,
  ) {}
}
