import { Module, HttpModule } from '@nestjs/common';
import { AprobacionDocumentosService } from './aprobacion.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_APROBACION_URL'),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configService.get('IOP_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [AprobacionDocumentosService],
  exports: [AprobacionDocumentosService],
})
export class AprobacionDocumentosModule {}
