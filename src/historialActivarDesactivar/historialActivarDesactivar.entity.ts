import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Alarma } from '../alarma/alarmas.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Entity({ name: 'historialActivarDesactivar' })
export class HistorialActivarDesactivar {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  fecha: Date;

  @Column({ length: 50, type: 'varchar', nullable: false })
  accion: string;

  @Column({
    name: 'idAlarma',
    type: 'bigint',
    nullable: false,
  })
  idAlarma: string;
  @ManyToOne(() => Alarma, (alarma) => alarma.historialActivarDesactivar, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idAlarma',
    referencedColumnName: 'id',
  })
  alarma: Alarma;

  @Column({
    name: 'idUsuario',
    type: 'bigint',
    nullable: false,
  })
  idUsuario: string;
  @ManyToOne(() => Usuario, (usuario) => usuario.historialActivarDesactivar, {
    nullable: false,
  })
  @JoinColumn({
    name: 'idUsuario',
    referencedColumnName: 'id',
  })
  usuario: Usuario;
}
