import { IFsService } from './../files/interfaces/fs-service.interface';
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
import { ILike, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { MovieDto } from './dto/movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import {
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
    // get or create folderId for unique folders
    if (createUpdateMovieDto.folderId === undefined) {
      createUpdateMovieDto.folderId = namor.generate();
    }
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
          const cachedFileName = (
            await this.filesServices.getCachedInfo(file.id)
          ).originalname;
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
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Following files names are duplicate',
          files: Array.from(duplicateNames.values()),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
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
    const createdMovie = await this.moviesRepository.save(
      await this.createFiles(createMovieDto),
    );
    return this.findOne(createdMovie.id);
  }

  /**
   * Retrieve Movie List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchString
   * @returns {Promise<Pagination<MovieDto>>} The movies in a paginated form
   */
  async find(
    options: IPaginationOptions,
    search: SearchMovieDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchString: string,
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
    if (sortOrder && orderBy) {
      orderObj = { [orderBy]: sortOrder.toUpperCase() };
    } else {
      orderObj = { created_at: 'ASC' };
    }

    console.log(orderObj);

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
      ],
      where: whereObj,
      order: orderObj,
    }).then(
      (page) =>
        new Pagination<MovieDto>(
          page.items.map((entity) => this.mapMovieToDto(entity)),
          page.meta,
          page.links,
        ),
    );
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
        ],
      });
    } catch (e) {
      this.logger.error(`Getting movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapMovieToDto(movie);
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
    try {
      await this.moviesRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Deleting movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.moviesRepository.delete(id);
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
