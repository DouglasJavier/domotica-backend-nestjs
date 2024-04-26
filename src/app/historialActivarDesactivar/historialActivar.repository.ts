import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class HistorialActivarRepository {
  constructor(private dataSource: DataSource) {}
}
