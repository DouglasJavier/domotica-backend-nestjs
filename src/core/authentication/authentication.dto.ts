export class LoginAuthDto {
  usuario: string
  password: string
}
export class PayloadType {
  id: string
  rol: string
}
export class PassportUserType {
  id: string // colocar el tipo según el modelo usuario.entity
  rol: string
  idToken?: string
  accessToken?: string
  refreshToken?: string
  exp?: number
  iat?: number
}
