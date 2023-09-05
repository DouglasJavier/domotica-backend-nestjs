import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Ubicacion } from '../../ubicaciones/ubicaciones.entity';
import { Alarma } from './alarmas.entity';

@Entity({ name: 'ubicacionesAlarmas' })
export class UbicacionAlarma {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 20, type: 'varchar', unique: true })
  estado: string;

  @Column({
    name: 'idUbicacion',
    type: 'bigint',
    nullable: false,
  })
  idUbicacion: string;
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.ubicacionesAlarmas, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUbicacion',
    referencedColumnName: 'id',
  })
  ubicacion: Ubicacion;

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string;
  @ManyToOne(() => Alarma, (alarma) => alarma.ubicacionAlarmas, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma;
}
