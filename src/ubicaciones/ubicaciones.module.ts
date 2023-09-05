import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ubicacion } from './ubicaciones.entity';
import { UbicacionController } from './ubicaciones.controller';
import { UbicacionService } from './ubicaciones.service';
import { UbicacionRepository } from './ubicaciones.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ubicacion])],
  controllers: [UbicacionController],
  providers: [UbicacionService, UbicacionRepository],
  exports: [UbicacionService],
})
export class UbicacionModule {}
