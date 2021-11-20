import { Movie } from './entities/movie.entity';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { Repository } from 'typeorm';
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

/**
 * Service for movies CRUD
 */
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectMapper()
    private mapper: Mapper,
    private readonly directorsService: DirectorsService,
  ) {
    this.mapper.createMap(Director, DirectorReferenceDto).forMember(
      (destination) => destination.fullName,
      mapFrom((source) => source.firstName + ' ' + source.lastName),
    );
    this.mapper.createMap(Movie, MovieDto);
  }

  private readonly logger = new Logger(MoviesService.name);

  /**
   * Saves a movie to the database
   * @param createMovieDto The movie to save
   * @returns {Promise<MovieDto>} The created movie, including id and timestamps
   */
  async create(createMovieDto: CreateUpdateMovieDto): Promise<MovieDto> {
    await this.checkIfReferencedEntitiesExist(createMovieDto.directors);
    const movieParam = this.moviesRepository.create(createMovieDto);
    const createdMovie = await this.moviesRepository.save(movieParam);
    return this.findOne(createdMovie.id);
  }

  /**
   * Retrieve Movie List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchstring
   * @returns {Promise<Pagination<MovieDto>>} The movies in a paginated form
   */
  find(
    options: IPaginationOptions,
    search: SearchMovieDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchstring: string,
  ): Promise<Pagination<MovieDto>> {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.directors', 'director');
    if (searchstring) {
      // searchstring higher prio
      Object.keys(SearchMovieDto.getStringSearch()).forEach((k) =>
        queryBuilder.orWhere(`movie.${k} ILIKE :${k}`, {
          [k]: `%${searchstring}%`,
        }),
      );
    } else if (search) {
      Object.entries(search)
        .filter(([, v]) => v) // filter empty properties
        .forEach(([k, v]) => {
          if (typeof v === 'number' || typeof v === 'boolean') {
            queryBuilder.orWhere(`movie.${k} = :${k}`, { [k]: v });
          } else if (typeof v === 'string') {
            queryBuilder.orWhere(`movie.${k} ILIKE :${k}`, { [k]: `%${v}%` });
          } else {
            //TODO: more types?
          }
        });
    }
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sortOrder);
    }
    return paginate<Movie>(queryBuilder, options).then(
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
  findOne(id: number): Promise<MovieDto> {
    return this.moviesRepository
      .findOneOrFail(id, { relations: ['directors'] })
      .then((entity) => this.mapMovieToDto(entity))
      .catch((e) => {
        this.logger.error(`Getting movie with id ${id} failed.`, e.stack);
        throw new NotFoundException();
      });
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
    await this.checkIfReferencedEntitiesExist(updateMovieDto.directors);
    try {
      await this.moviesRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Updating movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const movieParam = this.moviesRepository.create(updateMovieDto);
    movieParam.id = id;
    const updatedMovie = await this.moviesRepository.save(movieParam);
    return this.findOne(updatedMovie.id);
  }

  /**
   * Deletes the movie with the specified id from the database
   * @param id the id of the movie to delete
   */
  remove(id: number) {
    //TODO implement
    return `This action removes a #${id} movie`;
  }

  private mapMovieToDto(movie: Movie): MovieDto {
    return this.mapper.map(movie, MovieDto, Movie);
  }

  private async checkIfReferencedEntitiesExist(
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
}
