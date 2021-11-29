import { AutoMap } from '@automapper/classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ContactReferenceDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  name?: string;
}
