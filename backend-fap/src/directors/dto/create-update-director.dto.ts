import { AutoMap } from '@automapper/classes';
import { IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto } from '../../files/dto/file.dto';

export class CreateUpdateDirectorDto {
  @AutoMap()
  @IsString()
  @IsOptional()
  folderId: string;

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

  @AutoMap({ typeFn: () => FileDto })
  @Type(() => FileDto)
  @IsNotEmptyObject()
  biographyEnglish: FileDto;

  @AutoMap({ typeFn: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  biographyGerman?: FileDto;

  @AutoMap({ typeFn: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  filmography?: FileDto;
}
