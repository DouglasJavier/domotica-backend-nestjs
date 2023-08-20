import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AlarmaContacto } from '../alarmasContactos/alarmasContactos.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'contactos' })
export class Contacto {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 50, type: 'varchar' })
  nombre: string;

  @Column({ length: 50, type: 'varchar' })
  apellido: string;

  @Column({ length: 50, type: 'varchar', unique: true })
  numeroTel1: string;

  @Column({ length: 50, type: 'varchar', unique: true, nullable: true })
  numeroTel2: string;

  @OneToMany(() => AlarmaContacto, (alarmaContacto) => alarmaContacto.contacto)
  alarmaContactos: AlarmaContacto[];
}
