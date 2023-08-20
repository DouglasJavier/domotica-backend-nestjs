import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SimuladorActuador } from '../simuladorActuador/simuladorActuador.entity';
import { Alarma } from '../alarma/alarmas.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'simuladores' })
export class Simulador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 50, type: 'varchar' })
  nombre: string;

  @Column({ length: 50, type: 'varchar' })
  estado: string;

  @OneToMany(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.simulador,
  )
  simuladorActuador: SimuladorActuador[];

  @OneToOne(() => Alarma, (alarma) => alarma.simulador)
  alarma: Alarma;
}
