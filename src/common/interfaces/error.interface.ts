import { ErrorDetailDto } from './error-detail.interface';

export interface ErrorDto {
  timestamp: string;
  statusCode: number;
  error: string;
  errorCode?: string;
  message: string;
  details?: ErrorDetailDto[];
  stack?: string;
  trace?: Error | unknown;
}
