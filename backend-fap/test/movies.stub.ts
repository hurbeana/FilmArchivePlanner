import { Movie } from '../src/movies/entities/movie.entity';

export const moviesListStub = (): Array<Movie> => {
  return [
    {
      id: 0,
      originalTitle: 'Titanic',
      englishTitle: 'Titanic',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 1,
      originalTitle: 'Fight Club',
      englishTitle: 'Fight Club',
      movieFile: '/path/to/some/otherMovieFile.mov',
      previewFile: '/path/to/some/otherPreviewFile.mov',
      stillFiles: ['/path/to/some/fight.mov', '/path/to/some/club.mov'],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['David Fincher'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1999,
      duration: 139, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [
        'based on novel or book',
        'support group',
        'dual identity',
        'nihilism',
        'fight',
        'rage and hate',
        'insomnia',
        'dystopia',
      ],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 2,
      originalTitle: 'Pulp Fiction',
      englishTitle: 'Pulp Fiction',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 3,
      originalTitle: 'Sieben',
      englishTitle: 'Seven',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 4,
      originalTitle: 'Matrix',
      englishTitle: 'Matrix',
      movieFile: '/path/to/some/Matrix.mov',
      previewFile: '/path/to/some/Matrix.mov',
      stillFiles: ['/path/to/some/Matrix.mov', '/path/to/some/Matrix2.mov'],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 5,
      originalTitle: 'Dark Knight',
      englishTitle: 'Dark Knight',
      movieFile: '/path/to/some/Knight.mov',
      previewFile: '/path/to/some/Knight.mov',
      stillFiles: ['/path/to/some/Knight.mov', '/path/to/some/stillFile2.mov'],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 2000,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 6,
      originalTitle: 'Forrest Gump',
      englishTitle: 'Forrest Gump',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 7,
      originalTitle: 'Die Verurteilten',
      englishTitle: 'The Shawshank Redemtion',
      movieFile: '/path/to/some/shaw.mov',
      previewFile: '/path/to/some/shaw.mov',
      stillFiles: [
        '/path/to/some/trailerShaw1.mov',
        '/path/to/some/trailerShaw2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 8,
      originalTitle: 'Inglorious Basterds',
      englishTitle: 'Inglorious Basterds',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 9,
      originalTitle: 'Django Unchained',
      englishTitle: 'Django Unchained',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 10,
      originalTitle: 'Django Unchained',
      englishTitle: 'Django Unchained',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 11,
      originalTitle: 'Django Unchained',
      englishTitle: 'Django Unchained',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 12,
      originalTitle: 'Django Unchained',
      englishTitle: 'Django Unchained',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
    {
      id: 13,
      originalTitle: 'Django Unchained',
      englishTitle: 'Django Unchained',
      movieFile: '/path/to/some/movieFile.mov',
      previewFile: '/path/to/some/previewFile.mov',
      stillFiles: [
        '/path/to/some/stillFile1.mov',
        '/path/to/some/stillFile2.mov',
      ],
      subtitleFiles: ['/path/to/some/subtitleFolder'],
      directors: ['James Cameron'],
      countriesOfProduction: ['United States'],
      yearOfProduction: 1997,
      duration: 194, //Duration in minutes
      animationTechniques: [],
      softwareUsed: [],
      keywords: [],
      germanSynopsis: 'Bissl Synopis hier rein',
      englishSynopsis: 'Some synopis goes here',
      submissionCategory: 'Drama',
      hasDialog: true,
      dialogLanguages: ['German', 'French', 'English'],
      hasSubtitles: false,
      isStudentFilm: false,
      filmSchool: '',
      script: 'Script here',
      animation: 'String',
      editing: '',
      sound: '',
      music: '',
      productionCompany: '',
      contact: '',
      created_at: undefined,
      last_updated: undefined,
    },
  ];
};
