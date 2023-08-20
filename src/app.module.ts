import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActuadorModule } from './actuador/actuador.module';
import { AlarmaModule } from './alarma/alarma.module';
import { AlarmaContactoModule } from './alarmasContactos/alarmasContactos.module';
import { ContactoModule } from './contactos/contactos.module';
import { DispositivoModule } from './dispositivos/dispositivo.module';
import { HistorialActivarDesactivarModule } from './historialActivarDesactivar/historialActivarDesactivar.module';
import { HistorialIncidentes } from './historialIncidentes/historialIncidentes.entity';
import { HistorialIncidentesModule } from './historialIncidentes/historialIncidentes.module';
import { HorariosModule } from './horario/horario.module';
import { SensorModule } from './sensor/sensor.module';
import { SimuladorModule } from './simulador/simulador.module';
import { SimuladorActuadorModule } from './simuladorActuador/simuladorActuador.module';
import { UbicacionModule } from './ubicaciones/ubicaciones.module';
import { UbicacionAlarmaModule } from './ubicacionesAlarmas/ubicacionesAlarmas.module';
import { UsuarioModule } from './usuario/usuario.module';
import { Actuador } from './actuador/actuador.entity';
import { Alarma } from './alarma/alarmas.entity';
import { AlarmaContacto } from './alarmasContactos/alarmasContactos.entity';
import { Contacto } from './contactos/contactos.entity';
import { Dispositivo } from './dispositivos/dispositivo.entity';
import { HistorialActivarDesactivar } from './historialActivarDesactivar/historialActivarDesactivar.entity';
import { Horarios } from './horario/horario.entity';
import { Sensor } from './sensor/sensor.entity';
import { Simulador } from './simulador/simulador.entity';
import { SimuladorActuador } from './simuladorActuador/simuladorActuador.entity';
import { Ubicacion } from './ubicaciones/ubicaciones.entity';
import { UbicacionAlarma } from './ubicacionesAlarmas/ubicacionesAlarmas.entity';
import { Usuario } from './usuario/usuario.entity';
import { ActuadorController } from './actuador/actuador.controller';
import { AlarmaController } from './alarma/alarma.controller';
import { AlarmaContactoController } from './alarmasContactos/alarmasContactos.controller';
import { ContactoController } from './contactos/contactos.controller';
import { DispositivoController } from './dispositivos/dispositivo.controller';
import { HistorialActivarDesactivarController } from './historialActivarDesactivar/historialActivarDesactivar.controller';
import { HistorialIncidentesController } from './historialIncidentes/historialIncidentes.controller';
import { HorariosController } from './horario/horario.controller';
import { SensorController } from './sensor/sensor.controller';
import { SimuladorController } from './simulador/simulador.controller';
import { SimuladorActuadorController } from './simuladorActuador/simuladorActuador.controller';
import { UbicacionController } from './ubicaciones/ubicaciones.controller';
import { UbicacionAlarmaController } from './ubicacionesAlarmas/ubicacionesAlarmas.controller';
import { UsuarioController } from './usuario/usuario.controller';
/* import { UsersService } from './users/users.service';
import { CarsService } from './cars/cars.service';
 */
@Module({
  // exports: [UsersService, CarsService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'domoticadb',
      entities: [
        Actuador,
        Alarma,
        AlarmaContacto,
        Contacto,
        Dispositivo,
        HistorialActivarDesactivar,
        HistorialIncidentes,
        Horarios,
        Sensor,
        Simulador,
        SimuladorActuador,
        Ubicacion,
        UbicacionAlarma,
        Usuario,
      ],
      synchronize: true,
      //logging: true,
    }),
    ActuadorModule,
    AlarmaModule,
    AlarmaContactoModule,
    ContactoModule,
    DispositivoModule,
    HistorialActivarDesactivarModule,
    HistorialIncidentesModule,
    HorariosModule,
    SensorModule,
    SimuladorModule,
    SimuladorActuadorModule,
    UbicacionModule,
    UbicacionAlarmaModule,
    UsuarioModule,
  ],
  controllers: [
    AppController,
    ActuadorController,
    AlarmaController,
    AlarmaContactoController,
    ContactoController,
    DispositivoController,
    HistorialActivarDesactivarController,
    HistorialIncidentesController,
    HorariosController,
    SensorController,
    SimuladorController,
    SimuladorActuadorController,
    UbicacionController,
    UbicacionAlarmaController,
    UsuarioController,
  ],
  providers: [AppService],
})
export class AppModule {}
