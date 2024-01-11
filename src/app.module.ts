import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlarmaModule } from './alarma/alarma.module'
import { ContactoModule } from './contactos/contactos.module'
import { DispositivoModule } from './dispositivos/dispositivo.module'
import { HistorialActivarDesactivarModule } from './historialActivarDesactivar/historialActivarDesactivar.module'
import { HistorialIncidentes } from './historialIncidentes/historialIncidentes.entity'
import { HistorialIncidentesModule } from './historialIncidentes/historialIncidentes.module'
import { SimuladorModule } from './simulador/simulador.module'
import { UbicacionModule } from './ubicaciones/ubicaciones.module'
import { UsuarioModule } from './core/usuario/usuario.module'
import { Alarma } from './alarma/entity/alarmas.entity'
import { AlarmaContacto } from './alarma/entity/alarmasContactos.entity'
import { Contacto } from './contactos/contactos.entity'
import { Dispositivo } from './dispositivos/entity/dispositivo.entity'
import { HistorialActivarDesactivar } from './historialActivarDesactivar/historialActivarDesactivar.entity'
import { SensorActuador } from './dispositivos/entity/sensor_actuador.entity'
import { Simulador } from './simulador/entity/simulador.entity'
import { SimuladorActuador } from './simulador/entity/simulador_actuador.entity'
import { Ubicacion } from './ubicaciones/ubicaciones.entity'
import { UbicacionAlarma } from './alarma/entity/ubicacionesAlarmas.entity'
import { Usuario } from './core/usuario/usuario.entity'
import { AlarmaController } from './alarma/controller/alarma.controller'
import { ContactoController } from './contactos/contactos.controller'
import { DispositivoController } from './dispositivos/controller/dispositivo.controller'
import { HistorialActivarDesactivarController } from './historialActivarDesactivar/historialActivarDesactivar.controller'
import { HistorialIncidentesController } from './historialIncidentes/historialIncidentes.controller'
import { SimuladorController } from './simulador/controller/simulador.controller'
import { UbicacionController } from './ubicaciones/ubicaciones.controller'
import { UsuarioController } from './core/usuario/usuario.controller'
import { Horario } from './simulador/entity/horario.entity'
import { Fotos } from './historialIncidentes/fotos.entity'
import { TaskSimuladorModule } from './tasks/taskSimulador.module'
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
