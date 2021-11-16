export interface Movie {
  id: Number,
  originalTitle:	string,
  englishTitle:	string,
  movieFile:	string, //TODO Replace this with "Path"
  previewFile?:	string, //TODO Replace this with "Path"
  trailerFile?:	string, //TODO Replace this with "Path"
  stillFiles?:	string[], //TODO Replace this with "Path[]"
  subtitleFiles?:	string[], //TODO Replace this with "Path[]"
  directors:	string[],  //TODO Replace this with "Director[]"
  countriesOfProduction?:	string[], //TODO Replace with Tag[]
  yearOfProduction?:	number,
  duration:	number, //Duration in minutes
  animationTechniques?:	string[], //TODO Replace with Tag[]
  softwareUsed?:	string[], //TODO Replace with Tag[]
  keywords?:	string[], //TODO Replace with Tag[]
  germanSynopsis:	string,
  englishSynopsis:	string,
  submissionCategory:	string,
  hasDialog?:	boolean,
  dialogLanguages?:	string[], //TODO Replace with Tag[]
  hasSubtitles?:	boolean,
  isStudentFilm:	boolean,
  filmSchool?:	string,
  script?:	string,
  animation?:	string,
  editing?:	string,
  sound?:	string,
  music?:	string,
  productionCompany?:	string,
  contact:	string //TODO Replace with Contact
  created_at: Date,
  last_updated: Date,
}
