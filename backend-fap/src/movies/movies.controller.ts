import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  private readonly logger = new Logger(MoviesController.name);

  @Post()
  create(@Body() createMovieDto: CreateUpdateMovieDto) {
    this.logger.log('Create movie called.');
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    this.logger.log('Get movies called.');
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Get movie with id ${id} called.`);
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateMovieDto: CreateUpdateMovieDto,
  ) {
    this.logger.log(`Update movie with id ${id} called.`);
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Delete movie with id ${id} called.`);
    return this.moviesService.remove(id);
  }
}
