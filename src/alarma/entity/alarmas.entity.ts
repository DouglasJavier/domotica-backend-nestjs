import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Contacto } from '../../contactos/contactos.entity';
import { Ubicacion } from '../../ubicaciones/ubicaciones.entity';
import { Simulador } from '../../simulador/entity/simulador.entity';
import { AlarmaContacto } from './alarmasContactos.entity';
import { UbicacionAlarma } from '../../ubicacionesAlarmas/ubicacionesAlarmas.entity';
import { HistorialActivarDesactivar } from '../../historialActivarDesactivar/historialActivarDesactivar.entity';
import { HistorialIncidentes } from '../../historialIncidentes/historialIncidentes.entity';

@Entity({ name: 'alarma' })
export class Alarma {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 20, type: 'varchar' })
  estado: string;

  @Column({ length: 50, type: 'varchar', unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: false })
  sonido: boolean;

  @Column({ type: 'boolean', default: false })
  notificacion: boolean;

  @Column({ length: 50, type: 'varchar', unique: true })
  envio_noti: string;

  @Column({ length: 10, type: 'varchar', unique: true })
  tipo: string[];

  @OneToMany(() => AlarmaContacto, (alarmaContacto) => alarmaContacto.alarma)
  alarmaContactos: AlarmaContacto[];

  @OneToMany(() => UbicacionAlarma, (ubicacionAlarma) => ubicacionAlarma.alarma)
  ubicacionAlarmas: UbicacionAlarma[];

  @OneToMany(
    () => HistorialActivarDesactivar,
    (historialActivarDesactivar) => historialActivarDesactivar.alarma,
  )
  historialActivarDesactivar: HistorialActivarDesactivar[];

  @Column({
    name: 'idSimulador',
    type: 'bigint',
    nullable: false,
  })
  idSimulador: string;
  @OneToOne(() => Simulador, (simulador) => simulador.alarma, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idSimulador',
    referencedColumnName: 'id',
  })
  simulador: Simulador;

  @OneToMany(
    () => HistorialIncidentes,
    (historialIncidentes) => historialIncidentes.alarma,
  )
  historialIncidentes: HistorialIncidentes[];
}
