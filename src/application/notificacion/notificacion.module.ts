import { Module } from '@nestjs/common';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FacturaRepository } from './factura.repository';
import { SufeModule } from '../../core/external-services/iop/sufe/sufe.module';
import { TramiteModule } from '../tramite/tramite.module';

@Module({
  controllers: [NotificacionController],
  providers: [NotificacionService],
  imports: [
    // TypeOrmModule.forFeature([FacturaRepository])
    TramiteModule,
    SufeModule,
  ],
})
export class NotificacionModule {}
