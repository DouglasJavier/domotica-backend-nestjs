import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { AlarmaContacto } from '../entity/alarmasContactos.entity'

@Injectable()
export class AlarmaContactoRepository {
  constructor(private dataSource: DataSource) {}
  async inactivarContactos(idAlarma: string, transaction: EntityManager) {
    return await transaction
      .getRepository(AlarmaContacto)
      .createQueryBuilder()
      .update(AlarmaContacto)
      .set({
        estado: 'INACTIVO',
      })
      .where('idAlarma = :idAlarma', { idAlarma })
      // .andWhere('id_articulo IN(:...ids)', { ids: articulos })
      .execute()
  }
  async crearContactos(
    idContactos: string[],
    idAlarma: string,
    transaction: EntityManager
  ) {
    await idContactos.map(async (idContacto) => {
      const alarmaContacto = new AlarmaContacto()
      alarmaContacto.idContacto = idContacto
      alarmaContacto.idAlarma = idAlarma
      alarmaContacto.estado = 'ACTIVO'
      await transaction.getRepository(AlarmaContacto).save(alarmaContacto)
    })
  }
}
