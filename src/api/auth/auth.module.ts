import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiService } from 'src/shared/http/api.service';
import { AddressEntity } from '../../database/entities/address.entity';
import { CompanyEntity } from '../../database/entities/company.entity';
import { SessionEntity } from '../../database/entities/session.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      AddressEntity,
      SessionEntity,
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, ApiService],
})
export class AuthModule {}
