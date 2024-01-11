import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Contacto } from './contactos.entity'
import { PaginacionQueryDto } from 'src/common/dto/paginacionDto'
import { ContactoCRUDType } from './dto/ContactoCRUDType'

@Injectable()
export class ContactoRepository {
  constructor(private dataSource: DataSource) {}
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, salto, campo, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Contacto)
      .createQueryBuilder('contacto')
      .leftJoin('contacto.alarmaContactos', 'alarmaContactos')
      .leftJoin('alarmaContactos.alarma', 'alarma')
      .select([
        'contacto.id',
        'contacto.nombre',
        'contacto.apellido',
        'contacto.numeroTel1',
        'contacto.numeroTel2',
        'alarmaContactos.id',
        'alarma.id',
        'alarma.nombre',
      ])
      .where('contacto.estado = :estado', { estado: 'ACTIVO' })
    //.andWhere('alarmaContactos.estado = :estado');
    if (limite) query.take(limite)
    if (salto) query.skip(salto)
    switch (campo) {
      case 'id':
        query.addOrderBy('contacto.id', sentido)
        break
      case 'nombre':
        query.addOrderBy('contacto.nombre', sentido)
        break
      default:
        query.orderBy('contacto.id', 'ASC')
    }
    return await query.getManyAndCount()
  }
  async crear(contactoDto: ContactoCRUDType) {
    return await this.dataSource
      .getRepository(Contacto)
      .save(new Contacto({ ...contactoDto, estado: 'ACTIVO' }))
  }
  async actualizar(id: string, contactoDto: Partial<Contacto>) {
    return await this.dataSource.getRepository(Contacto).update(
      id,
      new Contacto({
        ...contactoDto,
      })
    )
  }
}
