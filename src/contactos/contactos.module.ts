import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './contactos.entity';
import { ContactoController } from './contactos.controller';
import { ContactoService } from './contactos.service';
import { ContactoRepository } from './contactos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactoController],
  providers: [ContactoService, ContactoRepository],
  exports: [ContactoService],
})
export class ContactoModule {}
