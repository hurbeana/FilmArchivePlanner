import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUpdateDirectorDto } from './dto/create-update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

/**
 * Service for directors CRUD
 */
@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    @InjectMapper()
    private mapper: Mapper,
  ) {
    this.mapper.createMap(Director, DirectorDto);
  }

  private readonly logger = new Logger(DirectorsService.name);

  /**
   * Saves a director to the database
   * @param createDirectorDto The director to save
   * @returns {Promise<DirectorDto>} The created director, including id and timestamps
   */
  async create(
    createDirectorDto: CreateUpdateDirectorDto,
  ): Promise<DirectorDto> {
    const directorParam = this.directorRepository.create(createDirectorDto);
    const createdDirector = await this.directorRepository.save(directorParam);
    return this.mapDirectorToDto(createdDirector);
  }

  /**
   * Retrieve Director List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchstring
   * @returns {Promise<Pagination<DirectorDto>>} The directors in a paginated form
   */
  find(
    options: IPaginationOptions,
    search: SearchDirectorDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchstring: string,
  ): Promise<Pagination<DirectorDto>> {
    const queryBuilder = this.directorRepository.createQueryBuilder('movie');
    if (searchstring) {
      // searchstring higher prio
      Object.keys(SearchDirectorDto.getStringSearch()).forEach((k) =>
        queryBuilder.orWhere(`director.${k} ILIKE :${k}`, {
          [k]: `%${searchstring}%`,
        }),
      );
    } else if (search) {
      Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .forEach(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            queryBuilder.orWhere(`director.${k} = :${k}`, { [k]: v });
          } else if (typeof v === 'string') {
            queryBuilder.orWhere(`director.${k} ILIKE :${k}`, {
              [k]: `%${v}%`,
            });
          } else {
            //TODO: more types?
          }
        });
    }
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sortOrder);
    }
    return paginate<Director>(queryBuilder, options).then(
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
      director = await this.directorRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Getting director with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    return this.mapDirectorToDto(director);
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
      await this.directorRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Getting director with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const directorParam = this.directorRepository.create(updateDirectorDto);
    directorParam.id = id;
    const updatedDirector = await this.directorRepository.save(directorParam);
    return this.mapDirectorToDto(updatedDirector);
  }

  /**
   * Deletes the director with the specified id from the database
   * @param id the id of the director to delete
   */
  async delete(id: number): Promise<void> {
    try {
      await this.directorRepository.findOneOrFail(id);
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
