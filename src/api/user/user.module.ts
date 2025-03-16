import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from 'src/database/entities/address.entity';
import { CompanyEntity } from 'src/database/entities/company.entity';
import { SessionEntity } from 'src/database/entities/session.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { ApiService } from 'src/shared/http/api.service';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      AddressEntity,
      SessionEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ApiService, UserRepository, AuthService, JwtService],
})
export class UserModule {}
