import { Test, TestingModule } from '@nestjs/testing';
import { Gadacz2Controller } from './gadacz2.controller';
import { Gadacz2Service } from './gadacz2.service';

describe('Gadacz2Controller', () => {
  let gadacz2Controller: Gadacz2Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Gadacz2Controller],
      providers: [Gadacz2Service],
    }).compile();

    gadacz2Controller = app.get<Gadacz2Controller>(Gadacz2Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gadacz2Controller.getHello()).toBe('Hello World!');
    });
  });
});
