import TypeORMAdapter from 'typeorm-adapter';
import { Module } from '@nestjs/common';
import { AuthZModule, AUTHZ_ENFORCER } from 'nest-authz';
import { join } from 'path';
import { newEnforcer } from 'casbin';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    AuthZModule.register({
      imports: [ConfigModule],
      enforcerProvider: {
        provide: AUTHZ_ENFORCER,
        useFactory: async (configService: ConfigService) => {
          const adapter = await TypeORMAdapter.newAdapter({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            schema: configService.get('DB_SCHEMA_EMPRESA'),
            logging: configService.get('NODE_ENV') === 'development',
            synchronize: false,
          });
          const enforcer = await newEnforcer(
            join(__dirname, 'model.conf'),
            adapter,
          );
          enforcer.enableLog(true);
          await enforcer.loadPolicy();
          return enforcer;
        },
        inject: [ConfigService],
      },
      usernameFromContext: (ctx) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user && request.user.username;
      },
    }),
  ],
})
export class AuthorizationConfigModule {}
