import { UUID } from 'crypto';
import { IUser } from './user.interface';

export interface ISession {
  id: UUID;
  userId: UUID;
  refreshToken: string;
  device: string;
  ipAddress: string;
  user: IUser;
}
