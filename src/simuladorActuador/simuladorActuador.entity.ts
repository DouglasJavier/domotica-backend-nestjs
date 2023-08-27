import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Horarios } from '../horario/horario.entity';
import { Simulador } from '../simulador/simulador.entity';
import { SensorActuador } from 'src/dispositivos/entity/sensor_actuador.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'SimuladorActuador' })
export class SimuladorActuador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @OneToMany(() => Horarios, (horarios) => horarios.simuladorActuador)
  horarios: Horarios[];

  @Column({
    name: 'idActuador',
    type: 'bigint',
    nullable: false,
  })
  idActuador: string;
  @ManyToOne(() => SensorActuador, (actuador) => actuador.simuladorActuador, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idActuador',
    referencedColumnName: 'id',
  })
  actuador: SensorActuador;

  @Column({
    name: 'idSimulador',
    type: 'bigint',
    nullable: false,
  })
  idSimulador: string;
  @ManyToOne(() => Simulador, (simulador) => simulador.simuladorActuador, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idSimulador',
    referencedColumnName: 'id',
  })
  simulador: Simulador;
}
