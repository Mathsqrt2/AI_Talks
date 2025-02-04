import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';

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
        entities: [Log],
        synchronize: true,
      })
    }),
    TypeOrmModule.forFeature([Log]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})

export class DatabaseModule { }
