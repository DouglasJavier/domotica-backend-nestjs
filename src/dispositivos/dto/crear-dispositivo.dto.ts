export class DispositivoCrearDto {
  nombre: string
  tipo: string
  direccionLan: string
  direccionWan?: string
  idUbicacion: string
  sensoresActuadores: SensorActuadorDto[]
}
export class SensorActuadorDto {
  pin: string
  tipo: string
  descripcion: string
  idUbicacion?: string
}
