import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarma } from './entity/alarmas.entity';
import { AlarmaController } from './controller/alarma.controller';
import { AlarmaService } from './service/alarma.service';
import { AlarmaRepository } from './repository/alarma.repository';
import { HistorialActivarDesactivarRepository } from 'src/historialActivarDesactivar/historialActivarDesactivar.repository';
import { AlarmaContactoRepository } from 'src/alarma/repository/alarmasContactos.repository';
import { ubicacionAlarmaRepository } from './repository/ubicacionAlarma.repository';

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
