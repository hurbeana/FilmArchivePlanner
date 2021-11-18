import { AutoMap } from '@automapper/classes';
import { IsOptional, IsString } from 'class-validator';

export class CreateUpdateDirectorDto {
  @AutoMap()
  @IsString()
  firstName: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  middleName?: string;

  @AutoMap()
  @IsString()
  lastName: string;

  @AutoMap()
  @IsString()
  biographyEnglish: string; //TODO Replace this with "Path"

  @AutoMap()
  @IsString()
  @IsOptional()
  biographyGerman?: string; //TODO Replace this with "Path"

  @AutoMap()
  @IsString()
  @IsOptional()
  filmography?: string; //TODO Replace this with "Path"
}
