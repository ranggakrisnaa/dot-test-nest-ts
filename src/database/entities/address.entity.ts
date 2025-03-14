import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { IAddress } from '../interfaces/address.interface';
import { IGeoLocation } from '../interfaces/geo-location.interface';
import { IUser } from '../interfaces/user.interface';
import { BaseEntity } from './base.entity';
import { GeoLocationEntity } from './geo-location.entity';
import { UserEntity } from './user.entity';

@Entity('addresses')
export class AddressEntity extends BaseEntity implements IAddress {
  @PrimaryColumn('uuid', {
    primaryKeyConstraintName: 'PK_address_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: UUID;

  @Column({ type: 'varchar', length: 100 })
  suite: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 20, name: 'zip_code' })
  zipCode: string;

  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'id',
  })
  @ManyToOne(() => UserEntity, (user) => user.address)
  user: IUser;

  @OneToMany(() => GeoLocationEntity, (geoLocation) => geoLocation.address)
  geoLocation: IGeoLocation[];
}
