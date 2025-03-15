import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ISession } from '../interfaces/session.interface';
import { IUser } from '../interfaces/user.interface';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('sessions')
export class SessionEntity extends BaseEntity implements ISession {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_session_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: UUID;

  @Column({ type: 'text', name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'varchar', length: 50, name: 'ip_address' })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255 })
  device: string;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: IUser;
}
