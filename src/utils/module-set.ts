import { CacheModule } from '@nestjs/cache-manager';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { LoggerModule } from 'nestjs-pino';
import { AllConfigType } from 'src/config/config.type';
import redisConfig from 'src/redis/redis.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ApiModule } from '../api/api.module';
import authConfig from '../api/auth/config/auth-config';
import appConfig from '../config/app.config';
import databaseConfig from '../database/config/database.config';
import { TypeOrmConfigService } from '../database/typeorm-config.service';
import loggerFactory from './logger-factory';

function generateModulesSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, redisConfig],
      envFilePath: ['.env'],
    }),
  ];

  const loggerModule = LoggerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: loggerFactory,
  });

  const dbModule = TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService,
    dataSourceFactory: async (options: DataSourceOptions) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return new DataSource(options).initialize();
    },
  });

  const cacheModule = CacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService<AllConfigType>) => {
      return {
        store: await redisStore({
          host: configService.getOrThrow('redis.host', {
            infer: true,
          }),
          port: configService.getOrThrow('redis.port', {
            infer: true,
          }),
          password: configService.getOrThrow('redis.password', {
            infer: true,
          }),
          tls: configService.get('redis.tlsEnabled', { infer: true }),
        }),
      };
    },
    isGlobal: true,
    inject: [ConfigService],
  });

  return imports.concat([loggerModule, dbModule, ApiModule, cacheModule]);
}

export default generateModulesSet;
