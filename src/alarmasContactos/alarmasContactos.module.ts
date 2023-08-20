import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmaContacto } from './alarmasContactos.entity';
import { AlarmaContactoController } from './alarmasContactos.controller';
import { AlarmaContactoService } from './alarmasContactos.service';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmaContacto])],
  controllers: [AlarmaContactoController],
  providers: [AlarmaContactoService],
  exports: [AlarmaContactoService],
})
export class AlarmaContactoModule {}
