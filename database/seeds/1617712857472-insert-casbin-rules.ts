import { CasbinRule } from '../../src/core/authorization/entity/casbin.entity'
import { RolEnum } from '../../src/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const backendRoutes: CasbinValue = {
      '/usuarios': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/usuarios/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/usuarios/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/usuarios/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/alarmas': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
    ) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        const rolNameList = Object.keys(valoresCasbin[routePath])
        for (const rolName of rolNameList) {
          const action = valoresCasbin[routePath][rolName]
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: action,
            v3: tipo,
          })
          await queryRunner.manager.save(datosRegistro)
        }
      }
    }

    await registrarCasbin(backendRoutes, 'backend')
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

export type RouteItem = {
  [key: string]: string
}

export type CasbinValue = {
  [key: string]: RouteItem
}
