import { AutoMap } from '@automapper/classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DirectorReferenceDto {
  @AutoMap()
  @IsNumber()
  id: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  fullName?: string;
}
