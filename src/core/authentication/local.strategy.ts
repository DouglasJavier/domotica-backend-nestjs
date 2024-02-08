import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './authentication.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly autenticacionService: AuthService) {
    super({
      usernameField: 'usuario',
      passwordField: 'contrasena',
    })
  }

  async validate(username: string, password: string): Promise<PassportUser> {
    console.log('uwu')
    const usuario = await this.autenticacionService.validarUsuario(
      username,
      password
    )
    if (!usuario) {
      throw new UnauthorizedException()
    }
    return { id: usuario.id, rol: usuario.rol }
  }
}
