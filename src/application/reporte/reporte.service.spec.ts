import { Test, TestingModule } from '@nestjs/testing';
import { ReporteService } from './reporte.service';
import { ReporteRepository } from './reporte.repository';
import { CarboneService } from '../../../libs/carbone/src';
import { FileService } from '../../../libs/file/src';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

describe('ReporteService', () => {
  let service: ReporteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        ReporteService,
        {
          provide: ReporteRepository,
          useValue: {},
        },
        CarboneService,
        FileService,
        PinoLogger,
      ],
    }).compile();

    service = module.get<ReporteService>(ReporteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
