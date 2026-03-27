import { IsString, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class CreateAppDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
