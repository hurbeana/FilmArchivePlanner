export interface Director {
  id: Number,
  firstName:	string,
  middleName?:	string,
  lastName:	string,
  biographyEnglish:	string, //TODO Replace this with "Path"
  biographyGerman?:	string, //TODO Replace this with "Path"
  filmography:	string, //TODO Replace this with "Path[]"
}
