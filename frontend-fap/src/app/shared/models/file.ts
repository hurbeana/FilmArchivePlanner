import { DirectorReference } from '../../directors/models/director-ref';

export interface FileDto {
  id?: string;
  path?: string;
  filename?: string;
  mimetype?: string;
}

export const fileTypes: { [key: string]: string; } = {
  movieFiles: 'movie_file',
  dcpFiles: 'dcp_file',
  previewFile: 'preview_file',
  trailerFile: 'trailer_file',
  stillFiles: 'still_file',
  subtitleFiles: 'subtitle_file',
  biographyEnglish: 'biography_english_file',
  biographyGerman: 'biography_german_file',
  filmography: 'filmography_file',
}
