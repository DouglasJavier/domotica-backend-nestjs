export class CrearHistorialIncidentesDto {
  id?: string;
  fecha: Date;
  idSensor: string;
  idAlarma: string;
}

export class RegistroIncidenteDto {
  idDispositivo: string;
  pin: string;
}
