import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Ubicacion } from '../../ubicaciones/ubicaciones.entity';
import { SimuladorActuador } from 'src/simuladorActuador/simuladorActuador.entity';

@Entity({ name: 'sensores' })
export class SensorActuador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 5, type: 'varchar', nullable: false })
  pin: string;

  @Column({ length: 25, type: 'varchar', nullable: false })
  tipo: string;

  @Column({ type: 'varchar' })
  descripcion: string;

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

  @OneToMany(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.actuador,
  )
  simuladorActuador: SimuladorActuador[];
}
