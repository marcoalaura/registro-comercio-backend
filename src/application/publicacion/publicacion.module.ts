import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { SufeModule } from '../../core/external-services/iop/sufe/sufe.module';
import { PpeModule } from '../../core/external-services/ppe/ppe.module';

import { PublicacionGenericoController } from './controller/publicacion-generico.controller';
import { PublicacionTramiteController } from './controller/publicacion-tramite.controller';
import { PublicacionController } from './controller/publicacion.controller';

import { PublicacionTramiteService } from './services/publicacion-tramite.service';
import { PublicacionGenericoService } from './services/publicacion-generico.service';
import { PublicacionService } from './services/publicacion.service';

import { TramiteRepository } from '../tramite/repository/tramite.repository';
import { TramiteDetalleRepository } from '../tramite/repository/tramite-detalle.repository';
import { TramiteBitacoraRepository } from '../tramite/repository/tramite-bitacora.repository';
import { ParametricaRepository } from '../tramite/repository/parametrica.repository';
import { EmpresaRepository } from '../empresa/repository/empresa.repository';
import { PublicacionRepository } from './repository/publicacion.repository';

@Module({
  controllers: [
    PublicacionTramiteController,
    PublicacionGenericoController,
    PublicacionController,
  ],
  providers: [
    ConfigService,
    PublicacionTramiteService,
    PublicacionGenericoService,
    PublicacionService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      TramiteRepository,
      TramiteDetalleRepository,
      ParametricaRepository,
      TramiteBitacoraRepository,
      EmpresaRepository,
      PublicacionRepository,
    ]),
    SufeModule,
    PpeModule,
  ],
  exports: [
    PublicacionTramiteService,
    PublicacionGenericoService,
    PublicacionService,
  ],
})
export class PublicacionModule {}
