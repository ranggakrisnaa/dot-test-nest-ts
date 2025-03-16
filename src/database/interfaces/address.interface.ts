import { UUID } from 'crypto';
import { IUser } from './user.interface';

export interface IAddress {
  id: UUID;
  userId: UUID;
  user: IUser;
  suite: string;
  city: string;
  zipcode: string;
}
