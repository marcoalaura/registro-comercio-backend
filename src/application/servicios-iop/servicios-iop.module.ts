import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiciosController } from './rest/servicios-rest.controller';
import { RepresentanteLegalService } from './service/soap/representante-legal.service';
import { EmpresaService } from './service/soap/empresa.service';
import { ServiciosRESTService } from './service/rest/empresa.service';
import { SucursalService } from './service/soap/sucursal.service';
import { ActividadService } from './service/soap/actividad.service';
import { ServiciosIopService } from './soap/servicios-soap.service';
import { VistaSucursalRepository } from './repository/soap/sucursal.repository';
import { VistaActividadRepository } from './repository/soap/actividad.repository';
import { VistaEmpresaRepository } from './repository/soap/empresa.repository';
import { VistaServiciosRESTRepository } from './repository/rest/empresa.repository';
import { VistaRepresentanteLegalRepository } from './repository/soap/representante-legal.repository';

import { ResponseWrapper } from './soap/lib/response-wrapper';

@Module({
  controllers: [ServiciosController],
  providers: [
    EmpresaService,
    ServiciosRESTService,
    RepresentanteLegalService,
    SucursalService,
    ActividadService,
    ServiciosIopService,
    ResponseWrapper,
  ],
  imports: [
    TypeOrmModule.forFeature([
      VistaEmpresaRepository,
      VistaServiciosRESTRepository,
      VistaRepresentanteLegalRepository,
      VistaSucursalRepository,
      VistaActividadRepository,
    ]),
  ],
  exports: [ServiciosIopService],
})
export class ServiciosIOPModule {}
