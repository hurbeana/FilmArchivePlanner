import { Movie } from './entities/movie.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { MovieDto } from './dto/movie.dto';

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

  findOne(id: number): Promise<MovieDto> {
    return this.moviesRepository
      .findOne(id)
      .then((entity) => this.mapMovieToDto(entity));
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
