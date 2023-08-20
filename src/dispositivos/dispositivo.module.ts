import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispositivo } from './dispositivo.entity';
import { DispositivoController } from './dispositivo.controller';
import { DispositivoService } from './dispositivo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dispositivo])],
  controllers: [DispositivoController],
  providers: [DispositivoService],
  exports: [DispositivoService],
})
export class DispositivoModule {}
