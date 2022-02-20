import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { TramiteController } from './controller/tramite.controller';
import { ParametricaController } from './controller/parametrica.controller';
import { DocumentosEmitidosController } from './controller/documentosEmitidos.controller';
import { FacturaController } from './controller/factura.controller';
import { PagosController } from './controller/pagos.controller';
import { TramiteGenericoController } from './controller/tramite-generico.conotroller';
import { ObservacionController } from './controller/observacion.controller';
import { JuridicoController } from './controller/juridico.controller';
import { LiquidacionController } from './controller/liquidacion.controller';
import { ArancelController } from './controller/arancel.controller';

import { TramiteService } from './services/tramite.service';
import { ParametricaService } from './services/parametrica.service';
import { DocumentosEmitidosService } from './services/documentosEmitidos.service';
import { FacturaService } from './services/factura.service';
import { PagosService } from './services/pagos.service';
import { TramiteGenericoService } from './services/tramite-generico/tramite-generico.service';
import { ObservacionService } from './services/observacion.service';
import { TramiteGenericoCamposService } from './services/tramite-generico/tramite-generico-campos.service';
import { FileService } from '../../common/lib/file.service';
import { LiquidacionService } from './services/liquidacion.service';
import { ArancelService } from './services/arancel.service';
import { ReporteService } from '../reporte/reporte.service';
import { CarboneService } from '../../../libs/carbone/src';
import { AprobacionService } from 'src/core/aprobacion/aprobacion.service';
import { TramiteInformacionService } from './services/tramite-generico/tramite-informacion.service';

import { TramiteRepository } from './repository/tramite.repository';
import { ParametricaRepository } from './repository/parametrica.repository';
import { DocumentosEmitidosRepository } from './repository/documentosEmitidos.repository';
import { FacturaRepository } from './repository/factura.repository';
import { PagosRepository } from './repository/pagos.repository';
import { ObservacionRepository } from './repository/observacion.repository';
import { TramiteDetalleRepository } from './repository/tramite-detalle.repository';
import { TramiteDocumentoSoporteRepository } from './repository/tramite-documento-soporte.repository';
import { TramiteBitacoraRepository } from './repository/tramite-bitacora.repository';
import { LiquidacionRepository } from './repository/tramite-liquidacion.repository';
import { ArancelRepository } from './repository/arancel.repository';
import { EmpresaRepository } from '../empresa/repository/empresa.repository';
import { TramiteSeccionRepository } from './repository/tramite-seccion.repository';
import { ReporteRepository } from '../reporte/reporte.repository';
import { EstablecimientoRepository } from '../empresa/repository/establecimiento.repository';
import { ClasificadorRepository } from '../empresa/repository/clasificador.repository';

import { SegipModule } from 'src/core/external-services/iop/segip/segip.module';
import { SufeModule } from '../../core/external-services/iop/sufe/sufe.module';
import { PpeModule } from '../../core/external-services/ppe/ppe.module';
import { UsuarioModule } from 'src/core/usuario/usuario.module';
import { AprobacionDocumentosModule } from 'src/core/external-services/iop/aprobacion/aprobacion.module';
import { ParametroModule } from '../parametro/parametro.module';

// tramite registro unipersonales
import { TramiteRegistroUnipersonalesController } from './controller/registro-unipersonales/tramite.controller';
import { TramiteRegistroUnipersonalesService } from './services/registro-unipersonales/tramite.service';
import { TramiteRegistroUnipersonalesRepository } from './repository/registro-unipersonales/tramite.repository';

@Module({
  controllers: [
    TramiteController,
    ParametricaController,
    DocumentosEmitidosController,
    FacturaController,
    PagosController,
    TramiteGenericoController,
    ObservacionController,
    JuridicoController,
    LiquidacionController,
    ArancelController,
    TramiteRegistroUnipersonalesController,
  ],
  providers: [
    ConfigService,
    TramiteService,
    ParametricaService,
    DocumentosEmitidosService,
    FacturaService,
    PagosService,
    TramiteGenericoService,
    ObservacionService,
    TramiteGenericoCamposService,
    FileService,
    LiquidacionService,
    ArancelService,
    TramiteRegistroUnipersonalesService,
    ReporteService,
    CarboneService,
    AprobacionService,
    TramiteInformacionService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      TramiteRepository,
      ParametricaRepository,
      DocumentosEmitidosRepository,
      FacturaRepository,
      PagosRepository,
      ObservacionRepository,
      TramiteDetalleRepository,
      TramiteDocumentoSoporteRepository,
      TramiteBitacoraRepository,
      LiquidacionRepository,
      ArancelRepository,
      TramiteRegistroUnipersonalesRepository,
      EmpresaRepository,
      TramiteSeccionRepository,
      ReporteRepository,
      EstablecimientoRepository,
      ClasificadorRepository,
    ]),
    SufeModule,
    SegipModule,
    PpeModule,
    UsuarioModule,
    AprobacionDocumentosModule,
    UsuarioModule,
    ParametroModule,
  ],
  exports: [TramiteService, FacturaService, PagosService],
})
export class TramiteModule {}
