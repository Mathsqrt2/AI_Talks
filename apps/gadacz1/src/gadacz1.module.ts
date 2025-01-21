import { Module } from '@nestjs/common';
import { Gadacz1Controller } from './gadacz1.controller';
import { Gadacz1Service } from './gadacz1.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true })]
  ,
  controllers: [Gadacz1Controller],
  providers: [Gadacz1Service],
})
export class Gadacz1Module { }
