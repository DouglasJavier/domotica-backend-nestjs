import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Alarma } from '../alarma/entity/alarmas.entity'
import { Usuario } from 'src/core/usuario/usuario.entity'
import * as dotenv from 'dotenv'
dotenv.config()
@Entity({
  name: 'historialActivarDesactivar',
  schema: process.env.DB_SCHEMA_PROYECTO,
})
export class HistorialActivarDesactivar {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ type: 'timestamptz', nullable: false })
  fecha: Date

  @Column({ length: 50, type: 'varchar', nullable: false })
  accion: string

  @Column({ length: 20, type: 'varchar' })
  estado: string

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string
  @ManyToOne(() => Alarma, (alarma) => alarma.historialActivarDesactivar, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma

  @Column({
    name: 'idUsuario',
    type: 'bigint',
    nullable: false,
  })
  idUsuario: string
  @ManyToOne(() => Usuario, (usuario) => usuario.historialActivarDesactivar, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUsuario',
    referencedColumnName: 'id',
  })
  usuario: Usuario
}
