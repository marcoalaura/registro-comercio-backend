import { Module, HttpModule } from '@nestjs/common';
import { SufeService } from './sufe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('IOP_SUFE_URL'),
        headers: {
          authorization: `Bearer ${configService.get('IOP_SUFE_TOKEN')}`,
          contentType: 'application/json',
        },
      }),
    }),
  ],
  providers: [SufeService],
  exports: [SufeService],
})
export class SufeModule {}
