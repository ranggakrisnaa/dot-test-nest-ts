import { UUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ICompany } from '../interfaces/company.interface';
import { IUser } from '../interfaces/user.interface';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('companies')
export class CompanyEntity extends BaseEntity implements ICompany {
  @PrimaryColumn('uuid', {
    primaryKeyConstraintName: 'PK_company_id',
  })
  id: UUID;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: UUID;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  catchPhrase: string;

  @Column({ type: 'varchar', length: 100 })
  bs: string;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => UserEntity, (user) => user.company)
  user: IUser;
}
