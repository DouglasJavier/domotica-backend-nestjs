import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarController } from './historialActivarDesactivar.controller';
import { HistorialActivarDesactivarService } from './historialActivarDesactivar.service';
import { HistorialActivarDesactivarRepository } from './historialActivarDesactivar.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialActivarDesactivar])],
  controllers: [HistorialActivarDesactivarController],
  providers: [
    HistorialActivarDesactivarService,
    HistorialActivarDesactivarRepository,
  ],
  exports: [HistorialActivarDesactivarService],
})
export class HistorialActivarDesactivarModule {}
