import { TagDto } from './tag.dto';
import { PartialType } from '@nestjs/mapped-types';

export class SearchTagDto extends PartialType(TagDto) {
  /***
   * Helper function generates non-empty object for iterations properties
   */
  public static getStringSearch(): {
    value: string;
    type: string;
  } {
    return {
      value: '',
      type: '',
    };
  }
}
