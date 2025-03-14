import { UUID } from 'crypto';
import { IAddress } from './address.interface';

export interface IGeoLocation {
  id: UUID;
  addressId: UUID;
  latitude: number;
  longtitude: number;
  address: IAddress;
}
