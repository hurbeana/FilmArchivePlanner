import { PartialType } from '@nestjs/mapped-types';
import { MovieDto } from './movie.dto';

export class SearchMovieDto extends PartialType(MovieDto) {
  /***
   * Helper functions generates non-empty object for iterations properties
   */
  public static getStringSearch(): SearchMovieDto {
    return {
      originalTitle: '',
      englishTitle: '',
      referenceNumber: '',
    };
  }
}
