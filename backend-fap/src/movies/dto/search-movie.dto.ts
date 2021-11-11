import { PartialType } from '@nestjs/mapped-types';
import { MovieDto } from './movie.dto';

export class SearchMovieDto extends PartialType(MovieDto) {
  /***
   * Helper functions generates non-empty object for iterations properties
   */
  public static getStringSearch(): SearchMovieDto {
    return {
      animation: '',
      contact: '',
      editing: '',
      englishSynopsis: '',
      englishTitle: '',
      filmSchool: '',
      germanSynopsis: '',
      movieFile: '',
      music: '',
      originalTitle: '',
      previewFile: '',
      productionCompany: '',
      script: '',
      sound: '',
      submissionCategory: '',
      trailerFile: '',
    };
  }
}
