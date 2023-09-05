import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SimuladorActuador } from './simulador_actuador.entity';

@Entity({ name: 'horarios' })
export class Horario {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  horaInicio: string;

  @Column({ type: 'timestamptz', nullable: false })
  horaFin: string;

  @Column({ length: 20, type: 'varchar' })
  estado: string;

  @Column({
    name: 'id_simulador_actuador',
    type: 'varchar',
  })
  idSimuladorActuador: string;
  @ManyToOne(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.horarios,
  )
  @JoinColumn({
    name: 'id_simulador_actuador',
    referencedColumnName: 'id',
  })
  simuladorActuador: SimuladorActuador;
}
