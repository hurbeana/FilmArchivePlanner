import { DirectorDto } from './director.dto';
import { PartialType } from '@nestjs/mapped-types';

export class SearchDirectorDto extends PartialType(DirectorDto) {
  /***
   * Helper function generates non-empty object for iterations properties
   */
  public static getStringSearch(): SearchDirectorDto {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      //biographyEnglish: null,
      //biographyGerman: null,
      //filmography: null,
    };
  }
}
