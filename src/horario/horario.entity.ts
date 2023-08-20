import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SimuladorActuador } from '../simuladorActuador/simuladorActuador.entity';

@Entity({ name: 'horarios' })
export class Horarios {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  horaInicio: Date;

  @Column({ type: 'timestamptz', nullable: false })
  horaFin: Date;

  @Column({
    name: 'idSimuladorActuador',
    type: 'bigint',
    nullable: false,
  })
  idSimuladorActuador: string;
  @ManyToOne(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.horarios,
    {
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'idSimuladorActuador',
    referencedColumnName: 'id',
  })
  simuladorActuador: SimuladorActuador;
}
