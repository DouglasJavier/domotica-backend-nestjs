import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Ubicacion } from '../../ubicaciones/ubicaciones.entity';
import { SensorActuador } from './sensor_actuador.entity';
/* import { User } from './users.entity';
import { Cars } from './cars.entity'; */

@Entity({ name: 'dispositivos' })
export class Dispositivo {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 50, type: 'varchar' })
  nombre: string;

  @Column({ length: 50, type: 'varchar' })
  tipo: string;

  @Column({ length: 200, type: 'varchar', nullable: false })
  direccionLan: string;

  @Column({ length: 200, type: 'varchar', nullable: true })
  direccionWan: string;

  @Column({ length: 20, type: 'varchar' })
  estado: string;

  @Column({
    name: 'idUbicacion',
    type: 'bigint',
    nullable: false,
  })
  idUbicacion: string;
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.dispositivos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUbicacion',
    referencedColumnName: 'id',
  })
  ubicacion: Ubicacion;

  @OneToMany(
    () => SensorActuador,
    (sensorActuador) => sensorActuador.dispositivo,
  )
  sensoresActuadores: SensorActuador[];

  constructor(data?: Partial<Dispositivo>) {
    if (data) Object.assign(this, data);
  }
}
