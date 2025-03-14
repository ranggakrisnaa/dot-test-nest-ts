import { ConfigService } from '@nestjs/config';
import { type IncomingMessage, type ServerResponse } from 'http';
import { Params } from 'nestjs-pino';
import pino from 'pino'; // Import langsung dari pino
import { GenReqId, Options, type ReqId } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { AllConfigType } from '../config/config.type';
import { loggingRedactPaths, LogService } from '../constants/app.constant';

const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const id: ReqId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', id.toString());
  return id;
};

const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  responseTime: number,
) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};

const customReceivedMessage = (req: IncomingMessage) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (req, res, err) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};

function logServiceConfig(logService: string, isProd: boolean): Options {
  if (isProd) {
    return {
      messageKey: 'msg',
      destination: pino.destination(1), // Menulis langsung ke stdout di production
    };
  }

  return {
    messageKey: 'msg',
    transport: {
      target: 'pino-pretty',
      options: { singleLine: true },
    },
  };
}

async function loggerFactory(
  configService: ConfigService<AllConfigType>,
): Promise<Params> {
  const logLevel = configService.get('app.logLevel', { infer: true }) || 'info';
  const logService =
    configService.get('app.logService', { infer: true }) || LogService.CONSOLE;
  const isDebug = configService.get('app.debug', { infer: true }) || false;
  const isProd = process.env.NODE_ENV === 'production';

  const pinoHttpOptions: Options = {
    level: logLevel,
    genReqId: isDebug ? genReqId : undefined,
    serializers: isDebug
      ? {
          req: (req) => {
            req.body = req.raw.body;
            return req;
          },
        }
      : undefined,
    customSuccessMessage,
    customReceivedMessage,
    customErrorMessage,
    redact: {
      paths: loggingRedactPaths,
      censor: '**GDPR COMPLIANT**',
    },
    ...logServiceConfig(logService, isProd),
  };

  return {
    pinoHttp: pinoHttpOptions,
  };
}

export default loggerFactory;
