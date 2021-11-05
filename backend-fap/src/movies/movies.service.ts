import { Movie } from './entities/movie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  findAll() {
    return this.moviesRepository.find();
  }

  findOne(id: number) {
    return this.moviesRepository.findOne(id);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return updateMovieDto;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
