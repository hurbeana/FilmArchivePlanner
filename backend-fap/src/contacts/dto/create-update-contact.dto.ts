import { AutoMap } from '@automapper/classes';
import { IsOptional, IsString } from 'class-validator';

export class CreateUpdateContactDto {
  @AutoMap()
  @IsString()
  type: string; //TODO Replace this with "Tag"

  @AutoMap()
  @IsString()
  name: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  email?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  phone?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  website?: string;
}
