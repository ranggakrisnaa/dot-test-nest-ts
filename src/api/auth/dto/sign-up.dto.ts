import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
import { AddressDto } from './address.dto';
import { CompanyDto } from './company.dto';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsObject()
  @IsOptional()
  company: CompanyDto;

  @IsObject()
  @IsOptional()
  address: AddressDto;
}
