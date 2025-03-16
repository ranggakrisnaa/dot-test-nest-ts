import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { UUID } from 'crypto';
import { ISuccessResponse } from 'src/common/interfaces/success.interface';
import { AddressEntity } from 'src/database/entities/address.entity';
import { CompanyEntity } from 'src/database/entities/company.entity';
import { SessionEntity } from 'src/database/entities/session.entity';
import { IUser } from 'src/database/interfaces/user.interface';
import { ApiService } from 'src/shared/http/api.service';
import { hashPassword } from 'src/utils/password.util';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 3600;
  private readonly ALL_USERS_CACHE_KEY = 'all_users';
  private readonly USER_DETAIL_CACHE_PREFIX = 'user_detail_';

  constructor(
    private readonly apiService: ApiService,
    private readonly userRepo: UserRepository,
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllUsers(): Promise<ISuccessResponse<any>> {
    const cachedUsers = await this.cacheManager.get(this.ALL_USERS_CACHE_KEY);

    const foundUsers = await this.userRepo.find({
      relations: ['company', 'address'],
    });

    await this.cacheManager.set(
      this.ALL_USERS_CACHE_KEY,
      foundUsers,
      this.CACHE_TTL,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Data User retrieved successfully.',
      data: cachedUsers ?? foundUsers,
    };
  }

  async getUserDetail(userId: string): Promise<ISuccessResponse<any>> {
    const cacheKey = `${this.USER_DETAIL_CACHE_PREFIX}${userId}`;
    const cachedUser = await this.cacheManager.get(cacheKey);

    const user = await this.userRepo.findOne({
      where: { id: userId as UUID },
      relations: ['company', 'address'],
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    await this.cacheManager.set(cacheKey, user, this.CACHE_TTL);

    return {
      statusCode: HttpStatus.OK,
      message: 'Data User retrieved successfully.',
      data: cachedUser ?? user,
    };
  }

  async insertDataFromApi(): Promise<ISuccessResponse<any>> {
    try {
      const apiData = await this.apiService.get<IUser[]>('/users');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newData = apiData.map(({ id, ...data }) => ({
        ...data,
      }));

      const existingUsers = await this.userRepo.find({
        select: ['email'],
      });

      const newUsers = newData.filter(
        (data) => !existingUsers.some((user) => user.email === data.email),
      );

      if (newUsers.length === 0) {
        throw new BadRequestException('All user data already exist.');
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const user of newUsers) {
          const insertedUser = await queryRunner.manager.save(
            this.userRepo.create({
              ...user,
              password: '',
            }),
          );

          if (user.company) {
            await queryRunner.manager.save(
              this.companyRepo.create({
                ...user.company,
                user: insertedUser,
              }),
            );
          }

          if (user.address) {
            await queryRunner.manager.save(
              this.addressRepo.create({
                ...user.address,
                user: insertedUser,
              }),
            );
          }
        }

        await queryRunner.commitTransaction();

        return {
          statusCode: HttpStatus.OK,
          data: newUsers,
          message: 'User data inserted successfully.',
        };
      } catch (transactionError) {
        await queryRunner.rollbackTransaction();
        throw transactionError;
      } finally {
        await queryRunner.release();
      }
    } catch (err: unknown) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async updateUser(
    reqBody: UpdateUserDto,
    userId: string,
  ): Promise<ISuccessResponse<any>> {
    const user = await this.userRepo.findOne({ where: { id: userId as UUID } });
    if (!user) throw new BadRequestException('User not found.');

    if (reqBody.password)
      reqBody.password = await hashPassword(reqBody.password);

    Object.assign(user, reqBody);
    await this.userRepo.save(user);

    await this.cacheManager.del(`${this.USER_DETAIL_CACHE_PREFIX}${userId}`);
    await this.cacheManager.del(this.ALL_USERS_CACHE_KEY);

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully.',
      data: {},
    };
  }

  async deleteUser(userId: string): Promise<ISuccessResponse<any>> {
    const user = await this.userRepo.findOne({ where: { id: userId as UUID } });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    await this.userRepo.softDelete({ id: userId as UUID });
    await this.cacheManager.del(`${this.USER_DETAIL_CACHE_PREFIX}${userId}`);
    await this.cacheManager.del(this.ALL_USERS_CACHE_KEY);

    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully.',
      data: null,
    };
  }
}
