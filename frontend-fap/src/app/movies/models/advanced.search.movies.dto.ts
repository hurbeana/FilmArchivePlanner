import { DirectorReference } from '../../directors/models/director-ref';
import { FileDto } from '../../shared/models/file';
import { Tag } from '../../tags/models/tag';
import { Contact } from '../../contacts/models/contact';

export interface AdvancedSearchMoviesDto {
  page: number;
  limit: number;
  orderBy?: string;
  sortOrder?: string;
  searchString?: string;
  selectedTagIDs?: number[];
  negativeTagIDs?: number[];
  exactYear?: number;
  fromYear?: number;
  toYear?: number;
  exactLength?: number;
  fromLength?: number;
  toLength?: number;
  hasDialogue?: number;
  hasSubtitles?: number;
  isStudentFilm?: number;
  hasDCP?: number;
  selectedDirectorIDs?: number[];
  selectedContactIDs?: number[];
}
