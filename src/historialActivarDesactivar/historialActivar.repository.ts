import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class HistorialActivarRepository {
  constructor(private dataSource: DataSource) {}
}
