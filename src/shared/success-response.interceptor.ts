// shared/interceptors/success.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISuccessResponse } from '../common/interfaces/success.interface';

@Injectable()
export class SuccessInterceptor<T>
  implements NestInterceptor<T, ISuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ISuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        let responseMessage =
          typeof data === 'object' && 'message' in data
            ? data.message
            : this.getDefaultSuccessMessage(context);

        if (
          typeof data === 'object' &&
          'message' in data &&
          'statusCode' in data
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message, statusCode, ...cleanData } = data;
          responseMessage = message;
          data = cleanData;
        }

        const responseData =
          typeof data === 'object' && 'data' in data ? data.data : data;

        return {
          timestamp: new Date().toISOString(),
          statusCode,
          status: STATUS_CODES[statusCode],
          data: responseData,
          message: responseMessage,
        };
      }),
    );
  }

  private getDefaultSuccessMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    switch (method) {
      case 'GET':
        return 'Resource retrieved successfully';
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Operation completed successfully';
    }
  }
}
