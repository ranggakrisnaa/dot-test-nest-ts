import { UUID } from 'crypto';
import { IUser } from './user.interface';

export interface IPost {
  id: UUID;
  userId: UUID;
  title: string;
  body: string;
  user: IUser;
}
