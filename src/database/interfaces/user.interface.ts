import { UUID } from 'crypto';
import { IAddress } from './address.interface';
import { ICompany } from './company.interface';
import { IPost } from './post.interface';
import { ISession } from './session.interface';

export interface IUser {
  id: UUID;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  website: string;
  address: IAddress;
  company: ICompany[];
  post: IPost[];
  session: ISession[];
}
