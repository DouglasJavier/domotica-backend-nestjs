import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialActivarDesactivar } from './historialActivarDesactivar.entity';
import { HistorialActivarDesactivarController } from './historialActivarDesactivar.controller';
import { HistorialActivarDesactivarService } from './historialActivarDesactivar.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialActivarDesactivar])],
  controllers: [HistorialActivarDesactivarController],
  providers: [HistorialActivarDesactivarService],
  exports: [HistorialActivarDesactivarService],
})
export class HistorialActivarDesactivarModule {}
