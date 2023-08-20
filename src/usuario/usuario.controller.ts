import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
//import { request } from 'http';

@Controller('usuario')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
}
