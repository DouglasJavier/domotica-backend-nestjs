import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Alarma } from '../alarma/alarmas.entity';

@Entity({ name: 'historialIncidentes' })
export class HistorialIncidentes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  fecha: Date;

  @Column({ length: 50, type: 'varchar', nullable: false })
  detalles: string;

  @Column('varchar', { array: true, nullable: true })
  fotos: string[];

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string;
  @ManyToOne(() => Alarma, (alarma) => alarma.historialIncidentes, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma;
}
