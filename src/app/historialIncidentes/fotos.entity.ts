import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { HistorialIncidentes } from './historialIncidentes.entity'
import * as dotenv from 'dotenv'
dotenv.config()
@Entity({ name: 'fotosIncidentes', schema: process.env.DB_SCHEMA_PROYECTO })
export class Fotos {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ type: 'varchar' })
  foto: string

  @Column({
    name: 'id_incidente',
    type: 'bigint',
    nullable: false,
  })
  idIncidente: string
  @ManyToOne(() => HistorialIncidentes, (incidente) => incidente.fotos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_incidente',
    referencedColumnName: 'id',
  })
  historialIncidente: HistorialIncidentes
}
