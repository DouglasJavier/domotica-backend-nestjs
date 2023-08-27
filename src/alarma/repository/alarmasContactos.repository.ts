import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AlarmaContacto } from '../entity/alarmasContactos.entity';

@Injectable()
export class AlarmaContactoRepository {
  constructor(private dataSource: DataSource) {}
  async inactivarContactos(idAlarma: string) {
    return await this.dataSource
      .getRepository(AlarmaContacto)
      .createQueryBuilder()
      .update(AlarmaContacto)
      .set({
        estado: 'INACTIVO',
      })
      .where('idAlarma = :idAlarma', { idAlarma })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute();
  }
}
