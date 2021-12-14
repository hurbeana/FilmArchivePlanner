import { FileDto } from '../../shared/models/file';

export interface Director {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  biographyEnglish: FileDto;
  biographyGerman?: FileDto;
  filmography?: FileDto;
  created_at: string;
}
