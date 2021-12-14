import { DirectorReference } from '../../directors/models/director-ref';
import { FileDto } from '../../shared/models/file';
import { Tag } from '../../tags/models/tag';
import { Contact } from '../../contacts/models/contact';

export interface Movie {
  id: number;
  originalTitle: string;
  englishTitle: string;
  movieFiles?: FileDto[];
  dcpFiles?: FileDto[];
  previewFile?: FileDto;
  trailerFile?: FileDto;
  stillFiles?: FileDto[];
  subtitleFiles?: FileDto[];
  directors: DirectorReference[];
  countriesOfProduction?: Tag[];
  yearOfProduction?: number;
  duration: number; //Duration in minutes
  animationTechniques?: Tag[];
  softwareUsed?: Tag[];
  keywords?: Tag[];
  germanSynopsis: string;
  englishSynopsis: string;
  submissionCategory: Tag[];
  hasDialog?: boolean;
  dialogLanguages?: Tag[];
  hasSubtitles?: boolean;
  isStudentFilm: boolean;
  filmSchool?: string;
  script?: string;
  animation?: string;
  editing?: string;
  sound?: string;
  music?: string;
  productionCompany?: string;
  contact: Contact;
  created_at: Date;
  last_updated: Date;
}
