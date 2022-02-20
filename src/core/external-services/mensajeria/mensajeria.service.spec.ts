import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { MensajeriaService } from './mensajeria.service';
import { of } from 'rxjs';

const resSendEmail: AxiosResponse = {
  data: {
    finalizado: true,
    datos: {
      id: '6008588c123718082c2061b8',
    },
  },
  headers: {},
  status: 201,
  statusText: '',
  config: {},
};

const resGetReportEmail: AxiosResponse = {
  data: {
    finalizado: true,
    datos: {
      id_notificacion: '6008588c123718082c2061b8',
    },
  },
  headers: {},
  status: 200,
  statusText: '',
  config: {},
};

describe('MensajeriaService', () => {
  let service: MensajeriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajeriaService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of(resGetReportEmail)),
            post: jest.fn(() => of(resSendEmail)),
          },
        },
      ],
    }).compile();

    service = module.get<MensajeriaService>(MensajeriaService);
  });

  it('[sendSms] deberia enviar un sms.', async () => {
    const response = await service.sendSms('77777777', 'sms fake');
    expect(response).toHaveProperty('finalizado');
    expect(response.finalizado).toBe(true);
  });

  it('[sendEmail] deberia enviar un correo.', async () => {
    const response = await service.sendEmail(
      'fake@fake.bo',
      'asunto',
      'contenido',
    );
    expect(response).toHaveProperty('finalizado');
    expect(response.finalizado).toBe(true);
  });

  it('[getReportSms] deberia obtener el reporte de un sms.', async () => {
    const response = await service.getReportSms('111111111111');
    expect(response).toHaveProperty('finalizado');
    expect(response.finalizado).toBe(true);
  });

  it('[getReportEmail] deberia obtener el reporte de un correo.', async () => {
    const response = await service.getReportEmail('22222222222');
    expect(response).toHaveProperty('finalizado');
    expect(response.finalizado).toBe(true);
  });
});
