import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { DirectorReferenceDto } from '../../directors/dto/director-reference.dto';
import { ContactReferenceDto } from '../../contacts/dto/contact-reference.dto';

export class CreateUpdateMovieDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  originalTitle: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  englishTitle: string;

  //TODO Need to implement movie upload and file matching to DTO

  @AutoMap()
  @IsString()
  movieFile: string; //TODO Replace this with "Path"

  @AutoMap()
  @IsString()
  @IsOptional()
  previewFile?: string; //TODO Replace this with "Path"

  @AutoMap()
  @IsString()
  @IsOptional()
  trailerFile?: string; //TODO Replace this with "Path"

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  stillFiles?: string[]; //TODO Replace this with "Path[]"

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  subtitleFiles?: string[]; //TODO Replace this with "Path[]"

  @AutoMap({ typeFn: () => DirectorReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => DirectorReferenceDto)
  directors: DirectorReferenceDto[];

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  countriesOfProduction?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsOptional()
  @IsInt()
  @IsPositive()
  yearOfProduction?: number;

  @AutoMap()
  @IsInt()
  @IsPositive()
  duration: number;

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  animationTechniques?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  softwareUsed?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  keywords?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  germanSynopsis: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  englishSynopsis: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  submissionCategory: string; //TODO Replace with Tag

  @AutoMap()
  @IsOptional()
  @IsBoolean()
  hasDialog?: boolean;

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  dialogLanguages?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsOptional()
  @IsBoolean()
  hasSubtitles?: boolean;

  @AutoMap()
  @IsBoolean()
  isStudentFilm: boolean;

  @AutoMap()
  @IsOptional()
  @IsString()
  filmSchool?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  script?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  animation?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  editing?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  sound?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  music?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  productionCompany?: string;

  @AutoMap({ typeFn: () => ContactReferenceDto })
  @IsNotEmptyObject()
  contact: ContactReferenceDto;
}
