import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Ubicacion } from '../ubicaciones/ubicaciones.entity';
import { SimuladorActuador } from '../simuladorActuador/simuladorActuador.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'actuadores' })
export class Actuador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 5, type: 'varchar', nullable: false })
  pin: string;

  @Column({ length: 25, type: 'varchar', nullable: false })
  tipo: string;

  @Column({ length: 25, type: 'varchar', nullable: false })
  subUbicacion: string;

  @OneToMany(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.actuador,
  )
  simuladorActuador: SimuladorActuador[];

  @Column({
    name: 'idUbicacion',
    type: 'bigint',
    nullable: false,
  })
  idUbicacion: string;
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.actuadores, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUbicacion',
    referencedColumnName: 'id',
  })
  ubicacion: Ubicacion;
}
