import { Alarma } from 'src/alarma/entity/alarmas.entity'
import { Status } from 'src/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alarma1611171041793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'Boton de panico Sonoro',
        seguridadBienes: false,
        sensoresHumo: false,
        envio_noti: '3',
        idSimulador: null,
        sonido: '3',
        alumbradoAutomatico: false,
        estado: Status.ACTIVE,
      },
      {
        nombre: 'Boton de panico Silencioso',
        seguridadBienes: false,
        sensoresHumo: false,
        envio_noti: '3',
        idSimulador: null,
        sonido: '1',
        alumbradoAutomatico: false,
        estado: Status.ACTIVE,
      },
    ]

    for (const item of items) {
      const alarmas = new Alarma({
        nombre: item.nombre,
        seguridadBienes: item.seguridadBienes,
        sensoresHumo: item.sensoresHumo,
        envio_noti: item.envio_noti,
        idSimulador: item.idSimulador,
        sonido: item.sonido,
        alumbradoAutomatico: item.alumbradoAutomatico,
        estado: item.estado,
      })
      await queryRunner.manager.save(alarmas)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
