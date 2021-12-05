import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { GetRemoveEnum } from '../get-remove.enum';

export class GetRemoveFileDto {
  @IsEnum(GetRemoveEnum)
  fileType: GetRemoveEnum;

  @IsInt()
  @IsOptional()
  width?: number;

  @IsInt()
  @IsOptional()
  height?: number;
}
