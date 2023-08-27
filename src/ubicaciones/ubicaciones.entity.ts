import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { SensorActuador } from '../dispositivos/entity/sensor_actuador.entity';
import { UbicacionAlarma } from '../ubicacionesAlarmas/ubicacionesAlarmas.entity';
import { Dispositivo } from '../dispositivos/entity/dispositivo.entity';

@Entity({ name: 'ubicaciones' })
export class Ubicacion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 50, type: 'varchar' })
  nombre: string;

  @Column({ length: 20, type: 'varchar' })
  estado: string;

  @OneToMany(() => SensorActuador, (sensor) => sensor.ubicacion)
  sensores: SensorActuador[];

  @OneToMany(
    () => UbicacionAlarma,
    (ubicacionAlarma) => ubicacionAlarma.ubicacion,
  )
  ubicacionesAlarmas: UbicacionAlarma[];

  @OneToMany(() => Dispositivo, (dispositivo) => dispositivo.ubicacion)
  dispositivos: Dispositivo[];

  constructor(data?: Partial<Ubicacion>) {
    if (data) Object.assign(this, data);
  }
}
