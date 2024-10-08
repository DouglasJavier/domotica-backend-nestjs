import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false, // Opciones adicionales para evitar errores de certificado, pero no se recomienda para producción
  },
})

export default AppDataSource
