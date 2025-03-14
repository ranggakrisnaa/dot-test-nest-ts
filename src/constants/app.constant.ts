export const IS_PUBLIC = 'isPublic';
export const IS_AUTH_OPTIONAL = 'isAuthOptional';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum LogService {
  CONSOLE = 'console',
}

export const loggingRedactPaths = [
  'req.headers.authorization',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.email',
  'req.body.password',
  'req.body.oldPassword',
];
