import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'
import { Request } from 'express'
import { Enforcer } from 'casbin/lib/cjs/enforcer'

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: Enforcer) {}

  async canActivate(context: ExecutionContext) {
    const {
      user,
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl

    if (!user) {
      throw new UnauthorizedException()
    }
    console.log(user.rol, resource, action)
    const isPermitted = await this.enforcer.enforce(user.rol, resource, action)
    if (isPermitted) {
      return true
    }

    throw new ForbiddenException('Permisos insuficientes (CASBIN)')
  }
}
