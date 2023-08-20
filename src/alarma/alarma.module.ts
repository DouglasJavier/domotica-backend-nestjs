import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarma } from './alarmas.entity';
import { AlarmaController } from './alarma.controller';
import { AlarmaService } from './alarma.service';
import { AlarmaRepository } from './alarma.repository';
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository';
import { AlarmaContactoRepository } from 'src/alarmasContactos/alarmasContactos.repository';
import { ubicacionAlarmaRepository } from 'src/ubicacionesAlarmas/ubicacionesAlarmas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Alarma])],
  controllers: [AlarmaController],
  providers: [
    AlarmaService,
    AlarmaRepository,
    HistorialActivarDesactivarRepository,
    AlarmaContactoRepository,
    ubicacionAlarmaRepository,
  ],
  exports: [AlarmaService],
})
export class AlarmaModule {}
