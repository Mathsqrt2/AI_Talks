import { Module } from '@nestjs/common';
import { Gadacz2Controller } from './gadacz2.controller';
import { Gadacz2Service } from './gadacz2.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 600000,
      maxRedirects: 128
    }),
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [Gadacz2Controller],
  providers: [Gadacz2Service],
})
export class Gadacz2Module { }
