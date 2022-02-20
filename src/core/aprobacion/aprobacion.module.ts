import { Module } from '@nestjs/common';
import { AprobacionController } from './aprobacion.controller';
import { AprobacionService } from './aprobacion.service';
import { AprobacionDocumentosModule } from '../external-services/iop/aprobacion/aprobacion.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { FileService } from '../../common/lib/file.service';

@Module({
  controllers: [AprobacionController],
  providers: [AprobacionService, FileService],
  imports: [AprobacionDocumentosModule, UsuarioModule],
})
export class AprobacionModule {}
