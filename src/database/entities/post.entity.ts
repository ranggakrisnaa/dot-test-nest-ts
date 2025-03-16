import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPost } from '../interfaces/post.interface';
import { IUser } from '../interfaces/user.interface';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('posts')
export class PostEntity extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_post_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: UUID;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => UserEntity, (user) => user.post)
  user: IUser;
}
