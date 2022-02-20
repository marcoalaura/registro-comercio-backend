import { Module } from '@nestjs/common';
import { SegipModule } from './segip/segip.module';
import { SinModule } from './sin/sin.module';
import { SufeModule } from './sufe/sufe.module';
import { AprobacionDocumentosModule } from './aprobacion/aprobacion.module';

@Module({
  imports: [SegipModule, SinModule, SufeModule, AprobacionDocumentosModule],
  providers: [],
  exports: [SegipModule, SinModule, SufeModule, AprobacionDocumentosModule],
})
export class IopModule {}
