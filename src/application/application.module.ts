import { Module } from '@nestjs/common';
import { ParametroModule } from './parametro/parametro.module';
import { EmpresaModule } from './empresa/empresa.module';
import { TramiteModule } from './tramite/tramite.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { ServiciosIOPModule } from './servicios-iop/servicios-iop.module';
import { PublicacionModule } from './publicacion/publicacion.module';
import { ReporteModule } from './reporte/reporte.module';

@Module({
  imports: [
    ParametroModule,
    EmpresaModule,
    TramiteModule,
    NotificacionModule,
    ServiciosIOPModule,
    PublicacionModule,
    ReporteModule,
  ],
})
export class ApplicationModule {}
