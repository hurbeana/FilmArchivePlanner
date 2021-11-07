import { Movie } from './entities/movie.entity';
import { Injectable } from '@nestjs/common';
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

  async create(createMovieDto: CreateUpdateMovieDto): Promise<MovieDto> {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository
      .save(movie)
      .then((entity) => this.mapMovieToDto(entity));
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

  update(id: number, updateMovieDto: CreateUpdateMovieDto) {
    //TODO implement - should return Promise<MovieDto>
    return updateMovieDto;
  }

  remove(id: number) {
    //TODO implement
    return `This action removes a #${id} movie`;
  }

  private mapMovieToDto(movie: Movie): MovieDto {
    return this.mapper.map(movie, MovieDto, Movie);
  }
}
