import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionAlarma } from './ubicacionesAlarmas.entity';
import { UbicacionAlarmaController } from './ubicacionesAlarmas.controller';
import { UbicacionAlarmaService } from './ubicacionesAlarmas.service';

@Module({
  imports: [TypeOrmModule.forFeature([UbicacionAlarma])],
  controllers: [UbicacionAlarmaController],
  providers: [UbicacionAlarmaService],
  exports: [UbicacionAlarmaService],
})
export class UbicacionAlarmaModule {}
