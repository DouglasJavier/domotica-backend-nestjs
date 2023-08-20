import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Contacto } from './contactos.entity';

@Injectable()
export class ContactoRepository {
  constructor(private dataSource: DataSource) {}
}
