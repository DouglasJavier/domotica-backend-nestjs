import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { SimuladorActuador } from './simulador_actuador.entity'
import { Alarma } from '../../alarma/entity/alarmas.entity'
import * as dotenv from 'dotenv'
dotenv.config()

@Entity({ name: 'simuladores', schema: process.env.DB_SCHEMA_PROYECTOS })
export class Simulador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar' })
  nombre: string

  @Column({ length: 50, type: 'varchar' })
  estado: string

  @OneToMany(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.simulador
  )
  simuladoresActuadores: SimuladorActuador[]

  @OneToMany(() => Alarma, (alarma) => alarma.simulador)
  alarmas: Alarma
  constructor(data?: Partial<Simulador>) {
    if (data) Object.assign(this, data)
  }
}
