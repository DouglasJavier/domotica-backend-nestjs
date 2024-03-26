import { TextService } from 'src/common/lib/text.service'
import { Usuario } from 'src/core/usuario/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const items = [
      {
        //id: 1,
        usuario: 'Admin',
        nombres: 'Administrador',
        apellidos: 'Ap Admin',
        estado: 'ACTIVO',
        rol: 'ADMINISTRADOR',
        idTelegram: '',
      },
    ]

    for (const item of items) {
      const usuario = new Usuario({
        usuario: item.usuario,
        nombres: item.nombres,
        apellidos: item.apellidos,
        estado: item.estado,
        rol: item.rol,
        contrasenia: pass,
        idTelegram: item.idTelegram,
      })
      await queryRunner.manager.save(usuario)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
