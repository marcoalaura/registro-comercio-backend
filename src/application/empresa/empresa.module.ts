import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaController } from './controller/empresa.controller';
import { EmpresaService } from './service/empresa.service';
import { EmpresaRepository } from './repository/empresa.repository';

import { EstablecimientoController } from './controller/establecimiento.controller';
import { EstablecimientoService } from './service/establecimiento.service';
import { EstablecimientoRepository } from './repository/establecimiento.repository';

import { ObjetoSocialController } from './controller/objeto-social.controller';
import { ObjetoSocialService } from './service/objeto-social.service';
import { ObjetoSocialRepository } from './repository/objeto-social.repository';

import { DenominacionController } from './controller/denominacion.controller';
import { DenominacionService } from './service/denominacion.service';
import { DenominacionRepository } from './repository/denominacion.repository';

import { ActividadEconomicaController } from './controller/actividad-economica.controller';
import { ActividadEconomicaService } from './service/actividad-economica.service';
import { ActividadEconomicaRepository } from './repository/actividad-economica.repository';

import { VinculadoController } from './controller/vinculado.controller';
import { VinculadoService } from './service/vinculado.service';
import { VinculadoRepository } from './repository/vinculado.repository';

import { CapitalController } from './controller/capital.controller';
import { CapitalService } from './service/capital.service';
import { CapitalRepository } from './repository/capital.repository';

import { InformacionFinancieraController } from './controller/informacion-financiera.controller';
import { InformacionFinancieraService } from './service/informacion-financiera.service';
import { InformacionFinancieraRepository } from './repository/informacion-financiera.repository';

import { InformacionAlertasController } from './controller/informacion-alertas.controller';
import { InformacionAlertasService } from './service/informacion-alertas.service';

import { HabilitacionExcepcionService } from './service/habilitacion-excepcion.service';
import { HabilitacionExcepcionRepository } from './repository/habilitacion-excepcion.repository';

import { TramiteModule } from '../tramite/tramite.module';
import { SinModule } from '../../core/external-services/iop/sin/sin.module';

import { ClasificadoresController } from './controller/clasificadores.controller';
import { ClasificadorService } from './service/clasificador.service';
import { ClasificadorRepository } from './repository/clasificador.repository';

import { ContactoRepository } from './repository/contacto.repository';

@Module({
  controllers: [
    EmpresaController,
    EstablecimientoController,
    ObjetoSocialController,
    DenominacionController,
    ActividadEconomicaController,
    VinculadoController,
    CapitalController,
    InformacionFinancieraController,
    InformacionAlertasController,
    ClasificadoresController,
  ],
  providers: [
    EmpresaService,
    EstablecimientoService,
    ObjetoSocialService,
    DenominacionService,
    ActividadEconomicaService,
    VinculadoService,
    CapitalService,
    InformacionFinancieraService,
    InformacionAlertasService,
    HabilitacionExcepcionService,
    ClasificadorService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      EmpresaRepository,
      EstablecimientoRepository,
      ObjetoSocialRepository,
      DenominacionRepository,
      ActividadEconomicaRepository,
      VinculadoRepository,
      CapitalRepository,
      InformacionFinancieraRepository,
      HabilitacionExcepcionRepository,
      ClasificadorRepository,
      ContactoRepository,
    ]),
    TramiteModule,
    SinModule,
  ],
})
export class EmpresaModule {}
