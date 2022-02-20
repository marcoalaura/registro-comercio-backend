import { Module, HttpModule } from '@nestjs/common';
import { PpeService } from './ppe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('PPE_URL'),
        headers: {
          authorization: `Bearer ${configService.get('PPE_TOKEN')}`,
          'x-cpt-authorization': `${configService.get('PEE_CPT_TOKEN')}`,
          contentType: 'application/json',
        },
      }),
    }),
  ],
  providers: [PpeService],
  exports: [PpeService],
})
export class PpeModule {}
