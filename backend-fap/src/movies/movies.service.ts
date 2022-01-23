import { IFsService } from '../files/interfaces/fs-service.interface';
import { Movie } from './entities/movie.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import {
  Between,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { MovieDto } from './dto/movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Director } from '../directors/entities/director.entity';
import { DirectorReferenceDto } from '../directors/dto/director-reference.dto';
import { mapFrom } from '@automapper/core';
import { DirectorsService } from '../directors/directors.service';
import { ContactReferenceDto } from '../contacts/dto/contact-reference.dto';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { TagType } from '../tags/tagtype.enum';
import { FILES_PERSISTENCY_PROVIDER } from '../files/files.constants';
import { FileDto } from '../files/dto/file.dto';
import { File } from '../files/entities/file.entity';
import {
  DCPFile,
  MovieFile,
  PreviewFile,
  StillFile,
  SubtitleFile,
  TrailerFile,
} from './entities/moviefiles.entity';
import { join } from 'path';
import { MOVIEROOTFOLDER } from './movies.constants';
import { MovieFilesFolder } from './movies.enum';
import * as namor from 'namor';

/**
 * Service for movies CRUD
 */
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(MovieFile)
    private movieFilesRepository: Repository<MovieFile>,
    @InjectRepository(DCPFile)
    private dcpFilesRepository: Repository<DCPFile>,
    @InjectRepository(PreviewFile)
    private previewFilesRepository: Repository<PreviewFile>,
    @InjectRepository(TrailerFile)
    private trailerFilesRepository: Repository<TrailerFile>,
    @InjectRepository(StillFile)
    private stillFilesRepository: Repository<StillFile>,
    @InjectRepository(SubtitleFile)
    private subtitlesFilesRepository: Repository<SubtitleFile>,
    @InjectMapper()
    private mapper: Mapper,
    private readonly directorsService: DirectorsService,
    private readonly contactsService: ContactsService,
    private readonly tagsService: TagsService,
    @Inject(FILES_PERSISTENCY_PROVIDER)
    private filesServices: IFsService,
  ) {
    this.mapper.createMap(Director, DirectorReferenceDto).forMember(
      (destination) => destination.fullName,
      mapFrom((source) => source.firstName + ' ' + source.lastName),
    );
    this.mapper.createMap(Contact, ContactReferenceDto);
    this.mapper.createMap(Tag, TagReferenceDto);
    this.mapper.createMap(Movie, MovieDto);
    this.mapper.createMap(MovieFile, FileDto);
    this.mapper.createMap(DCPFile, FileDto);
    this.mapper.createMap(PreviewFile, FileDto);
    this.mapper.createMap(TrailerFile, FileDto);
    this.mapper.createMap(StillFile, FileDto);
    this.mapper.createMap(SubtitleFile, FileDto);
  }

  private readonly logger = new Logger(MoviesService.name);

  private async createFiles(
    createUpdateMovieDto: CreateUpdateMovieDto,
  ): Promise<Movie> {
    // generate basepath for this movie
    const basePath = join(
      MOVIEROOTFOLDER,
      `${createUpdateMovieDto.originalTitle.replace(/ /g, '_')}-${
        createUpdateMovieDto.folderId
      }`,
    );

    // TODO: I think this check for undefined may not work correctly
    // check if cached files to be commited contain duplicates and if there are any throw an exception
    const allFiles = []
      .concat(
        createUpdateMovieDto.movieFiles,
        createUpdateMovieDto.dcpFiles,
        createUpdateMovieDto.previewFile,
        createUpdateMovieDto.trailerFile,
        createUpdateMovieDto.stillFiles,
        createUpdateMovieDto.subtitleFiles,
      )
      .filter((x) => x);

    const allFileNames = [];
    const duplicateNames = new Set<string>();

    // duplicates can be cached file to cached file and cached file to already persisted file (when updating a movie)
    for (const file of allFiles) {
      if (file !== undefined) {
        if (file.path === undefined) {
          const cachedFileInfo = await this.filesServices.getCachedInfo(
            file.id,
          );
          if (cachedFileInfo == null) {
            this.logger.error(`Cached file with id <${file.id}> not found`);
            throw new BadRequestException(`Failed uploading files`);
          }
          const cachedFileName = cachedFileInfo.originalname;
          allFileNames.push(cachedFileName);
        } else {
          allFileNames.push(file.filename);
        }
      }
    }

    for (let i = 0; i < allFileNames.length; i++) {
      for (let j = 0; j < allFileNames.length; j++) {
        if (i === j) continue;
        if (allFileNames[i] === allFileNames[j]) {
          duplicateNames.add(allFileNames[i]);
        }
      }
    }

    if (duplicateNames.size > 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Two or more files have the same name.',
          files: Array.from(duplicateNames.values()),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // helper function to commit only cached files, may be extracted to a utiltiy service
    const commitFiles = async <T extends File>(
      basePath: string,
      fileDtos: FileDto[],
      repository: Repository<File>,
      folder = '',
    ): Promise<T[]> => {
      if (!fileDtos || !fileDtos[0]) {
        return [];
      }
      const entities = [];
      const cachedFileDtos = fileDtos.filter((file) => file.path === undefined);
      const storedFileDtos = fileDtos.filter((file) => file.path !== undefined);
      for (const fileDto of cachedFileDtos) {
        const path = [basePath];
        if (folder !== '') path.push(folder);
        this.logger.log('Calling fileservices with');
        const resultDto = await this.filesServices.commitFile(
          fileDto.id as string,
          path,
        );
        const entity = await repository.save(
          repository.create(resultDto as any),
        );
        entities.push(entity);
      }
      return [...storedFileDtos, ...entities] as T[];
    };

    // were good, commit all files
    const movieFiles = await commitFiles<MovieFile>(
      basePath,
      createUpdateMovieDto.movieFiles,
      this.movieFilesRepository,
      MovieFilesFolder.MOVIEFILES,
    );

    const dcpFiles = await commitFiles<DCPFile>(
      basePath,
      createUpdateMovieDto.dcpFiles,
      this.dcpFilesRepository,
      MovieFilesFolder.DCPFILES,
    );

    const previewFile = (
      await commitFiles<PreviewFile>(
        basePath,
        [createUpdateMovieDto.previewFile],
        this.previewFilesRepository,
        MovieFilesFolder.PREVIEWFILE,
      )
    )[0];
    const trailerFile = (
      await commitFiles<TrailerFile>(
        basePath,
        [createUpdateMovieDto.trailerFile],
        this.trailerFilesRepository,
        MovieFilesFolder.TRAILERFILE,
      )
    )[0];
    const stillFiles = await commitFiles<StillFile>(
      basePath,
      createUpdateMovieDto.stillFiles,
      this.stillFilesRepository,
      MovieFilesFolder.STILLFILES,
    );
    const subtitleFiles = await commitFiles<SubtitleFile>(
      basePath,
      createUpdateMovieDto.subtitleFiles,
      this.subtitlesFilesRepository,
      MovieFilesFolder.SUBTITLEFILES,
    );

    // create the new movie
    return this.moviesRepository.create({
      ...createUpdateMovieDto,
      movieFiles,
      dcpFiles,
      previewFile,
      trailerFile,
      stillFiles,
      subtitleFiles,
    });
  }

  /**
   * Saves a movie to the database
   * @param createMovieDto The movie to save
   * @returns {Promise<MovieDto>} The created movie, including id and timestamps
   */
  async create(createMovieDto: CreateUpdateMovieDto): Promise<MovieDto> {
    await this.checkIfReferencedDirectorsExist(createMovieDto.directors);
    await this.checkIfReferencedContactExists(createMovieDto.contact);
    await this.checkIfReferencedTagsExist(createMovieDto);

    // create folderId for unique folders
    createMovieDto.folderId = namor.generate();

    let createdMovie: MovieDto;
    if (
      createMovieDto.movieFiles ||
      createMovieDto.dcpFiles ||
      createMovieDto.stillFiles ||
      createMovieDto.subtitleFiles ||
      createMovieDto.trailerFile ||
      createMovieDto.previewFile
    ) {
      createdMovie = await this.moviesRepository.save(
        await this.createFiles(createMovieDto),
      );
    } else {
      const movieParam = this.moviesRepository.create(createMovieDto);
      createdMovie = await this.moviesRepository.save(movieParam);
    }
    return this.findOne(createdMovie.id);
  }

  /**
   * Retrieve Movie List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchString searchString
   * @param whereDictAdvanced
   * @param advanced: boolean = false
   * @returns {Promise<Pagination<MovieDto>>} The movies in a paginated form
   */
  async find(
    options: IPaginationOptions,
    search: SearchMovieDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchString: string,
    whereDictAdvanced?: any,
    advanced = false,
  ): Promise<Pagination<MovieDto>> {
    let whereObj = [];
    let orderObj = {};
    if (searchString) {
      // searchString higher prio
      whereObj = Object.keys(SearchMovieDto.getStringSearch()).map((k) => ({
        [k]: ILike('%' + searchString + '%'),
      }));
    } else if (search) {
      whereObj = Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .map(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            return { [k]: v };
          } else if (typeof v === 'string') {
            return { [k]: ILike('%' + v + '%') };
          } else {
            //TODO: more types?
          }
        });
    }

    if (whereDictAdvanced) {
      //combine advanced filter with simple string search
      const whereObjAdvanced = [];
      whereObj.forEach((x) =>
        whereObjAdvanced.push(Object.assign({}, x, whereDictAdvanced)),
      );
      whereObj = whereObjAdvanced;
      if (whereObj.length == 0) whereObj.push(whereDictAdvanced); //no query -> other filters still need to be added
    }

    if (sortOrder && orderBy) {
      orderObj = { [orderBy]: sortOrder.toUpperCase() };
    } else {
      orderObj = { created_at: 'DESC' };
    }

    if (advanced) {
      return paginate<Movie>(this.moviesRepository, options, {
        relations: [
          'directors',
          'contact',
          'countriesOfProduction',
          'animationTechniques',
          'softwareUsed',
          'keywords',
          'submissionCategories',
          'dialogLanguages',
          'selectionTags',
        ],
        where: whereObj,
        order: orderObj,
      }).then((page) => {
        return new Pagination<MovieDto>(
          page.items.map((entity) => this.mapMovieToDto(entity)),
          page.meta,
          page.links,
        );
      });
    } else {
      return paginate<Movie>(this.moviesRepository, options, {
        relations: ['contact'],
        where: whereObj,
        order: orderObj,
      }).then((page) => {
        return new Pagination<MovieDto>(
          page.items.map((entity) => this.mapMovieToDto(entity)),
          page.meta,
          page.links,
        );
      });
    }
  }

  async findAdvanced(
    options: IPaginationOptions,
    search: SearchMovieDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchString: string,
    selectedTagIDs: number[],
    negativeTagIDs: number[],
    exactYear: number,
    fromYear: number,
    toYear: number,
    exactLength: number,
    fromLength: number,
    toLength: number,
    hasDialogue: number,
    hasSubtitles: number,
    isStudentFilm: number,
    hasDCP: number,
    selectedDirectorIDs: number[],
    selectedContactIDs: number[],
  ): Promise<Pagination<MovieDto>> {
    const whereDict = {}; //contains filter criteria that are executed directly in DB -> performance improvement

    if (exactYear != -1) whereDict['yearOfProduction'] = exactYear;
    if (fromYear != -1)
      whereDict['yearOfProduction'] = MoreThanOrEqual(fromYear);
    if (toYear != -1) whereDict['yearOfProduction'] = LessThanOrEqual(toYear);
    if (fromYear != -1 && toYear != -1)
      whereDict['yearOfProduction'] = Between(fromYear, toYear);
    if (exactLength != -1) whereDict['duration'] = exactLength;
    if (fromLength != -1) whereDict['duration'] = MoreThanOrEqual(fromLength);
    if (toLength != -1) whereDict['duration'] = LessThanOrEqual(toLength);
    if (fromLength != -1 && toLength != -1)
      whereDict['duration'] = Between(fromLength, toLength);
    if (hasDialogue == 1) whereDict['hasDialog'] = 1;
    if (hasDialogue == 2) whereDict['hasDialog'] = 0;
    if (hasSubtitles == 1) whereDict['hasSubtitles'] = 1;
    if (hasSubtitles == 2) whereDict['hasSubtitles'] = 0;
    if (isStudentFilm == 1) whereDict['isStudentFilm'] = 1;
    if (isStudentFilm == 2) whereDict['isStudentFilm'] = 0;

    //call find() with large limit to receive all movies at once (and not just first page)
    const page = options.page;
    options.page = 1;
    const limit = options.limit;
    options.limit = 1000000;

    return this.find(
      options,
      search,
      orderBy,
      sortOrder,
      searchString,
      whereDict,
      true,
    ).then((result) => {
      const movies: MovieDto[] = [];

      result.items.forEach((movie) => {
        //filter each movie according to more complex criteria
        const allTagIDs: number[] = []; //get all tag IDs associated to movie
        movie.animationTechniques.forEach((tag) => allTagIDs.push(tag.id));
        movie.submissionCategories.forEach((tag) => allTagIDs.push(tag.id));
        movie.countriesOfProduction.forEach((tag) => allTagIDs.push(tag.id));
        movie.dialogLanguages.forEach((tag) => allTagIDs.push(tag.id));
        movie.keywords.forEach((tag) => allTagIDs.push(tag.id));
        movie.softwareUsed.forEach((tag) => allTagIDs.push(tag.id));
        movie.selectionTags.forEach((tag) => allTagIDs.push(tag.id));

        let posTags = false;
        let negTags = true;
        allTagIDs.forEach((tag) => {
          //check if at least one pos tag and no neg tags are in movie
          if (selectedTagIDs && selectedTagIDs.includes(tag)) {
            posTags = true;
          }
          if (negativeTagIDs && negativeTagIDs.includes(tag)) negTags = false;
        });

        const allDirectorIDs: number[] = []; //get all dir IDs associated to movie
        movie.directors.forEach((dir) => allDirectorIDs.push(dir.id));
        let director = false;
        allDirectorIDs.forEach((dir) => {
          if (
            selectedDirectorIDs &&
            dir != -1 &&
            selectedDirectorIDs.includes(dir)
          )
            director = true;
        });

        //check for all filter criteria
        if (selectedTagIDs && !posTags) return;
        if (negativeTagIDs && !negTags) return;
        //if (exactYear != -1 && movie.yearOfProduction != exactYear) return;
        //if (fromYear != -1 && movie.yearOfProduction < fromYear) return;
        //if (toYear != -1 && movie.yearOfProduction > toYear) return;
        //if (exactLength != -1 && movie.duration != exactLength) return;
        //if (fromLength != -1 && movie.duration < fromLength) return;
        //if (toLength != -1 && movie.duration > toLength) return;
        //if (hasDialogue == 1 && !movie.hasDialog) return;
        //if (hasDialogue == 2 && movie.hasDialog) return;
        //if (hasSubtitles == 1 && !movie.hasSubtitles) return;
        //if (hasSubtitles == 2 && movie.hasSubtitles) return;
        //if (isStudentFilm == 1 && !movie.isStudentFilm) return;
        //if (isStudentFilm == 2 && movie.isStudentFilm) return;
        if (hasDCP == 1 && !movie.dcpFiles) return;
        if (hasDCP == 2 && movie.dcpFiles) return;
        if (selectedDirectorIDs && !director) return;
        if (
          selectedContactIDs &&
          !selectedContactIDs.includes(movie.contact.id)
        )
          return;

        movies.push(movie); //all filters passed, movie gets added to result
      });

      options.page = page;
      options.limit = limit; //set limit back to original value to restore paging
      //calculate values for pagination
      let pages = Math.floor(movies.length / Number(options.limit));
      if (movies.length % Number(options.limit) != 0) ++pages;
      let items = options.limit;
      if (movies.length < options.limit) items = movies.length;

      return new Pagination<MovieDto>(
        movies.slice(
          (Number(options.page) - 1) * Number(options.limit),
          Number(options.page) * Number(options.limit),
        ),
        {
          totalItems: movies.length,
          itemCount: items,
          itemsPerPage: options.limit,
          totalPages: pages,
          currentPage: options.page,
        } as IPaginationMeta,
        undefined,
      );
    });
  }

  /**
   * Returns the movie with the specified id
   * @param id the id of the movie to return
   * @returns {Promise<MovieDto>} The movie with the specified id
   */
  async findOne(id: number): Promise<MovieDto> {
    let movie;
    try {
      movie = await this.moviesRepository.findOneOrFail({
        where: { id },
        relations: [
          'directors',
          'contact',
          'countriesOfProduction',
          'animationTechniques',
          'softwareUsed',
          'keywords',
          'submissionCategories',
          'dialogLanguages',
          'movieFiles',
          'dcpFiles',
          'previewFile',
          'trailerFile',
          'stillFiles',
          'subtitleFiles',
          'selectionTags',
        ],
      });
    } catch (e) {
      this.logger.error(`Getting movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapMovieToDto(movie);
  }

  async findAll(): Promise<MovieDto> {
    let movies;
    try {
      movies = await this.moviesRepository.find({
        where: {},
        relations: [
          'directors',
          'contact',
          'countriesOfProduction',
          'animationTechniques',
          'softwareUsed',
          'keywords',
          'submissionCategories',
          'dialogLanguages',
          'movieFiles',
          'dcpFiles',
          'previewFile',
          'trailerFile',
          'stillFiles',
          'subtitleFiles',
          'selectionTags',
        ],
      });
    } catch (e) {
      this.logger.error(`Getting all movies failed.`, e.stack);
      throw new NotFoundException();
    }
    return movies.map((movie) => this.mapMovieToDto(movie));
  }

  /**
   * Updates the movie with the specified id
   * @param id the id of the movie to update
   * @param updateMovieDto the movie to update
   * @returns {Promise<MovieDto>} the updated movie
   */
  async update(
    id: number,
    updateMovieDto: CreateUpdateMovieDto,
  ): Promise<MovieDto> {
    await this.checkIfReferencedDirectorsExist(updateMovieDto.directors);
    await this.checkIfReferencedContactExists(updateMovieDto.contact);
    await this.checkIfReferencedTagsExist(updateMovieDto);
    try {
      await this.moviesRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Updating movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const movieParam = await this.createFiles(updateMovieDto);
    movieParam.id = id;
    const updatedMovie = await this.moviesRepository.save(movieParam);
    //return updatedMovie;
    return this.findOne(updatedMovie.id);
  }

  /**
   * Deletes the movie with the specified id from the database
   * @param id the id of the movie to delete
   */
  async delete(id: number): Promise<void> {
    let movie;
    try {
      movie = await this.moviesRepository.findOneOrFail({
        where: { id },
        relations: [
          'movieFiles',
          'dcpFiles',
          'previewFile',
          'stillFiles',
          'subtitleFiles',
        ],
      });
    } catch (e) {
      this.logger.error(`Deleting movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    if (this.movieHasFiles(movie)) {
      const msg = `Movie with id ${movie.id} failed deletion due to existing files`;
      this.logger.error(msg);
      throw new BadRequestException(msg);
    }
    await this.moviesRepository.delete(id);
  }

  private movieHasFiles(movie: Movie) {
    return (
      movie.movieFiles.length > 0 ||
      movie.dcpFiles.length > 0 ||
      movie.previewFile != null ||
      movie.trailerFile != null ||
      movie.stillFiles.length > 0 ||
      movie.subtitleFiles.length > 0
    );
  }

  private mapMovieToDto(movie: Movie): MovieDto {
    return this.mapper.map(movie, MovieDto, Movie);
  }

  private async checkIfReferencedDirectorsExist(
    directors: DirectorReferenceDto[],
  ) {
    for (const director of directors) {
      try {
        await this.directorsService.findOne(director.id);
      } catch (e) {
        this.logger.error(`Could not find director ${director.id}`, e.stack);
        throw new BadRequestException(`Director ${director.id} does not exist`);
      }
    }
  }

  private async checkIfReferencedContactExists(contact: ContactReferenceDto) {
    try {
      await this.contactsService.findOne(contact.id);
    } catch (e) {
      this.logger.error(`Could not find contact ${contact.id}`, e.stack);
      throw new BadRequestException(`Contact ${contact.id} does not exist`);
    }
  }

  private async checkIfReferencedTagsExist(movieDto: CreateUpdateMovieDto) {
    const checkArray = [
      {
        tags: movieDto.animationTechniques,
        type: TagType.Animation,
        name: 'animationTechniques',
      },
      {
        tags: movieDto.submissionCategories,
        type: TagType.Category,
        name: 'submissionCategories',
      },
      {
        tags: movieDto.countriesOfProduction,
        type: TagType.Country,
        name: 'countriesOfProduction',
      },
      {
        tags: movieDto.keywords,
        type: TagType.Keyword,
        name: 'keywords',
      },
      {
        tags: movieDto.dialogLanguages,
        type: TagType.Language,
        name: 'dialogLanguages',
      },
      {
        tags: movieDto.softwareUsed,
        type: TagType.Software,
        name: 'softwareUsed',
      },
      {
        tags: movieDto.selectionTags,
        type: TagType.Selection,
        name: 'selectionTags',
      },
    ];
    for (const obj of checkArray) {
      for (const tag of obj.tags) {
        let result;
        try {
          result = await this.tagsService.findOne(tag.id);
        } catch (e) {
          this.logger.error(`Could not find tag ${tag.id}`, e.stack);
          throw new BadRequestException(`Tag ${tag.id} does not exist`);
        }
        if (result.type !== obj.type) {
          throw new BadRequestException(
            `The TagTypes of ${obj.name} must all be ${obj.type}`,
          );
        }
      }
    }
  }
}
