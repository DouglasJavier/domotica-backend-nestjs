import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contacto } from './contactos.entity'
import { ContactoRepository } from './contactos.repository'
import { ContactoCRUDType } from './dto/ContactoCRUDType'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'

@Injectable()
export class ContactoService {
  constructor(
    @Inject(ContactoRepository)
    private contactoRepositorio: ContactoRepository
  ) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.contactoRepositorio.listar(paginacionQueryDto)
  }

  async crear(contactoDto: ContactoCRUDType) {
    const contacto = await this.contactoRepositorio.crear(contactoDto)
    return contacto
  }

  async actualizar(id: string, contactoDto: ContactoCRUDType) {
    const result = await this.contactoRepositorio.actualizar(id, contactoDto)
    return result
  }

  async activar(id: string) {
    const result = await this.contactoRepositorio.actualizar(id, {
      estado: 'ACTIVO',
    })
    return result
  }

  async inactivar(id: string) {
    const result = await this.contactoRepositorio.actualizar(id, {
      estado: 'INACTIVO',
    })
    return result
  }
}
