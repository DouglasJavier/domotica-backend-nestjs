import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { PassportUserType, PayloadType } from './authentication.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        let token = null
        if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
          token = req.headers.authorization.split(' ')[1]
        } else if (req.query && req.query.token) {
          token = req.query.token
        }
        return token
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: PayloadType): Promise<PassportUserType> {
    return {
      id: payload.id,
      rol: payload.rol,
    }
  }
}
