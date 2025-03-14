import { UUID } from 'crypto';
import { IUser } from './user.interface';

export interface ICompany {
  id: UUID;
  userId: UUID;
  name: string;
  catchPhrase: string;
  bs: string;
  user: IUser;
}
