import { HistorialActivarDesactivar } from 'src/historialActivarDesactivar/historialActivarDesactivar.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import * as dotenv from 'dotenv'
import { HistorialIncidentes } from 'src/historialIncidentes/historialIncidentes.entity'
dotenv.config()

@Entity({ name: 'usuario', schema: process.env.DB_SCHEMA_USUARIOS })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 60, type: 'varchar' })
  nombres: string

  @Column({ length: 60, type: 'varchar' })
  apellidos: string

  @Column({ length: 60, type: 'varchar' })
  usuario: string

  @Column({ length: 120, type: 'varchar' })
  contrasenia: string

  @Column({ length: 50, type: 'varchar' })
  estado: string

  @Column({ length: 60, type: 'varchar' })
  rol: string

  @Column({ type: 'integer', default: 0 })
  intentos: number

  @OneToMany(
    () => HistorialActivarDesactivar,
    (historialActivarDesactivar) => historialActivarDesactivar.usuario
  )
  historialActivarDesactivar: HistorialActivarDesactivar[]

  @OneToMany(
    () => HistorialIncidentes,
    (historialIncidentes) => historialIncidentes.usuarioAuditoria
  )
  historialIncidentes: HistorialIncidentes[]

  constructor(data?: Partial<Usuario>) {
    if (data) Object.assign(this, data)
  }
}
