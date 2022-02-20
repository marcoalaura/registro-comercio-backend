import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigCoreModule } from './config/config.module';
import { ExternalServicesModule } from './external-services/external.module';
import { LogService } from './logs/log.service';
import { AprobacionModule } from './aprobacion/aprobacion.module';

@Module({
  imports: [
    ConfigCoreModule,
    ExternalServicesModule,
    AuthorizationModule,
    AuthenticationModule,
    LogService,
    AprobacionModule,
  ],
  exports: [ExternalServicesModule],
})
export class CoreModule {}
