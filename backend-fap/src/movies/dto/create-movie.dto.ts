import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  originalTitle: String;

  @IsString()
  englishTitle: String;

  //TODO Need to implement movie upload and file matching to DTO

  @IsString()
  movieFile: String; //TODO Replace this with "Path"

  @IsString()
  @IsOptional()
  previewFile?: String; //TODO Replace this with "Path"

  @IsString()
  @IsOptional()
  trailerFile?: String; //TODO Replace this with "Path"

  @IsOptional()
  @IsString({ each: true })
  stillFiles?: String[]; //TODO Replace this with "Path[]"

  @IsOptional()
  @IsString({ each: true })
  subtitleFiles?: String[]; //TODO Replace this with "Path[]"

  @IsOptional()
  @IsString({ each: true })
  directors?: String[]; //TODO Add directress

  @IsOptional()
  @IsString({ each: true })
  countriesOfProduction?: String[]; //TODO Replace with Tag[]

  @IsOptional()
  @IsInt()
  yearOfProduction?: number;

  @IsInt()
  duration: number;

  @IsOptional()
  @IsString({ each: true })
  animationTechniques?: String[]; //TODO Replace with Tag[]

  @IsOptional()
  @IsString({ each: true })
  softwareUsed?: String[]; //TODO Replace with Tag[]

  @IsOptional()
  @IsString({ each: true })
  keywords?: String[]; //TODO Replace with Tag[]

  @IsString()
  germanSynopsis: String;

  @IsString()
  englishSynopsis: String;

  @IsString()
  submissionCategory: String; //TODO Replace with Tag

  @IsOptional()
  @IsBoolean()
  hasDialog?: Boolean;

  @IsOptional()
  @IsString({ each: true })
  dialogLanguages?: String[]; //TODO Replace with Tag[]

  @IsOptional()
  @IsBoolean()
  hasSubtitles?: Boolean;

  @IsBoolean()
  isStudentFilm: Boolean;

  @IsOptional()
  @IsString()
  filmSchool?: String;

  @IsOptional()
  @IsString()
  script?: String;

  @IsOptional()
  @IsString()
  animation?: String;

  @IsOptional()
  @IsString()
  editing?: String;

  @IsOptional()
  @IsString()
  sound?: String;

  @IsOptional()
  @IsString()
  music?: String;

  @IsOptional()
  @IsString()
  productionCompany?: String;

  //contact: Contact; //TODO Add contact
}
