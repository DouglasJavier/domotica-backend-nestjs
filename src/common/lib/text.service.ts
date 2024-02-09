import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
//import zxcvbn from 'zxcvbn-typescript'
import { Configurations } from '../params'
import * as crypto from 'crypto'

@Injectable()
export class TextService {
  /**
   * Método para encriptar un password
   * @param password contraseña
   */
  static async encrypt(password: string) {
    return await hash(password, Configurations.SALT_ROUNDS)
  }

  static async compare(passwordInPlainText: string, hashedPassword: string) {
    return await compare(passwordInPlainText, hashedPassword)
  }

  static async encryptSHA256(password: string) {
    const sha256 = crypto.createHash('sha256')
    sha256.update(password)
    return sha256.digest('hex')
  }

  static async compareSHA256(
    passwordInPlainText: string,
    hashedPassword: string
  ) {
    const hashedInput = await this.encryptSHA256(passwordInPlainText)
    return hashedInput === hashedPassword
  }

  /* static validateLevelPassword(password: string) {
    const result = zxcvbn(password)
    return result.score >= Configurations.SCORE_PASSWORD
  } */

  static decodeBase64 = (base64: string) => {
    const text = TextService.atob(base64)
    return decodeURI(text)
  }

  static atob = (a: string) => Buffer.from(a, 'base64').toString('ascii')

  static btoa = (b: string) => Buffer.from(b).toString('base64')
}
