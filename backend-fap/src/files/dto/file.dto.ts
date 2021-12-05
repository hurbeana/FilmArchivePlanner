import { AutoMap } from '@automapper/classes';
import { Allow, IsOptional, IsString } from 'class-validator';

export class FileDto {
  @AutoMap()
  @Allow()
  id?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  path?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  filename?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  mimetype?: string;
}
