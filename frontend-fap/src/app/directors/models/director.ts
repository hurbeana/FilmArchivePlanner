import { FileDto } from "../../shared/models/file";

export interface Director {
  id: Number,
  firstName:	string,
  middleName?:	string,
  lastName:	string,
  biographyEnglish:	FileDto,
  biographyGerman?:	FileDto,
  filmography?:	FileDto,
}
