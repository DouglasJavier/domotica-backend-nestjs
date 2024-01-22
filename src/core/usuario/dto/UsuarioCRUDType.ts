export interface UsuarioCRUDType {
  nombres: string
  apellidos: string
  usuario: string
  contrasenia: string
  rol: string
}

export interface UsuarioEditarType {
  usuario: string
  contrasenia1: string
  contrasenia2?: string
}
