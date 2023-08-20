import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Alarma } from '../alarma/alarmas.entity';
import { Contacto } from '../contactos/contactos.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'alarmasContactos' })
export class AlarmaContacto {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 20, type: 'varchar', unique: true })
  estado: string;

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string;
  @ManyToOne(() => Alarma, (alarma) => alarma.alarmaContactos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma;

  @Column({
    name: 'idContacto',
    type: 'bigint',
    nullable: false,
  })
  idContacto: string;
  @ManyToOne(() => Contacto, (contacto) => contacto.alarmaContactos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idContacto',
    referencedColumnName: 'id',
  })
  contacto: Contacto;
}
