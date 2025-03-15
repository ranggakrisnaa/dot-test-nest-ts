import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STATUS_CODES } from 'http';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { IErrorDetail } from '../common/interfaces/error-detail.interface';
import { IError } from '../common/interfaces/error.interface';
import { AllConfigType } from '../config/config.type';
import { constraintErrors } from '../constants/constraint-error.constant';
import { ErrorCode } from '../constants/error-constant';
import { ValidationException } from '../exceptions/validation.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private debug: boolean = false;
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.debug = this.configService.getOrThrow('app.debug', { infer: true });

    let error: IError;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof ValidationException) {
      error = this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      error = this.handleQueryFailedError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      error = this.handleEntityNotFoundError(exception);
    } else {
      error = this.handleError(exception);
    }

    if (this.debug) {
      error.stack = exception.stack;
      error.trace = exception;

      this.logger.debug(error);
    }

    response.status(error.statusCode).json(error);
  }

  /**
   * Handles UnprocessableEntityException:
   * Check the request payload
   * Validate the input
   * @param exception UnprocessableEntityException
   * @returns IError
   */
  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): IError {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message),
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * Handles validation errors
   * @param exception ValidationException
   * @returns IError
   */
  private handleValidationException(exception: ValidationException): IError {
    const r = exception.getResponse() as {
      errorCode: ErrorCode;
      message: string;
    };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      errorCode:
        Object.keys(ErrorCode)[Object.values(ErrorCode).indexOf(r.errorCode)],
      message: r.message,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * Handles HttpException
   * @param exception HttpException
   * @returns IError
   */
  private handleHttpException(exception: HttpException): IError {
    const statusCode = exception.getStatus();
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: exception.message,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * Handles QueryFailedError
   * @param error QueryFailedError
   * @returns IError
   */
  private handleQueryFailedError(error: QueryFailedError): IError {
    const r = error as QueryFailedError & { constraint?: string };
    const { status, message } = r.constraint?.startsWith('UQ')
      ? {
          status: HttpStatus.CONFLICT,
          message: r.constraint ? constraintErrors[r.constraint] : undefined,
        }
      : {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        };
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      message,
    } as unknown as IError;

    this.logger.error(error);

    return errorRes;
  }

  /**
   * Handles EntityNotFoundError when using findOrFail() or findOneOrFail() from TypeORM
   * @param error EntityNotFoundError
   * @returns IError
   */
  private handleEntityNotFoundError(error: EntityNotFoundError): IError {
    const status = HttpStatus.NOT_FOUND;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      message: 'Entity Not Found',
    } as unknown as IError;

    this.logger.debug(error);

    return errorRes;
  }

  /**
   * Handles generic errors
   * @param error Error
   * @returns IError
   */
  private handleError(error: Error): IError {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || 'An unexpected error occurred',
    };

    this.logger.error(error);

    return errorRes;
  }

  /**
   * Extracts error details from ValidationError[]
   * @param errors ValidationError[]
   * @returns IErrorDetail[]
   */
  private extractValidationErrorDetails(
    errors: ValidationError[],
  ): IErrorDetail[] {
    const extractErrors = (
      error: ValidationError,
      parentProperty: string = '',
    ): IErrorDetail[] => {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: IErrorDetail[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: IErrorDetail[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, propertyPath),
        ) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }
}
