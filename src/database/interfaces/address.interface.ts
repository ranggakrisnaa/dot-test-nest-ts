import { UUID } from 'crypto';
import { IGeoLocation } from './geo-location.interface';
import { IUser } from './user.interface';

export interface IAddress {
  id: UUID;
  userId: UUID;
  user: IUser;
  suite: string;
  city: string;
  zipCode: string;
  geoLocation: IGeoLocation[];
}
