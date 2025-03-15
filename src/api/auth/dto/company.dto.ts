import { IsOptional, IsString } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  catchPhrease: string;

  @IsString()
  @IsOptional()
  bs: string;
}
