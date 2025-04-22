import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './database.entities';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: `mysql`,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities,
        synchronize: true,
      })
    }),
    TypeOrmModule.forFeature(entities)
  ]
})

export class DatabaseModule { }