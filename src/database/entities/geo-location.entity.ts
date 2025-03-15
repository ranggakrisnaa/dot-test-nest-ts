import { UUID } from 'crypto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IAddress } from '../interfaces/address.interface';
import { IGeoLocation } from '../interfaces/geo-location.interface';
import { AddressEntity } from './address.entity';

@Entity('geo_locations')
export class GeoLocationEntity extends BaseEntity implements IGeoLocation {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK geo_location_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'address_id' })
  addressId: UUID;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longtitude: number;

  @JoinColumn({
    name: 'address_id',
    foreignKeyConstraintName: 'id',
  })
  @ManyToOne(() => AddressEntity, (address) => address.geoLocation)
  address: IAddress;
}
