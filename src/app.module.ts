import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlarmaModule } from './app/alarma/alarma.module'
import { ContactoModule } from './app/contactos/contactos.module'
import { DispositivoModule } from './app/dispositivos/dispositivo.module'
import { HistorialActivarDesactivarModule } from './app/historialActivarDesactivar/historialActivarDesactivar.module'
import { HistorialIncidentes } from './app/historialIncidentes/historialIncidentes.entity'
import { HistorialIncidentesModule } from './app/historialIncidentes/historialIncidentes.module'
import { SimuladorModule } from './app/simulador/simulador.module'
import { UbicacionModule } from './app/ubicaciones/ubicaciones.module'
import { UsuarioModule } from './core/usuario/usuario.module'
import { Alarma } from './app/alarma/entity/alarmas.entity'
import { AlarmaContacto } from './app/alarma/entity/alarmasContactos.entity'
import { Contacto } from './app/contactos/contactos.entity'
import { Dispositivo } from './app/dispositivos/entity/dispositivo.entity'
import { HistorialActivarDesactivar } from './app/historialActivarDesactivar/historialActivarDesactivar.entity'
import { SensorActuador } from './app/dispositivos/entity/sensor_actuador.entity'
import { Simulador } from './app/simulador/entity/simulador.entity'
import { SimuladorActuador } from './app/simulador/entity/simulador_actuador.entity'
import { Ubicacion } from './app/ubicaciones/ubicaciones.entity'
import { UbicacionAlarma } from './app/alarma/entity/ubicacionesAlarmas.entity'
import { Usuario } from './core/usuario/usuario.entity'
import { AlarmaController } from './app/alarma/controller/alarma.controller'
import { ContactoController } from './app/contactos/contactos.controller'
import { DispositivoController } from './app/dispositivos/controller/dispositivo.controller'
import { HistorialActivarDesactivarController } from './app/historialActivarDesactivar/historialActivarDesactivar.controller'
import { HistorialIncidentesController } from './app/historialIncidentes/historialIncidentes.controller'
import { SimuladorController } from './app/simulador/controller/simulador.controller'
import { UbicacionController } from './app/ubicaciones/ubicaciones.controller'
import { UsuarioController } from './core/usuario/usuario.controller'
import { Horario } from './app/simulador/entity/horario.entity'
import { Fotos } from './app/historialIncidentes/fotos.entity'
import { TaskSimuladorModule } from './app/tasks/taskSimulador.module'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './core/authentication/authentication.module'
import { AuthorizationModule } from './core/authorization/authorization.module'
import { AuthorizationConfigModule } from './core/config/authorization/authorization.module'
import { CasbinRule } from './core/authorization/entity/casbin.entity'
/* import { UsersService } from './users/users.service';
import { CarsService } from './cars/cars.service';
 */
import * as dotenv from 'dotenv'
dotenv.config()
@Module({
  // exports: [UsersService, CarsService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        CasbinRule,
        Alarma,
        AlarmaContacto,
        Contacto,
        Dispositivo,
        HistorialActivarDesactivar,
        HistorialIncidentes,
        SensorActuador,
        Simulador,
        SimuladorActuador,
        Ubicacion,
        UbicacionAlarma,
        Usuario,
        Horario,
        Fotos,
      ],
      synchronize: true,
      //logging: true,
    }),
    AlarmaModule,
    ContactoModule,
    DispositivoModule,
    HistorialActivarDesactivarModule,
    HistorialIncidentesModule,
    SimuladorModule,
    UbicacionModule,
    UsuarioModule,
    TaskSimuladorModule,
    AuthModule,
    AuthorizationModule,
    AuthorizationConfigModule,
  ],
  controllers: [
    AppController,
    AlarmaController,
    ContactoController,
    DispositivoController,
    HistorialActivarDesactivarController,
    HistorialIncidentesController,
    SimuladorController,
    UbicacionController,
    UsuarioController,
  ],
  providers: [AppService],
})
export class AppModule {}
