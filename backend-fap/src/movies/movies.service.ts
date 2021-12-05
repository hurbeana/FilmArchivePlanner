import { Movie } from './entities/movie.entity';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateMovieDto } from './dto/create-update-movie.dto';
import { ILike, Repository } from 'typeorm';
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
import { ContactReferenceDto } from '../contacts/dto/contact-reference.dto';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/entities/contact.entity';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { TagType } from '../tags/tagtype.enum';

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
    private readonly contactsService: ContactsService,
    private readonly tagsService: TagsService,
  ) {
    this.mapper.createMap(Director, DirectorReferenceDto).forMember(
      (destination) => destination.fullName,
      mapFrom((source) => source.firstName + ' ' + source.lastName),
    );
    this.mapper.createMap(Contact, ContactReferenceDto);
    this.mapper.createMap(Tag, TagReferenceDto);
    this.mapper.createMap(Movie, MovieDto);
  }

  private readonly logger = new Logger(MoviesService.name);

  /**
   * Saves a movie to the database
   * @param createMovieDto The movie to save
   * @returns {Promise<MovieDto>} The created movie, including id and timestamps
   */
  async create(createMovieDto: CreateUpdateMovieDto): Promise<MovieDto> {
    await this.checkIfReferencedDirectorsExist(createMovieDto.directors);
    await this.checkIfReferencedContactExists(createMovieDto.contact);
    await this.checkIfReferencedTagsExist(createMovieDto);
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
    let whereObj = [];
    let orderObj = {};
    if (searchstring) {
      // searchstring higher prio
      whereObj = Object.keys(SearchMovieDto.getStringSearch()).map((k) => ({
        [k]: ILike('%' + searchstring + '%'),
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
    if (orderBy) {
      orderObj = { [orderBy]: sortOrder };
    }
    return paginate<Movie>(this.moviesRepository, options, {
      relations: [
        'directors',
        'contact',
        'countriesOfProduction',
        'animationTechniques',
        'softwareUsed',
        'keywords',
        'submissionCategories',
        'dialogLanguages',
      ],
      where: whereObj,
      order: orderObj,
    }).then(
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
      .findOneOrFail(id, {
        relations: [
          'directors',
          'contact',
          'countriesOfProduction',
          'animationTechniques',
          'softwareUsed',
          'keywords',
          'submissionCategories',
          'dialogLanguages',
        ],
      })
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
    await this.checkIfReferencedDirectorsExist(updateMovieDto.directors);
    await this.checkIfReferencedContactExists(updateMovieDto.contact);
    await this.checkIfReferencedTagsExist(updateMovieDto);
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
  async delete(id: number): Promise<void> {
    try {
      await this.moviesRepository.findOneOrFail(id);
    } catch (e) {
      this.logger.error(`Deleting movie with id ${id} failed.`, e.stack);
      throw new NotFoundException();
    }
    await this.moviesRepository.delete(id);
  }

  private mapMovieToDto(movie: Movie): MovieDto {
    return this.mapper.map(movie, MovieDto, Movie);
  }

  private async checkIfReferencedDirectorsExist(
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

  private async checkIfReferencedContactExists(contact: ContactReferenceDto) {
    try {
      await this.contactsService.findOne(contact.id);
    } catch (e) {
      this.logger.error(`Could not find contact ${contact.id}`, e.stack);
      throw new BadRequestException(`Contact ${contact.id} does not exist`);
    }
  }

  private async checkIfReferencedTagsExist(movieDto: CreateUpdateMovieDto) {
    const checkArray = [
      {
        tags: movieDto.animationTechniques,
        type: TagType.Animation,
        name: 'animationTechniques',
      },
      {
        tags: movieDto.submissionCategories,
        type: TagType.Category,
        name: 'submissionCategories',
      },
      {
        tags: movieDto.countriesOfProduction,
        type: TagType.Country,
        name: 'countriesOfProduction',
      },
      {
        tags: movieDto.keywords,
        type: TagType.Keyword,
        name: 'keywords',
      },
      {
        tags: movieDto.dialogLanguages,
        type: TagType.Language,
        name: 'dialogLanguages',
      },
      {
        tags: movieDto.softwareUsed,
        type: TagType.Software,
        name: 'softwareUsed',
      },
    ];
    for (const obj of checkArray) {
      for (const tag of obj.tags) {
        let result;
        try {
          result = await this.tagsService.findOne(tag.id);
        } catch (e) {
          this.logger.error(`Could not find tag ${tag.id}`, e.stack);
          throw new BadRequestException(`Tag ${tag.id} does not exist`);
        }
        if (result.type !== obj.type) {
          throw new BadRequestException(
            `The TagTypes of ${obj.name} must all be ${obj.type}`,
          );
        }
      }
    }
  }
}
