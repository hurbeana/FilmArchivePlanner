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
import { TagReferenceDto } from '../../tags/dto/tag-reference.dto';

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

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagReferenceDto)
  countriesOfProduction?: TagReferenceDto[];

  @AutoMap()
  @IsOptional()
  @IsInt()
  @IsPositive()
  yearOfProduction?: number;

  @AutoMap()
  @IsInt()
  @IsPositive()
  duration: number;

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagReferenceDto)
  animationTechniques?: TagReferenceDto[];

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagReferenceDto)
  softwareUsed?: TagReferenceDto[];

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagReferenceDto)
  keywords?: TagReferenceDto[];

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  germanSynopsis: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  englishSynopsis: string;

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => TagReferenceDto)
  submissionCategories: TagReferenceDto[]; // TODO allow empty Array like the others???

  @AutoMap()
  @IsOptional()
  @IsBoolean()
  hasDialog?: boolean;

  @AutoMap({ typeFn: () => TagReferenceDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagReferenceDto)
  dialogLanguages?: TagReferenceDto[];

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
