import {
  IsString,
  IsUrl,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateAppDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  interval?: number;

  @IsOptional()
  @IsNumber()
  expectedStatus?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
