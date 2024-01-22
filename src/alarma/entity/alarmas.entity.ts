import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { Simulador } from '../../simulador/entity/simulador.entity'
import { AlarmaContacto } from './alarmasContactos.entity'
import { UbicacionAlarma } from './ubicacionesAlarmas.entity'
import { HistorialActivarDesactivar } from '../../historialActivarDesactivar/historialActivarDesactivar.entity'
import { HistorialIncidentes } from '../../historialIncidentes/historialIncidentes.entity'
import * as dotenv from 'dotenv'
dotenv.config()
@Entity({ name: 'alarmas', schema: process.env.DB_SCHEMA_PROYECTO })
export class Alarma {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 20, type: 'varchar' })
  estado: string

  @Column({ length: 50, type: 'varchar', unique: true })
  nombre: string

  @Column({ length: 2, type: 'varchar' })
  sonido: string

  @Column({ length: 50, type: 'varchar' })
  envio_noti: string

  @Column({ name: 'alumbrado_automatico', type: 'boolean', default: false })
  alumbradoAutomatico: boolean

  @Column({ name: 'seguridad_bienes', type: 'boolean', default: false })
  seguridadBienes: boolean

  @Column({ name: 'sensores_humo', type: 'boolean', default: false })
  sensoresHumo: boolean

  @OneToMany(() => AlarmaContacto, (alarmaContacto) => alarmaContacto.alarma)
  alarmaContactos: AlarmaContacto[]

  @OneToMany(() => UbicacionAlarma, (ubicacionAlarma) => ubicacionAlarma.alarma)
  ubicacionAlarmas: UbicacionAlarma[]

  @OneToMany(
    () => HistorialActivarDesactivar,
    (historialActivarDesactivar) => historialActivarDesactivar.alarma
  )
  historialActivarDesactivar: HistorialActivarDesactivar[]

  @Column({
    name: 'id_simulador',
    type: 'bigint',
    nullable: true,
  })
  idSimulador: string | null
  @ManyToOne(() => Simulador, (simulador) => simulador.alarmas, {
    nullable: true,
  })
  @JoinColumn({
    name: 'id_simulador',
    referencedColumnName: 'id',
  })
  simulador: Simulador | null

  @OneToMany(
    () => HistorialIncidentes,
    (historialIncidentes) => historialIncidentes.alarma
  )
  historialIncidentes: HistorialIncidentes[]

  constructor(data?: Partial<Alarma>) {
    if (data) Object.assign(this, data)
  }
}
