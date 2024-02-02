export interface AlarmaCRUDType {
  envio_noti: string
  idContactos: string[]
  idSimulador: string | null
  idUbicaciones: string[]
  nombre: string
  sonido: string
  alumbradoAutomatico: boolean
  seguridadBienes: boolean
  sensoresHumo: boolean
}

export interface BotonPanicoType {
  idContactos: string[]
}
