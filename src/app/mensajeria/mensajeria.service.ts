import { Injectable } from '@nestjs/common'
import { Status } from 'src/common/constants'
import { UsuarioRepository } from 'src/core/usuario/usuario.repository'
import { Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
import { AlarmaRepository } from '../alarma/repository/alarma.repository'
dotenv.config()
@Injectable()
export class MensajeriaService {
  constructor(
    private usuarioRepositorio: UsuarioRepository,
    private alarmaRepositorio: AlarmaRepository
  ) {}

  async enviarMensajeFotosPorTelegramUsuarios(
    fotos?: string[],
    mensaje?: string,
    mensajeBoton?: string
  ) {
    const bot = new Telegraf(process.env.TOKEN_TELEGRAM_BOT)
    const usuarios = await this.usuarioRepositorio.listar({
      estado: Status.ACTIVE,
      salto: 0,
    })
    try {
      for (const usuario of usuarios[0]) {
        if (fotos)
          for (const fotoUrl of fotos) {
            // Envía la foto a través del bot de Telegram
            await bot.telegram.sendPhoto(usuario.idTelegram, {
              source: 'fotos/' + fotoUrl,
            })
          }
        // Envía el mensaje junto con el botón
        if (mensaje)
          await bot.telegram.sendMessage(usuario.idTelegram, `${mensaje}`)
        if (mensajeBoton)
          await bot.telegram.sendMessage(
            usuario.idTelegram,
            `Revisar en ${process.env.URL_HOST}`
          )
      }
    } catch (error) {
      console.error('Error al enviar fotos por Telegram:', error)
    }
  }

  async enviarMensajeFotosPorTelegramContactos(
    idAlarma?: string,
    fotos?: string[],
    mensaje?: string
  ) {
    const bot = new Telegraf(process.env.TOKEN_TELEGRAM_BOT)
    const contactos = await this.alarmaRepositorio.buscarPorId(idAlarma)
    try {
      for (const contacto of contactos.alarmaContactos) {
        if (fotos)
          for (const fotoUrl of fotos) {
            // Envía la foto a través del bot de Telegram
            await bot.telegram.sendPhoto(contacto.contacto.numeroTel1, {
              source: 'fotos/' + fotoUrl,
            })
          }
        // Envía el mensaje junto con el botón
        if (mensaje)
          await bot.telegram.sendMessage(
            contacto.contacto.numeroTel1,
            `${mensaje}`
          )
      }
    } catch (error) {
      console.error('Error al enviar fotos por Telegram:', error)
    }
  }
}
