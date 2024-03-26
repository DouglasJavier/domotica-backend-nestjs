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
  ESP32CAM = 'ESP-32 CAM',
  ESP32 = 'ESP-32',
}
export enum SensorActuadorConst {
  PIR = 'PIR',
  MQ2 = 'MQ-2',
  MQ7 = 'MQ-7',
  FOCO = 'FOCO',
  SIRENA = 'SIRENA',
}

export const TiposSensores = {
  tipoSeguridadBienes: ['PIR'],
  tipoHumo: ['MQ-2', 'MQ-7'],
  tipoAlumbrado: ['PIR'],
}

export const TipoSalidaSensor = {
  pullDown: ['PIR'],
  pullUp: ['MQ-2', 'MQ-7'],
}

export enum AccionConst {
  ENCENDER = 'ENCENDER',
  APAGAR = 'APAGAR',
  ELIMINAR = 'ELIMINAR',
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
