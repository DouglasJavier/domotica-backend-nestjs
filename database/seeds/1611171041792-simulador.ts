import { Simulador } from 'src/simulador/entity/simulador.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class simulador1611171041792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'Ninguno',
        estado: 'ACTIVO',
      },
    ]

    for (const item of items) {
      const usuario = new Simulador({
        nombre: item.nombre,
        estado: item.estado,
      })
      await queryRunner.manager.save(usuario)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
