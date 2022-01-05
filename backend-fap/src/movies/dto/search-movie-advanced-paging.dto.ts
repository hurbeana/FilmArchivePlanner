import {
  IsArray,
  IsInt,
  isMultibyte,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SearchMovieDto } from './search-movie.dto';

export class SearchMovieAdvancedPagingDto extends SearchMovieDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsArray()
  selectedTagIDs: number[];

  @IsOptional()
  @IsArray()
  negativeTagIDs: number[];

  @IsOptional()
  @IsNumber()
  exactYear: number;

  @IsOptional()
  @IsNumber()
  fromYear: number;

  @IsOptional()
  @IsNumber()
  toYear: number;

  @IsOptional()
  @IsNumber()
  exactLength: number;

  @IsOptional()
  @IsNumber()
  fromLength: number;

  @IsOptional()
  @IsNumber()
  toLength: number;

  @IsNumber()
  hasDialogue: number;

  @IsNumber()
  hasSubtitles_: number;

  @IsNumber()
  isStudentFilm_: number;

  @IsNumber()
  hasDCP: number;

  @IsOptional()
  @IsArray()
  selectedDirectorIDs: number[];

  @IsOptional()
  @IsArray()
  selectedContactIDs: number[];
}
