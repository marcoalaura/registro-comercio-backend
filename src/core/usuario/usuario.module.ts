import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './repository/usuario.repository';
import { UsuarioService } from './service/usuario.service';
import { SessionRepository } from '../authentication/repository/sessions.repository';
import { UsuarioController } from './controller/usuario.controller';
import { PersonaRepository } from './repository/persona.repository';
import { PersonaService } from './service/persona.service';
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from '../authorization/authorization.module';
import { UsuarioRolRepository } from '../authorization/repository/usuario-rol.repository';
import { RolRepository } from '../authorization/repository/rol.repository';
import { IopModule } from '../external-services/iop/iop.module';

@Module({
  providers: [UsuarioService, PersonaService],
  exports: [UsuarioService, PersonaService],
  imports: [
    TypeOrmModule.forFeature([
      UsuarioRepository,
      PersonaRepository,
      UsuarioRolRepository,
      RolRepository,
      SessionRepository,
    ]),
    MensajeriaModule,
    IopModule,
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
