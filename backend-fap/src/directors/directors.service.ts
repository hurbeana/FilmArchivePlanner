import { IFsService } from './../files/interfaces/fs-service.interface';
import { FILES_PERSISTENCY_PROVIDER } from './../files/files.constants';
import { DIRECTORROOTFOLDER } from './directors.constants';
import { FileDto } from './../files/dto/file.dto';
import {
  BiographyEnglishFile,
  BiographyGermanFile,
  FilmographyFile,
} from './entities/directorfiles.entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUpdateDirectorDto } from './dto/create-update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
    // get or create folderId for unique folders
    if (createUpdateDirectorDto.folderId === undefined) {
      createUpdateDirectorDto.folderId = namor.generate();
    }
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
    const savedDirector = await this.directorRepository.save(
      await this.createFiles(createDirectorDto),
    );
    //const directorParam = this.directorRepository.create(createDirectorDto);
    //const createdDirector = await this.directorRepository.save(directorParam);
    //return this.mapDirectorToDto(createdDirector);
    return this.findOne(savedDirector.id);
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
      orderObj = { created_at: 'ASC' };
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
    await this.directorRepository.delete(id);
  }

  private mapDirectorToDto(director: Director): DirectorDto {
    return this.mapper.map(director, DirectorDto, Director);
  }
}
