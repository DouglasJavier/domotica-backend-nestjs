import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { UbicacionAlarma } from '../entity/ubicacionesAlarmas.entity'
import { Status } from 'src/common/constants'

@Injectable()
export class ubicacionAlarmaRepository {
  constructor(private dataSource: DataSource) {}
  async inactivarUbicaciones(idAlarma: string, transaction: EntityManager) {
    return await transaction
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
  async crearUbicaciones(
    idUbicaciones: string[],
    idAlarma: string,
    transaction: EntityManager
  ) {
    await idUbicaciones.map(async (idUbicacion) => {
      const ubicacionAlarma = new UbicacionAlarma()
      ubicacionAlarma.idUbicacion = idUbicacion
      ubicacionAlarma.idAlarma = idAlarma
      ubicacionAlarma.estado = Status.ACTIVE
      await transaction.getRepository(UbicacionAlarma).save(ubicacionAlarma)
    })
  }
}
