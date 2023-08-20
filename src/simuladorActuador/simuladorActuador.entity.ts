import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Horarios } from '../horario/horario.entity';
import { Actuador } from '../actuador/actuador.entity';
import { Simulador } from '../simulador/simulador.entity';
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
  @ManyToOne(() => Actuador, (actuador) => actuador.simuladorActuador, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idActuador',
    referencedColumnName: 'id',
  })
  actuador: Actuador;

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
