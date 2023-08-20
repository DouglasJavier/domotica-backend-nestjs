import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './contactos.entity';
import { ContactoRepository } from './contactos.repository';
import { PaginacionQueryDto } from './dto/paginacionDto';
import { ContactoCRUDType } from './dto/ContactoCRUDType';

@Injectable()
export class ContactoService {
  constructor(
    @Inject(ContactoRepository)
    private contactoRepositorio: ContactoRepository,
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.contactoRepositorio.listar(paginacionQueryDto);
  }

  async crear(carritoDto: ContactoCRUDType) {
    const carrito = await this.contactoRepositorio.crear(carritoDto);
  }

  async actualizar(ContactoCRUDType) {
    return 1
  }
}
