import { IsInt, IsOptional, IsString } from 'class-validator';
import { SearchMovieDto } from './search-movie.dto';

export class SearchMoviePagingDto extends SearchMovieDto {
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
  searchString: string;
}
