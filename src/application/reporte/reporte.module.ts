import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { EmpresaModule } from '../empresa/empresa.module';
import { ReporteRepository } from './reporte.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmpresaRepository } from '../empresa/repository/empresa.repository';
import { CarboneModule } from 'libs/carbone/src';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteRepository, EmpresaRepository]),
    EmpresaModule,
    CarboneModule,
    ConfigModule,
  ],
  providers: [ReporteService],
  controllers: [ReporteController],
  exports: [ReporteService],
})
export class ReporteModule {}
