import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class CreateUpdateMovieDto {
  @AutoMap()
  @IsString()
  originalTitle: string;

  @AutoMap()
  @IsString()
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

  @AutoMap()
  @IsString({ each: true })
  directors: string[]; //TODO Add directress

  @AutoMap()
  @IsOptional()
  @IsString({ each: true })
  countriesOfProduction?: string[]; //TODO Replace with Tag[]

  @AutoMap()
  @IsOptional()
  @IsInt()
  yearOfProduction?: number;

  @AutoMap()
  @IsInt()
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
  germanSynopsis: string;

  @AutoMap()
  @IsString()
  englishSynopsis: string;

  @AutoMap()
  @IsString()
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

  @AutoMap()
  @IsString()
  contact: string; //TODO Change to Contact type
}
