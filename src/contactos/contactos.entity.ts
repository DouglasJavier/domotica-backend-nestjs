import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { AlarmaContacto } from '../alarma/entity/alarmasContactos.entity'
import * as dotenv from 'dotenv'
dotenv.config()

@Entity({ name: 'contactos', schema: process.env.DB_SCHEMA_PROYECTO })
export class Contacto {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar' })
  nombre: string

  @Column({ length: 50, type: 'varchar' })
  apellido: string

  @Column({ length: 50, type: 'varchar', unique: true })
  numeroTel1: string

  @Column({ length: 50, type: 'varchar', unique: true, nullable: true })
  numeroTel2: string

  @Column({ length: 50, type: 'varchar' })
  estado: string

  @OneToMany(() => AlarmaContacto, (alarmaContacto) => alarmaContacto.contacto)
  alarmaContactos: AlarmaContacto[]

  constructor(data?: Partial<Contacto>) {
    if (data) Object.assign(this, data)
  }
}
