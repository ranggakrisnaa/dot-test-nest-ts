import { AuthConfig } from 'src/api/auth/types/auth-config.type';
import { RedisConfig } from 'src/redis/redis-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  redis: RedisConfig;
};
