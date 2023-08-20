import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ubicacion } from '../ubicaciones/ubicaciones.entity';

@Entity({ name: 'sensores' })
export class Sensor {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 5, type: 'varchar', nullable: false })
  pin: string;

  @Column({ length: 25, type: 'varchar', nullable: false })
  tipo: string;

  @Column({ length: 25, type: 'varchar', nullable: false })
  subUbicacion: string;

  @Column({
    name: 'idUbicacion',
    type: 'bigint',
    nullable: false,
  })
  idUbicacion: string;
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.sensores, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUbicacion',
    referencedColumnName: 'id',
  })
  ubicacion: Ubicacion;
}
