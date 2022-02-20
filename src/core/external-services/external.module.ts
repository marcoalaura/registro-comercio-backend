import { Module } from '@nestjs/common';
import { MensajeriaModule } from './mensajeria/mensajeria.module';
import { IopModule } from './iop/iop.module';
import { PpeModule } from './ppe/ppe.module';

@Module({
  imports: [MensajeriaModule, IopModule, PpeModule],
  providers: [],
  exports: [MensajeriaModule, IopModule, PpeModule],
})
export class ExternalServicesModule {}
