import { Module } from '@nestjs/common';
import { Gadacz2Controller } from './gadacz2.controller';
import { Gadacz2Service } from './gadacz2.service';

@Module({
  imports: [],
  controllers: [Gadacz2Controller],
  providers: [Gadacz2Service],
})
export class Gadacz2Module {}
