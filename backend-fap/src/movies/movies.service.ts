import { Movie } from './entities/movie.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectMapper()
    private mapper: Mapper,
  ) {
    this.mapper.createMap(Movie, MovieDto);
  }

  private readonly logger = new Logger(MoviesService.name);

  async create(createMovieDto: CreateUpdateMovieDto): Promise<MovieDto> {
    const movieParam = this.moviesRepository.create(createMovieDto);
    const createdMovie = await this.moviesRepository.save(movieParam);
    return this.mapMovieToDto(createdMovie);
  }

  findAll(): Promise<MovieDto[]> {
    return this.moviesRepository
      .find()
      .then((entities) => entities.map((entity) => this.mapMovieToDto(entity)));
  }

  /**
   * Retrieve Movie List with pagination
   * @param options Pagination options, such as pagenumber, pagesize, ...
   * @param search Search DTO for detailed search
   * @param orderBy field to order by
   * @param sortOrder sortorder, either ASC or DESC
   * @param searchstring
   */
  paginate(
    options: IPaginationOptions,
    search: SearchMovieDto,
    orderBy: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchstring: string,
  ): Promise<Pagination<MovieDto>> {
    const queryBuilder = this.moviesRepository.createQueryBuilder('movie');
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
    // console.log(queryBuilder);
    return paginate<Movie>(queryBuilder, options).then(
      (page) =>
        new Pagination<MovieDto>(
          page.items.map((entity) => this.mapMovieToDto(entity)),
          page.meta,
          page.links,
        ),
    );
  }

  findOne(id: number): Promise<MovieDto> {
    return this.moviesRepository
      .findOneOrFail(id)
      .then((entity) => this.mapMovieToDto(entity))
      .catch((e) => {
        this.logger.error(`Getting movie with id ${id} failed.`, e.stack);
        throw new NotFoundException();
      });
  }

  async update(
    id: number,
    updateMovieDto: CreateUpdateMovieDto,
  ): Promise<MovieDto> {
    try {
      await this.moviesRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Updating movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }

    const movieParam = this.moviesRepository.create(updateMovieDto);
    movieParam.id = id;
    const updatedMovie = await this.moviesRepository.save(movieParam);
    return this.mapMovieToDto(updatedMovie);
  }

  remove(id: number) {
    //TODO implement
    return `This action removes a #${id} movie`;
  }

  private mapMovieToDto(movie: Movie): MovieDto {
    return this.mapper.map(movie, MovieDto, Movie);
  }
}
