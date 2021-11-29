import { CreateUpdateContactDto } from './create-update-contact.dto';
import { AutoMap } from '@automapper/classes';
import { IsNumber } from 'class-validator';

export class ContactDto extends CreateUpdateContactDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  created_at: Date;

  @AutoMap()
  last_updated: Date;
}
