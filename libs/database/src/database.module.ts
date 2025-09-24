import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import * as Entities from './entities';

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
        synchronize: true,
      })
    }),
    TypeOrmModule.forFeature(Object.values(Entities))
  ],
  exports: [
    TypeOrmModule.forFeature(Object.values(Entities))
  ]
})

export class DatabaseModule { }