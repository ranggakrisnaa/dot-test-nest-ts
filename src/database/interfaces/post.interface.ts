import { UUID } from 'crypto';
import { IComment } from './comment.interface';
import { IUser } from './user.interface';

export interface IPost {
  id: UUID;
  userId: UUID;
  title: string;
  body: string;
  user: IUser;
  comment: IComment[];
}
