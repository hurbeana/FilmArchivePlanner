import { DirectorReference } from '../../directors/models/director-ref';

export interface UploadFileResponseDto {
  destination: string;
  encoding:  string;
  fieldname:  string;
  filename: string;
  id:  string;
  mimetype: string;
  originalname: string;
  path:  string;
  size: string;
}
