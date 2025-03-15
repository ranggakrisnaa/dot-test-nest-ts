import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  suite: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  zipCode: string;
}
