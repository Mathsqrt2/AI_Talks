import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from './entities';
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
        entities: Object.values(Entities),
        synchronize: false,
      })
    }),
    TypeOrmModule.forFeature(Object.values(Entities))
  ],
  exports: [
    TypeOrmModule.forFeature(Object.values(Entities))
  ]
})

export class DatabaseModule { }