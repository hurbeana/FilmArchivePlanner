import { SearchDirectorDto } from './search-director.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SearchDirectorPagingDto extends SearchDirectorDto {
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
