import { IFsService } from '../files/interfaces/fs-service.interface';
import { FILES_PERSISTENCY_PROVIDER } from '../files/files.constants';
import { DIRECTORROOTFOLDER } from './directors.constants';
import { FileDto } from '../files/dto/file.dto';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './entities/directorfiles.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateDirectorDto } from './dto/create-update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Director } from './entities/director.entity';
import { DirectorDto } from './dto/director.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { SearchDirectorDto } from './dto/search-director.dto';
import { join } from 'path';
import * as namor from 'namor';
import { DirectorFilesFolder } from './directors.enum';
import { File } from '../files/entities/file.entity';
import { DirectorReferenceDto } from './dto/director-reference.dto';

/**
 * Service for directors CRUD
 */
@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    @InjectRepository(BiographyEnglishFile)
    private biographyEnglishRepository: Repository<BiographyEnglishFile>,
    @InjectRepository(BiographyGermanFile)
    private biographyGermanRepository: Repository<BiographyGermanFile>,
    @InjectRepository(FilmographyFile)
    private filmographyRepository: Repository<FilmographyFile>,
    @InjectMapper()
    private mapper: Mapper,
    @Inject(FILES_PERSISTENCY_PROVIDER)
    private filesServices: IFsService,
    private entityManager: EntityManager,
  ) {
    this.mapper.createMap(Director, DirectorDto);
    this.mapper.createMap(BiographyEnglishFile, FileDto);
    this.mapper.createMap(BiographyGermanFile, FileDto);
    this.mapper.createMap(FilmographyFile, FileDto);
  }

  private readonly logger = new Logger(DirectorsService.name);

  // helper function to commit only cached files, may be extracted to a utiltiy service
  private async commitFiles<T extends File>(
    basePath: string,
    fileDtos: FileDto[],
    repository: Repository<File>,
    folder = '',
  ): Promise<T[]> {
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
      const entity = await repository.save(repository.create(resultDto as any));
      entities.push(entity);
    }
    return [...storedFileDtos, ...entities] as T[];
  }

  private async createFiles(
    createUpdateDirectorDto: CreateUpdateDirectorDto,
  ): Promise<Director> {
    // generate basepath for this movie
    const basePath = join(
      DIRECTORROOTFOLDER,
      `${createUpdateDirectorDto.lastName.replace(
        / /g,
        '_',
      )}.${createUpdateDirectorDto.firstName.replace(/ /g, '_')}-${
        createUpdateDirectorDto.folderId
      }`,
    );

    // check if cached files to be commited contain duplicates and if there are any throw an exception
    const allFiles = []
      .concat(
        createUpdateDirectorDto.biographyEnglish,
        createUpdateDirectorDto.biographyGerman,
        createUpdateDirectorDto.filmography,
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

    // were good, commit all files
    const biographyEnglishFile = (
      await this.commitFiles<BiographyEnglishFile>(
        basePath,
        [createUpdateDirectorDto.biographyEnglish],
        this.biographyEnglishRepository,
        DirectorFilesFolder.BIOGRAPHYENGLISHFILE,
      )
    )[0];

    const biographyGermanFile = (
      await this.commitFiles<BiographyGermanFile>(
        basePath,
        [createUpdateDirectorDto.biographyGerman],
        this.biographyGermanRepository,
        DirectorFilesFolder.BIOGRAPHYGERMANFILE,
      )
    )[0];

    const filmographyFile = (
      await this.commitFiles<FilmographyFile>(
        basePath,
        [createUpdateDirectorDto.filmography],
        this.filmographyRepository,
        DirectorFilesFolder.FILMOGRAPHYFILE,
      )
    )[0];

    // create the new director
    return this.directorRepository.create({
      ...createUpdateDirectorDto,
      biographyEnglish: biographyEnglishFile,
      biographyGerman: biographyGermanFile,
      filmography: filmographyFile,
    });
  }

  /**
   * Saves a director to the database
   * @param createDirectorDto The director to save
   * @returns {Promise<DirectorDto>} The created director, including id and timestamps
   */
  async create(
    createDirectorDto: CreateUpdateDirectorDto,
  ): Promise<DirectorDto> {
    // create folderId for unique folders
    createDirectorDto.folderId = namor.generate();
    if (
      createDirectorDto.biographyEnglish ||
      createDirectorDto.biographyGerman ||
      createDirectorDto.filmography
    ) {
      const savedDirector = await this.directorRepository.save(
        await this.createFiles(createDirectorDto),
      );
      return this.findOne(savedDirector.id);
    } else {
      const directorParam = this.directorRepository.create(createDirectorDto);
      const createdDirector = await this.directorRepository.save(directorParam);
      return this.findOne(createdDirector.id);
    }
  }

  /**
   * Retrieve Director List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchString
   * @returns {Promise<Pagination<DirectorDto>>} The directors in a paginated form
   */
  async find(
    options: IPaginationOptions,
    search: SearchDirectorDto,
    orderBy: string,
    sortOrder: string,
    searchString: string,
  ): Promise<Pagination<DirectorDto>> {
    let whereObj = [];
    let orderObj = {};
    if (searchString) {
      // searchString higher prio
      whereObj = Object.keys(SearchDirectorDto.getStringSearch()).map((k) => ({
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
      orderObj = { created_at: 'DESC' };
    }
    return paginate<Director>(this.directorRepository, options, {
      relations: ['biographyEnglish', 'biographyGerman', 'filmography'],
      where: whereObj,
      order: orderObj,
    }).then(
      (page) =>
        new Pagination<DirectorDto>(
          page.items.map((entity) => this.mapDirectorToDto(entity)),
          page.meta,
          page.links,
        ),
    );
  }

  /**
  Returns all tags in an array
  @returns {Promise<DirectorDto[]>} Array of all tags
  */
  async findAllWOPaging(): Promise<DirectorDto[]> {
    let directors: Director[];
    try {
      directors = await this.directorRepository.find();
    } catch (e) {
      this.logger.error(`Getting all tags without paging failed.`, e.stack);
      throw new NotFoundException(); //Is this the right exception for tagType not in Enum?
    }
    const dtos: DirectorDto[] = [];

    if (directors.length > 0) {
      directors.forEach((tag) => {
        dtos.push(this.mapDirectorToDto(tag));
      });
    }
    return dtos;
  }

  /**
   Returns all tags in an array
   @returns {Promise<DirectorReferenceDto[]>} Array of all tags
   */
  async findAllAsRefWOPaging(): Promise<DirectorReferenceDto[]> {
    let directors: Director[];
    try {
      directors = await this.directorRepository.find();
    } catch (e) {
      this.logger.error(`Getting all tags without paging failed.`, e.stack);
      throw new NotFoundException(); //Is this the right exception for tagType not in Enum?
    }
    const dtos: DirectorReferenceDto[] = [];

    if (directors.length > 0) {
      directors.forEach((director) => {
        dtos.push(this.mapDirectorToReferenceDto(director));
      });
    }
    return dtos;
  }

  /**
   * Returns the director with the specified id
   * @param id the id of the director to return
   * @returns {Promise<DirectorDto>} The director with the specified id
   */
  async findOne(id: number): Promise<DirectorDto> {
    let director: Director;
    try {
      director = await this.directorRepository.findOneOrFail({
        relations: ['biographyEnglish', 'biographyGerman', 'filmography'],
        where: { id },
      });
    } catch (e) {
      this.logger.error(`Getting director with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapDirectorToDto(director);
  }

  async findAll(): Promise<DirectorDto> {
    let directors;
    try {
      directors = await this.directorRepository.find({
        where: {},
        relations: ['biographyEnglish', 'biographyGerman', 'filmography'],
      });
    } catch (e) {
      this.logger.error(`Getting all tags failed.`, e.stack);
      throw new NotFoundException();
    }
    return directors.map((director) => this.mapDirectorToDto(director));
  }

  /**
   * Updates the director with the specified id
   * @param id the id of the director to update
   * @param updateDirectorDto the director to update
   * @returns {Promise<DirectorDto>} The updated director
   */
  async update(
    id: number,
    updateDirectorDto: CreateUpdateDirectorDto,
  ): Promise<DirectorDto> {
    try {
      await this.directorRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Getting director with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const directorParam = this.directorRepository.create(
      await this.createFiles(updateDirectorDto),
    );
    directorParam.id = id;
    const updatedDirector = await this.directorRepository.save(directorParam);
    return this.findOne(updatedDirector.id);
  }

  /**
   * Deletes the director with the specified id from the database
   * @param id the id of the director to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.directorRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      this.logger.error(`Deleting director with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    try {
      await this.directorRepository.delete(id);
    } catch (e) {
      this.logger.error(
        `Deleting director with id ${id} failed, since its in use.`,
        e.stack,
      );
      throw new InternalServerErrorException('Failed removing director');
    }
  }

  /**
   * Checks if a Director is referenced in some other table
   * @param directorId the id of the tag that we want to know if it is "used"
   */
  async directorIdIsInUse(directorId: number): Promise<boolean> {
    try {
      const result = await this.entityManager.query(
        `SELECT "directorId" FROM  "movie_directors_director" WHERE "directorId" = $1`,
        [directorId],
      );
      return result.length > 0;
    } catch (e) {
      this.logger.error(
        `Checking if director with id ${directorId} is in use failed.`,
        e.stack,
      );
      throw new NotFoundException();
    }
  }

  private mapDirectorToDto(director: Director): DirectorDto {
    return this.mapper.map(director, DirectorDto, Director);
  }
  private mapDirectorToReferenceDto(director: Director): DirectorReferenceDto {
    return {
      id: director.id,
      fullName: director.firstName + ' ' + director.lastName,
    };
  }
}
