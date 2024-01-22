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
      '/usuarios/perfil': {
        [RolEnum.ADMINISTRADOR]: 'GET',
        [RolEnum.USUARIO]: 'GET',
      },
      '/usuarios/editar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/usuarios/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/usuarios/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/ubicaciones': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/ubicaciones/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/ubicaciones/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/ubicaciones/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/simuladores': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/simuladores/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/simuladores/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/simuladores/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/historialIncidentes': {
        [RolEnum.ADMINISTRADOR]: 'GET',
        [RolEnum.USUARIO]: 'GET',
      },
      '/historialIncidentes/limpiarPorFecha': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/historialIncidentes/:id/limpiar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/historialIncidentes/fotos/:fileId': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/historialActivarDesactivar': {
        [RolEnum.ADMINISTRADOR]: 'GET',
        [RolEnum.USUARIO]: 'GET',
      },
      'historialActivarDesactivar/limpiarPorFecha': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      'historialActivarDesactivar/:id/limpiar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/dispositivos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/dispositivos/listarActuadores': {
        [RolEnum.ADMINISTRADOR]: 'GET',
        [RolEnum.USUARIO]: 'GET',
      },
      '/dispositivos/camaras': {
        [RolEnum.ADMINISTRADOR]: 'GET',
        [RolEnum.USUARIO]: 'GET',
      },
      '/dispositivos/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/dispositivos/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/dispositivos/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/contactos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET|POST',
      },
      '/contactos/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/contactos/:id/activar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/contactos/:id/inactivar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/alarmas': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.USUARIO]: 'GET',
      },
      '/alarmas/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/alarmas/:id/encender': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/alarmas/:id/apagar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
        [RolEnum.USUARIO]: 'PATCH',
      },
      '/alarmas/:id/eliminar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
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
