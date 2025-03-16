import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { hashPassword } from '../../utils/password.util';
import { AddressEntity } from '../entities/address.entity';
import { CompanyEntity } from '../entities/company.entity';
import { UserEntity } from '../entities/user.entity';

export class UserSeeders1742102223680 implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserEntity);
    const addressRepository = dataSource.getRepository(AddressEntity);
    const companyRepository = dataSource.getRepository(CompanyEntity);

    const hashedPassword = await hashPassword('12345');

    const user = userRepository.create({
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      phone: '1-463-123-4447',
      website: 'ramiro.info',
      password: hashedPassword,
    });
    const newUser = await userRepository.save(user);

    const address = addressRepository.create({
      street: 'Douglas Extension',
      suite: 'Suite 847',
      city: 'McKenziehaven',
      zipcode: '59590-4157',
      userId: newUser.id,
    });
    await addressRepository.save(address);

    const company = companyRepository.create({
      name: 'Romaguera-Jacobson',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications',
      userId: newUser.id,
    });
    await companyRepository.save(company);
  }
}
