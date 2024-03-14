import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Alarma } from '../alarma/entity/alarmas.entity'
import { SensorActuador } from 'src/app/dispositivos/entity/sensor_actuador.entity'
import { Fotos } from './fotos.entity'
import * as dotenv from 'dotenv'
import { Usuario } from 'src/core/usuario/usuario.entity'
dotenv.config()
@Entity({
  name: 'historialIncidentes',
  schema: process.env.DB_SCHEMA_PROYECTO,
})
export class HistorialIncidentes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ type: 'timestamptz', nullable: false })
  fecha: Date

  @Column({ name: 'feacha_atencion', type: 'timestamptz', nullable: true })
  fechaAtencion: Date

  @Column({ length: 20, type: 'varchar' })
  estado: string

  /* @Column({ name: 'usuario_auditoria', length: 20, type: 'varchar' })
  usuarioAuditoria: string */
  @Column({
    name: 'usuario_auditoria',
    type: 'bigint',
    nullable: true,
  })
  idUsuarioAuditoria: string
  @ManyToOne(() => Usuario, (usuario) => usuario.historialIncidentes, {
    nullable: true,
  })
  @JoinColumn({
    name: 'usuario_auditoria',
    referencedColumnName: 'id',
  })
  usuarioAuditoria: Usuario

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string
  @ManyToOne(() => Alarma, (alarma) => alarma.historialIncidentes, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma

  @Column({
    name: 'id_sensor',
    type: 'bigint',
    nullable: true,
  })
  idSensor: string | null
  @ManyToOne(() => SensorActuador, (sensor) => sensor.historialIncidentes, {
    nullable: true,
  })
  @JoinColumn({
    name: 'id_sensor',
    referencedColumnName: 'id',
  })
  sensor: SensorActuador | null
  @OneToMany(() => Fotos, (foto) => foto.historialIncidente)
  fotos: Fotos[]

  constructor(data?: Partial<HistorialIncidentes>) {
    if (data) Object.assign(this, data)
  }
}
