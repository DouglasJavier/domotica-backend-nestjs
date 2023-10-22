import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SimuladorActuador } from './simulador_actuador.entity';
import { Alarma } from '../../alarma/entity/alarmas.entity';
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
  simuladoresActuadores: SimuladorActuador[];

  @OneToMany(() => Alarma, (alarma) => alarma.simulador)
  alarmas: Alarma;
  constructor(data?: Partial<Simulador>) {
    if (data) Object.assign(this, data);
  }
}
