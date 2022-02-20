import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository';
import { AuthorizationController } from './controller/authorization.controller';
import { AuthorizationService } from './controller/authorization.service';
import { ModuloController } from './controller/modulo.controller';
import { RolController } from './controller/rol.controller';
import { ModuloRepository } from './repository/modulo.repository';
import { RolRepository } from './repository/rol.repository';
import { UsuarioRolRepository } from './repository/usuario-rol.repository';
import { ModuloService } from './service/modulo.service';
import { RolService } from './service/rol.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioRolRepository,
      RolRepository,
      ModuloRepository,
      UsuarioRepository,
    ]),
    ConfigModule,
  ],
  exports: [AuthorizationService],
  controllers: [AuthorizationController, RolController, ModuloController],
  providers: [RolService, ModuloService, ConfigService, AuthorizationService],
})
export class AuthorizationModule {}
