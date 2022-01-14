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
import { SearchMovieAdvancedPagingDto } from './dto/search-movie-advanced-paging.dto';

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
    const { page, limit, orderBy, sortOrder, searchString, ...search } =
      searchPaging;
    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.moviesService.find(p, search, orderBy, sortOrder, searchString);
  }

  @Get('/advanced')
  findAdvanced(@Query() params: SearchMovieAdvancedPagingDto) {
    this.logger.log('Get movies advanced called.');
    this.logger.log(params);
    const {
      page,
      limit,
      orderBy,
      sortOrder,
      searchString,
      exactYear,
      fromYear,
      toYear,
      exactLength,
      fromLength,
      toLength,
      hasDialogue,
      hasSubtitles_,
      isStudentFilm_,
      hasDCP,
      ...search
    } = params;
    let selectedTagIDs: number[];
    let negativeTagIDs: number[];
    let selectedDirectorIDs: number[];
    let selectedContactIDs: number[];
    //convert arrays back to numbers (they get converted to strings during http request)
    if (params.selectedTagIDs)
      selectedTagIDs = params.selectedTagIDs.map((x) => Number(x));
    if (params.negativeTagIDs)
      negativeTagIDs = params.negativeTagIDs.map((x) => Number(x));
    if (params.selectedDirectorIDs)
      selectedDirectorIDs = params.selectedDirectorIDs.map((x) => Number(x));
    if (params.selectedContactIDs)
      selectedContactIDs = params.selectedContactIDs.map((x) => Number(x));

    const p: IPaginationOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };
    return this.moviesService.findAdvanced(
      p,
      search,
      orderBy,
      sortOrder,
      searchString,
      selectedTagIDs,
      negativeTagIDs,
      exactYear,
      fromYear,
      toYear,
      exactLength,
      fromLength,
      toLength,
      hasDialogue,
      hasSubtitles_,
      isStudentFilm_,
      hasDCP,
      selectedDirectorIDs,
      selectedContactIDs,
    );
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
