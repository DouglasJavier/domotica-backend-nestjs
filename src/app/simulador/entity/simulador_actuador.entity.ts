import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Horario } from './horario.entity'
import { Simulador } from './simulador.entity'
import { SensorActuador } from 'src/app/dispositivos/entity/sensor_actuador.entity'
import * as dotenv from 'dotenv'
dotenv.config()

@Entity({ name: 'simulador_actuador', schema: process.env.DB_SCHEMA_PROYECTO })
export class SimuladorActuador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @OneToMany(() => Horario, (horario) => horario.simuladorActuador)
  horarios: Horario[]

  @Column({
    name: 'id_actuador',
    type: 'bigint',
    nullable: false,
  })
  idActuador: string
  @ManyToOne(() => SensorActuador, (actuador) => actuador.simuladorActuador, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_actuador',
    referencedColumnName: 'id',
  })
  actuador: SensorActuador

  @Column({ length: 50, type: 'varchar' })
  estado: string

  @Column({
    name: 'id_simulador',
    type: 'bigint',
    nullable: false,
  })
  idSimulador: string
  @ManyToOne(() => Simulador, (simulador) => simulador.simuladoresActuadores, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_simulador',
    referencedColumnName: 'id',
  })
  simulador: Simulador
}
