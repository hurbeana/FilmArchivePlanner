import { SearchTagDto } from './search-tag.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SearchTagPagingDto extends SearchTagDto {
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
