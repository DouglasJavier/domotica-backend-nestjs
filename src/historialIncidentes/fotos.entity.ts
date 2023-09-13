import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Alarma } from '../alarma/entity/alarmas.entity';
import { SensorActuador } from 'src/dispositivos/entity/sensor_actuador.entity';
import { HistorialIncidentes } from './historialIncidentes.entity';

@Entity({ name: 'fotosIncidentes' })
export class Fotos {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'varchar' })
  foto: string;

  @Column({
    name: 'id_incidente',
    type: 'bigint',
    nullable: false,
  })
  idIncidente: string;
  @ManyToOne(() => HistorialIncidentes, (incidente) => incidente.fotos, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_incidente',
    referencedColumnName: 'id',
  })
  historialIncidente: HistorialIncidentes;
}
