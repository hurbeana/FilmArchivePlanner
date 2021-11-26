import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SearchMoviePagingDto } from './dto/search-movie-paging.dto';

/**
 * Controller for movies.
 * Contains REST endpoints for movies CRUD.
 */
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
  find(@Query() searchPaging: SearchMoviePagingDto) {
    this.logger.log('Get movies called.');
    this.logger.log(searchPaging);
    const { limit, page, orderBy, sortOrder, searchstring, ...search } =
      searchPaging;
    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.moviesService.find(p, search, orderBy, sortOrder, searchstring);
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
  delete(@Param('id') id: number) {
    this.logger.log(`Delete movie with id ${id} called.`);
    return this.moviesService.delete(id);
  }
}
