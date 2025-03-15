import { IErrorDetail } from './error-detail.interface';

export interface IError {
  timestamp: string;
  statusCode: number;
  error: string;
  errorCode?: string;
  message: string;
  details?: IErrorDetail[];
  stack?: string;
  trace?: Error | unknown;
}
