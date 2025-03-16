import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UUID } from 'crypto';
import { Request } from 'express';
import ms, { StringValue } from 'ms';
import { IUser } from 'src/database/interfaces/user.interface';
import { DataSource, Repository } from 'typeorm';
import { ISuccessResponse } from '../../common/interfaces/success.interface';
import { AllConfigType } from '../../config/config.type';
import { AddressEntity } from '../../database/entities/address.entity';
import { CompanyEntity } from '../../database/entities/company.entity';
import { SessionEntity } from '../../database/entities/session.entity';
import { ApiService } from '../../shared/http/api.service';
import { hashPassword, verifyPassword } from '../../utils/password.util';
import { UserRepository } from '../user/user.repository';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { Token } from './types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly apiService: ApiService,
  ) {}

  async signIn(
    reqBody: SignInDto,
    request: Request,
  ): Promise<ISuccessResponse<Token>> {
    const ipAddress =
      request.headers['x-forwarded-for']?.toString().split(',')[0] ||
      request.ip;
    const userAgent = request.headers['user-agent'] || 'Unknown Device';

    const [foundUser, foundSession] = await Promise.all([
      this.userRepo.findOne({
        where: [
          { email: reqBody.emailOrUsername },
          { username: reqBody.emailOrUsername },
        ],
      }),
      this.sessionRepo.findOne({ where: [{ ipAddress, device: userAgent }] }),
    ]);
    if (!foundUser) throw new NotFoundException('User data is not found.');

    const matchPassword = await verifyPassword(
      reqBody.password,
      foundUser.password,
    );
    if (!matchPassword) throw new BadRequestException('Password is not valid.');

    try {
      const token = await this.createToken(foundUser);

      await this.sessionRepo.upsert(
        {
          id: foundSession?.id ? (foundSession.id as UUID) : (uuidv4() as UUID),
          refreshToken: token.refreshToken,
          device: userAgent,
          ipAddress,
          userId: foundUser.id,
        },
        ['id'],
      );

      return {
        message: 'User sign in sucessfully.',
        statusCode: HttpStatus.OK,
        data: token,
      };
    } catch (err: unknown) {
      if (err instanceof Error)
        throw new InternalServerErrorException(err.message);
    }
  }

  async signUp(reqBody: SignUpDto): Promise<ISuccessResponse<null>> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { company, address, ...req } = reqBody;

      const foundUser = await queryRunner.manager.findOne(
        this.userRepo.target,
        {
          where: { email: req.email },
        },
      );

      if (foundUser) throw new ConflictException('User data already exists.');

      const [, newUser] = await Promise.all([
        this.apiService.post<IUser>('/users', reqBody),
        queryRunner.manager.create(this.userRepo.target, {
          ...req,
          password: await hashPassword(req.password),
        }),
      ]);

      const user = await queryRunner.manager.save(
        this.userRepo.target,
        newUser,
      );

      await Promise.all(
        [
          company &&
            queryRunner.manager.insert(this.companyRepo.target, {
              ...company,
              userId: user.id,
            }),

          (async () => {
            if (address) {
              await queryRunner.manager.insert(this.addressRepo.target, {
                ...address,
                userId: user.id,
              });
            }
          })(),
        ].filter(Boolean),
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        data: null,
        message: 'User sign up successfully.',
      };
    } catch (err: unknown) {
      await queryRunner.rollbackTransaction();
      if (err instanceof Error)
        throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async createToken(data: { id: string }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires =
      Date.now() + ms(tokenExpiresIn as unknown as StringValue);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenExpires,
    } as unknown as Token;
  }

  async verifyToken(
    token: string,
    type: string = 'accessToken',
  ): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload =
        type == 'accessToken'
          ? this.jwtService.verify(token, {
              secret: this.configService.getOrThrow('auth.secret', {
                infer: true,
              }),
            })
          : this.jwtService.verify(token, {
              secret: this.configService.getOrThrow('auth.refreshSecret', {
                infer: true,
              }),
            });
    } catch {
      throw new UnauthorizedException();
    }
    return payload;
  }

  async refreshToken(
    reqBody: RefreshTokenDto,
  ): Promise<ISuccessResponse<Token>> {
    const verifyToken = await this.verifyToken(
      reqBody.refreshToken,
      'refreshToken',
    );
    const foundSession = await this.sessionRepo.findOne({
      where: {
        userId: verifyToken.id as UUID,
        refreshToken: reqBody.refreshToken,
      },
    });
    if (!foundSession)
      throw new NotFoundException('Session refresh token is not found.');

    const foundUser = await this.userRepo.findOneBy({
      id: verifyToken.id as UUID,
    });
    if (!foundUser) throw new NotFoundException('User data is not found.');

    try {
      const newToken = await this.createToken(foundUser);

      await this.sessionRepo.update(foundSession.id, {
        refreshToken: newToken.refreshToken,
      });

      return {
        statusCode: HttpStatus.OK,
        data: newToken,
        message: 'New token generated successfully.',
      };
    } catch (err: unknown) {
      if (err instanceof Error)
        throw new InternalServerErrorException(err.message);
    }
  }

  async logout(userId: string): Promise<ISuccessResponse<null>> {
    console.log(userId);

    const foundSession = await this.sessionRepo.findBy({
      userId: userId as UUID,
    });
    if (foundSession.length == 0)
      throw new UnauthorizedException('User has been logged out.');

    try {
      await this.sessionRepo.softDelete({
        userId: userId as UUID,
      });
      return {
        statusCode: HttpStatus.OK,
        data: null,
        message: 'User logged out successfully.',
      };
    } catch (err: unknown) {
      if (err instanceof Error)
        throw new InternalServerErrorException(err.message);
    }
  }
}
