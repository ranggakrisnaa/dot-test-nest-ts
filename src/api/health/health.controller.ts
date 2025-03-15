import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AllConfigType } from 'src/config/config.type';

@Controller('health')
export class HealthController {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async Health(): Promise<HealthCheckResult> {
    const list = [() => this.db.pingCheck('database')];
    return this.health.check(list as HealthIndicatorFunction[]);
  }

  @Get('ping')
  PingCheck(): Record<string, any> {
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully ping server.',
    };
  }
}
