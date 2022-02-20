import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Response } from 'express';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';

describe('App controller', () => {
  let controller: AppController;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot(), ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('[listar] Deberia devolver el status', async () => {
    const res = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      status: function (_responseStatus) {
        return this;
      },
      json: function (valor) {
        return valor;
      },
    } as Response;
    const result = await controller.verificarEstado(res);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('estado');
    expect(result).toHaveProperty('hora');
    expect(result).toHaveProperty('commit_sha');
  });
});
