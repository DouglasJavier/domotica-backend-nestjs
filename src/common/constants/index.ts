// swagger config

export enum Status {
  CREATE = 'CREADO',
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  PENDING = 'PENDIENTE',
  ATENDIDO = 'ATENDIDO',
  DESATENDIDO = 'DESATENDIDO',
  DESCARTADO = 'DESCARTADO',
}

export enum DispositivoConts {
  ESP32CAM = 'ESP-32CAM',
  ESP32 = 'ESP-32',
}
export enum SensorActuadorConst {
  PIR = 'PIR',
  MQ2 = 'MQ2',
  FOCO = 'FOCO',
  SIRENA = 'SIRENA',
}
export enum AccionConst {
  ENCENDER = 'ENCENDER',
  APAGAR = 'APAGAR',
}
export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Transaccion {
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
}

export const USUARIO_SISTEMA = '1'
export const USUARIO_NORMAL = '0'
