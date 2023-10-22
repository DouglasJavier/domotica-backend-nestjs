import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Contacto } from '../../contactos/contactos.entity';
import { Ubicacion } from '../../ubicaciones/ubicaciones.entity';
import { Simulador } from '../../simulador/entity/simulador.entity';
import { AlarmaContacto } from './alarmasContactos.entity';
import { UbicacionAlarma } from './ubicacionesAlarmas.entity';
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

  @Column({ length: 50, type: 'varchar' })
  envio_noti: string;

  @Column({ name: 'seguridad_personas', type: 'boolean', default: false })
  seguridadPersonas: boolean;

  @Column({ name: 'seguridad_bienes', type: 'boolean', default: false })
  seguridadBienes: boolean;

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
    name: 'id_simulador',
    type: 'bigint',
    nullable: true,
  })
  idSimulador: string;
  @ManyToOne(() => Simulador, (simulador) => simulador.alarmas, {
    nullable: true,
  })
  @JoinColumn({
    name: 'id_simulador',
    referencedColumnName: 'id',
  })
  simulador: Simulador;

  @OneToMany(
    () => HistorialIncidentes,
    (historialIncidentes) => historialIncidentes.alarma,
  )
  historialIncidentes: HistorialIncidentes[];

  constructor(data?: Partial<Alarma>) {
    if (data) Object.assign(this, data);
  }
}
