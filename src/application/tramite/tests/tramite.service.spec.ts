import { Test, TestingModule } from '@nestjs/testing';
import { TramiteService } from '../services/tramite.service';

describe('TramiteService', () => {
  let service: TramiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TramiteService],
    }).compile();

    service = module.get<TramiteService>(TramiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
