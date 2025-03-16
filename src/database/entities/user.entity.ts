import { UUID } from 'crypto';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IAddress } from '../interfaces/address.interface';
import { ICompany } from '../interfaces/company.interface';
import { ISession } from '../interfaces/session.interface';
import { IUser } from '../interfaces/user.interface';
import { AddressEntity } from './address.entity';
import { BaseEntity } from './base.entity';
import { CompanyEntity } from './company.entity';
import { SessionEntity } from './session.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_user_id',
  })
  id: UUID;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  @Index('UQ_user_username')
  username: string;

  @Column({ type: 'varchar', length: 150 })
  @Index('UQ_user_email')
  email: string;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 150 })
  website: string;

  @OneToMany(() => AddressEntity, (address) => address.user)
  address: IAddress;

  @OneToMany(() => CompanyEntity, (company) => company.user)
  company: ICompany[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  session: ISession[];
}
