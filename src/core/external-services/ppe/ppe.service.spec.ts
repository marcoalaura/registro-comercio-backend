import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { PpeService } from './ppe.service';
import { of } from 'rxjs';
import { PagoDTO } from './ppe.dto';

const datosPago: PagoDTO = {
  descripcion: 'Hola como estas yo pago esto',
  datosPago: {
    nombresCliente: 'JUAN',
    apellidosCliente: 'PEREZ MENDOZA',
    numeroDocumentoCliente: '123456',
    fechaNacimientoCliente: '1983-04-11',
    montoTotal: 100,
    moneda: 'BOB',
    tipoCambioMoneda: 1,
    cuentaBancaria: '111000034567'
  },
  facturacion: {
    razonSocialCliente: '123123123',
    nitCliente: '12312321',
    emailCliente: 'juan@outlook.com',
  },
  productos: [
    {
      codigoSin: '815461',
      descripcion: 'Este es el pago 1',
      precioUnitario: 40,
      cantidad: 1,
      unidadMedida: 1,
      subTotal: 40,
    },
    {
      codigoSin: '815461',
      descripcion: 'Este es el pago 2',
      precioUnitario: 60,
      cantidad: 1,
      unidadMedida: 1,
      subTotal: 60,
    },
  ],
  codigoOrden: ''
};

const resRegistroDeuda: AxiosResponse = {
  data: {
    finalizado: true,
    mensaje: 'Registro creado con exito!',
    datos: {
      idTransaccion: '158ad0cf-3997-4c3c-b85a-f51be70bc8d6',
      urlRedireccion:
        'https://pre-ppe.agetic.gob.bo/transaccion/?id=158ad0cf-3997-4c3c-b85a-f51be70bc8d6',
    },
  },
  headers: {},
  status: 201,
  statusText: '',
  config: {},
};

describe('PpeService', () => {
  let service: PpeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PpeService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(() => of(resRegistroDeuda)),
          },
        },
      ],
    }).compile();

    service = module.get<PpeService>(PpeService);
  });

  it('[solicitudDePago] deberia realizar una solicitud de pago.', async () => {
    const response = await service.solicitudDePago(datosPago);
    expect(response).toHaveProperty('finalizado');
    expect(response.finalizado).toBe(true);
  });
});
