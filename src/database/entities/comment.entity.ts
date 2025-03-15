import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IComment } from '../interfaces/comment.interface';
import { IPost } from '../interfaces/post.interface';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity implements IComment {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_comment_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'post_id' })
  postId: UUID;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'text' })
  body: string;

  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  @ManyToOne(() => PostEntity, (post) => post.comment)
  post: IPost;
}
