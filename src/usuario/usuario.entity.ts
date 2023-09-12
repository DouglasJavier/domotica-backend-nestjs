import { HistorialActivarDesactivar } from 'src/historialActivarDesactivar/historialActivarDesactivar.entity';
import { HistorialIncidentes } from 'src/historialIncidentes/historialIncidentes.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ length: 60, type: 'varchar' })
  nombres: string;

  @Column({ length: 60, type: 'varchar' })
  apellidos: string;

  @Column({ length: 60, type: 'varchar' })
  usuario: string;

  @Column({ length: 60, type: 'varchar' })
  contrasenia: string;

  @Column({ length: 50, type: 'varchar' })
  estado: string;

  @Column({ length: 60, type: 'varchar' })
  rol: string;

  @OneToMany(
    () => HistorialActivarDesactivar,
    (historialActivarDesactivar) => historialActivarDesactivar.usuario,
  )
  historialActivarDesactivar: HistorialActivarDesactivar[];

  constructor(data?: Partial<Usuario>) {
    if (data) Object.assign(this, data);
  }
}
