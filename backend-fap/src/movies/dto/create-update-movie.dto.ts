import { FileDto } from './../../files/dto/file.dto';
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
  @IsOptional()
  folderId?: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  originalTitle: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  englishTitle: string;

  @AutoMap({ typeFn: () => FileDto })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => FileDto)
  movieFiles?: FileDto[];

  @AutoMap({ typeFn: () => FileDto })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => FileDto)
  dcpFiles?: FileDto[];

  @AutoMap({ typeFn: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  previewFile?: FileDto;

  @AutoMap({ typeFn: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  trailerFile?: FileDto;

  @AutoMap({ typeFn: () => FileDto })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  stillFiles?: FileDto[];

  @AutoMap({ typeFn: () => FileDto })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  subtitleFiles?: FileDto[];

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
