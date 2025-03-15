import { IsOptional, IsString } from 'class-validator';

export class GeoLocationDto {
  @IsString()
  @IsOptional()
  latitude: string;

  @IsString()
  @IsOptional()
  longtitude: string;
}
