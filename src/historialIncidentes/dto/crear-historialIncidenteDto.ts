export class CrearHistorialIncidentesDto {
  id?: string
  fecha: Date
  idSensor: string
  idAlarma: string
  fotos?: string[]
}

export class RegistroIncidenteDto {
  idDispositivo: string
  pin: string
}

export class AtencionIncidentesDto {
  activarSonido: boolean
  notificacionContactos: boolean
}
