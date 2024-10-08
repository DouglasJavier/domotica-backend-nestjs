import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { SimuladorActuador } from 'src/app/simulador/entity/simulador_actuador.entity'
import { Dispositivo } from './dispositivo.entity'
import { HistorialIncidentes } from 'src/app/historialIncidentes/historialIncidentes.entity'
import * as dotenv from 'dotenv'
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones.entity'
dotenv.config()
@Entity({
  name: 'sensores_actuadores',
  schema: process.env.DB_SCHEMA_PROYECTO,
})
export class SensorActuador {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 5, type: 'varchar', nullable: false })
  pin: string

  @Column({ length: 25, type: 'varchar', nullable: false })
  tipo: string

  @Column({ type: 'varchar' })
  descripcion: string

  @Column({ name: 'tipo_salida', length: 10, type: 'varchar', nullable: false })
  tipoSalida: string

  @Column({
    name: 'id_ubicacion',
    type: 'bigint',
    nullable: false,
  })
  idUbicacion: string
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.sensores, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_ubicacion',
    referencedColumnName: 'id',
  })
  ubicacion: Ubicacion

  @Column({ length: 20, type: 'varchar' })
  estado: string

  @Column({
    name: 'id_dispositivo',
    type: 'bigint',
    nullable: false,
  })
  idDispositivo: string
  @ManyToOne(
    () => Dispositivo,
    (dispositivo) => dispositivo.sensoresActuadores,
    {
      nullable: false,
    }
  )
  @JoinColumn({
    name: 'id_dispositivo',
    referencedColumnName: 'id',
  })
  dispositivo: Dispositivo

  @OneToMany(
    () => SimuladorActuador,
    (simuladorActuador) => simuladorActuador.actuador
  )
  simuladorActuador: SimuladorActuador[]

  @OneToMany(
    () => HistorialIncidentes,
    (historialIncidentes) => historialIncidentes.sensor
  )
  historialIncidentes: HistorialIncidentes[]
}
