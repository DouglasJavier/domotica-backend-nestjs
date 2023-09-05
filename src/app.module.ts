import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmaModule } from './alarma/alarma.module';
import { ContactoModule } from './contactos/contactos.module';
import { DispositivoModule } from './dispositivos/dispositivo.module';
import { HistorialActivarDesactivarModule } from './historialActivarDesactivar/historialActivarDesactivar.module';
import { HistorialIncidentes } from './historialIncidentes/historialIncidentes.entity';
import { HistorialIncidentesModule } from './historialIncidentes/historialIncidentes.module';
import { SimuladorModule } from './simulador/simulador.module';
import { UbicacionModule } from './ubicaciones/ubicaciones.module';
import { UsuarioModule } from './usuario/usuario.module';
import { Alarma } from './alarma/entity/alarmas.entity';
import { AlarmaContacto } from './alarma/entity/alarmasContactos.entity';
import { Contacto } from './contactos/contactos.entity';
import { Dispositivo } from './dispositivos/entity/dispositivo.entity';
import { HistorialActivarDesactivar } from './historialActivarDesactivar/historialActivarDesactivar.entity';
import { SensorActuador } from './dispositivos/entity/sensor_actuador.entity';
import { Simulador } from './simulador/entity/simulador.entity';
import { SimuladorActuador } from './simulador/entity/simulador_actuador.entity';
import { Ubicacion } from './ubicaciones/ubicaciones.entity';
import { UbicacionAlarma } from './alarma/entity/ubicacionesAlarmas.entity';
import { Usuario } from './usuario/usuario.entity';
import { AlarmaController } from './alarma/controller/alarma.controller';
import { ContactoController } from './contactos/contactos.controller';
import { DispositivoController } from './dispositivos/controller/dispositivo.controller';
import { HistorialActivarDesactivarController } from './historialActivarDesactivar/historialActivarDesactivar.controller';
import { HistorialIncidentesController } from './historialIncidentes/historialIncidentes.controller';
import { SimuladorController } from './simulador/controller/simulador.controller';
import { UbicacionController } from './ubicaciones/ubicaciones.controller';
import { UsuarioController } from './usuario/usuario.controller';
import { Horario } from './simulador/entity/horario.entity';
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
      database: 'domotica_db',
      entities: [
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
