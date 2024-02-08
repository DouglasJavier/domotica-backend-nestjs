import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './authentication.service'

@Injectable()
export class DispositivoStrategy extends PassportStrategy(
  Strategy,
  'dispositivo'
) {
  constructor(private readonly autenticacionService: AuthService) {
    super()
  }
  async validate(
    idDispositivo: string,
    contrasenia: string
  ): Promise<DispositivoUser> {
    console.log('Entró a validar dispositivo')
    const dispositivo = await this.autenticacionService.validarDispositivo(
      idDispositivo,
      contrasenia
    )
    if (!dispositivo) {
      throw new UnauthorizedException()
    }
    return { idDispositivo: dispositivo.id }
  }
}
