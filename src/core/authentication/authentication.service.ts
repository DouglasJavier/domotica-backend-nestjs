import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginAuthDto } from './authentication.dto'
import { UsuarioService } from '../usuario/usuario.service'
import { JwtService } from '@nestjs/jwt'
import { TextService } from 'src/common/lib/text.service'
import { DispositivoService } from 'src/app/dispositivos/service/dispositivo.service'
import { DispositivoRepository } from 'src/app/dispositivos/repository/dispositivo.repository'

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private dispositivoRepository: DispositivoRepository,
    private readonly jwtService: JwtService
  ) {}

  async autenticar(loginAuth: LoginAuthDto) {
    const usuario = await this.usuarioService.buscarPorUser(loginAuth.usuario)
    const payload = {
      id: usuario.id,
      rol: usuario.rol,
    }
    delete usuario.contrasenia
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    }
    return data
  }
  async validarUsuario(usuario: string, contrasena: string) {
    const respuesta = await this.usuarioService.buscarPorUser(usuario)

    if (!respuesta) {
      return null
    }

    if (respuesta?.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario inactivado')
    }

    // verificar si la cuenta esta bloqueada
    if (respuesta.intentos > 5) {
      await this.usuarioService._actualizar(respuesta.id, {
        estado: 'BLOQUEADO',
      })
      throw new UnauthorizedException('Usuario bloqueado')
    }

    const pass = TextService.decodeBase64(contrasena)

    if (!(await TextService.compare(pass, respuesta.contrasenia))) {
      await this.usuarioService._actualizar(respuesta.id, {
        intentos: respuesta.intentos + 1,
      })
      throw new UnauthorizedException('Credenciales invalidos')
    }
    // si se logra autenticar con éxito => reiniciar contador de intentos a 0
    if (respuesta.intentos > 0) {
      await this.usuarioService._actualizar(respuesta.id, {
        intentos: 0,
      })
    }

    return {
      id: respuesta.id,
      rol: respuesta.rol,
    }
  }
  async validarDispositivo(idDispositivo: string, contrasenia: string) {
    const dispositivo = await this.dispositivoRepository.buscarPorId(
      idDispositivo
    )
    if (!(contrasenia === dispositivo.contrasenia)) {
      throw new UnauthorizedException()
    }
    /*   const pass = TextService.decodeBase64(contrasenia)

    if (!(await TextService.compareSHA256(pass, dispositivo.contrasenia))) {
      throw new UnauthorizedException()
    } */

    return dispositivo
  }
}
