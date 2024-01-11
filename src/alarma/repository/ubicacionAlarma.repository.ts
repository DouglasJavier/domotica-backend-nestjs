import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UbicacionAlarma } from '../entity/ubicacionesAlarmas.entity'

@Injectable()
export class ubicacionAlarmaRepository {
  constructor(private dataSource: DataSource) {}
  async inactivarUbicaciones(idAlarma: string) {
    return await this.dataSource
      .getRepository(UbicacionAlarma)
      .createQueryBuilder()
      .update(UbicacionAlarma)
      .set({
        estado: 'INACTIVO',
      })
      .where('idAlarma = :idAlarma', { idAlarma })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute()
  }
}
