import { ContactDto } from './contact.dto';
import { PartialType } from '@nestjs/mapped-types';

export class SearchContactDto extends PartialType(ContactDto) {
  /***
   * Helper function generates non-empty object for iterations properties
   */
  public static getStringSearch(): {
    type: string;
    name: string;
    email: string;
    phone: string;
    website: string;
  } {
    return {
      type: '',
      name: '',
      email: '',
      phone: '',
      website: '',
    };
  }
}
