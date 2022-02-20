import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthenticationController } from './controller/authentication.controller';
import { RefreshTokensController } from './controller/refreshTokens.controller';
import { AuthenticationService } from './service/authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { buildOpenIdClient, OidcStrategy } from './strategies/oidc.strategy';
import { SessionSerializer } from './session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from '../usuario/repository/usuario.repository';

import { RefreshTokensRepository } from './repository/refreshTokens.repository';
import { RefreshTokensService } from './service/refreshTokens.service';
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (autenticacionService: AuthenticationService) => {
    const client = await buildOpenIdClient();
    if (!client) {
      return null;
    } else {
      const strategy = new OidcStrategy(autenticacionService, client);
      return strategy;
    }
  },
  inject: [AuthenticationService],
};

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    UsuarioModule,
    ConfigModule,
    TypeOrmModule.forFeature([UsuarioRepository, RefreshTokensRepository]),
    MensajeriaModule,
  ],
  controllers: [AuthenticationController, RefreshTokensController],
  providers: [
    AuthenticationService,
    RefreshTokensService,
    LocalStrategy,
    JwtStrategy,
    OidcStrategyFactory,
    SessionSerializer,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
