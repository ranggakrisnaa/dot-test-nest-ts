import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from '../config/app.config';
import databaseConfig from '../database/config/database.config';
import loggerFactory from './logger-factory';

function generateModulesSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
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

  return imports.concat([loggerModule, dbModule]);
}

export default generateModulesSet;
