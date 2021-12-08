import { DirectorReference } from '../../directors/models/director-ref';
import { FileDto } from "../../shared/models/file";

export interface Movie {
  id: Number;
  originalTitle: string;
  englishTitle: string;
  movieFiles?: FileDto[];
  dcpFiles?: FileDto[];
  previewFile?: FileDto;
  trailerFile?: FileDto;
  stillFiles?: FileDto[];
  subtitleFiles?: FileDto[];
  directors: DirectorReference[];
  countriesOfProduction?: string[]; //TODO Replace with Tag[]
  yearOfProduction?: number;
  duration: number; //Duration in minutes
  animationTechniques?: string[]; //TODO Replace with Tag[]
  softwareUsed?: string[]; //TODO Replace with Tag[]
  keywords?: string[]; //TODO Replace with Tag[]
  germanSynopsis: string;
  englishSynopsis: string;
  submissionCategory: string;
  hasDialog?: boolean;
  dialogLanguages?: string[]; //TODO Replace with Tag[]
  hasSubtitles?: boolean;
  isStudentFilm: boolean;
  filmSchool?: string;
  script?: string;
  animation?: string;
  editing?: string;
  sound?: string;
  music?: string;
  productionCompany?: string;
  contact: string; //TODO Replace with Contact
  created_at: Date;
  last_updated: Date;
}
