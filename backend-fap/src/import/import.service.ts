import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { DirectorsService } from '../directors/directors.service';
import { ContactsService } from '../contacts/contacts.service';
import { TagsService } from '../tags/tags.service';
import { createFile, deleteFile, getFile } from '../export/storage.helper';
import * as csvToJson from 'convert-csv-to-json';
import * as namor from 'namor';
import { DomainType } from './domain-type.enum';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { DirectorReferenceDto } from '../directors/dto/director-reference.dto';
import { ContactReferenceDto } from '../contacts/dto/contact-reference.dto';

@Injectable()
export class ImportService {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly directorsService: DirectorsService,
    private readonly contactsService: ContactsService,
    private readonly tagsService: TagsService,
  ) {}

  private readonly logger = new Logger(ImportService.name);

  // mapping of old (imported) to new (created) ids. key = old, value = new
  private readonly tagIds = new Map<number, number>();
  private readonly contactIds = new Map<number, number>();
  private readonly directorIds = new Map<number, number>();
  private readonly movieIds = new Map<number, number>();

  /**
   * Imports objects from a csv file
   * @param type type of domain object contained in the file
   * @param file File containing the csv data to import
   */
  async importObjectsFromCSV(type: DomainType, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'CSV file expected via multipart/form-data',
      );
    }

    const filePath = 'storage/app/imports';

    await createFile(filePath, file.originalname, file.buffer);

    const csvFilePath = filePath + '/' + file.originalname;
    const jsonFilePath = filePath + '/' + `${namor.generate()}-import.json`;

    csvToJson
      .parseSubArray('*', ',')
      .formatValueByType()
      .generateJsonFileFromCsv(csvFilePath, jsonFilePath);

    const json = await getFile(jsonFilePath);
    this.logger.log('Imported data: ' + json);
    const objects: any[] = JSON.parse(json);

    try {
      switch (type) {
        case DomainType.tags:
          await this.importTags(objects);
          break;
        case DomainType.contacts:
          await this.importContacts(objects);
          break;
        case DomainType.directors:
          await this.importDirectors(objects);
          break;
        case DomainType.movies:
          await this.importMovies(objects);
          break;
      }
    } catch (e) {
      this.logger.error(`Could not import ${DomainType[type]}`, e.stack);
      await ImportService.cleanUp(jsonFilePath, csvFilePath);
      throw e;
    }
    await ImportService.cleanUp(jsonFilePath, csvFilePath);
  }

  private async importTags(objects: any[]) {
    for (const object of objects) {
      if (!ImportService.isTag(object)) {
        throw new BadRequestException(
          'The file does not contain the necessary tag fields.',
        );
      }
      const oldId = object.id;
      object.id = null; // will update if we don't delete the id
      const createdTag = await this.tagsService.create(object);
      this.tagIds.set(oldId, createdTag.id);
    }
  }

  private async importContacts(objects: any[]) {
    for (const object of objects) {
      if (!ImportService.isContact(object)) {
        throw new BadRequestException(
          'The file does not contain the necessary contact fields.',
        );
      }
      object.type = this.getNewTag(object.type);
      const oldId = object.id;
      object.id = null; // will update if we don't delete the id
      const createdContact = await this.contactsService.create(object);
      this.contactIds.set(oldId, createdContact.id);
    }
  }

  private async importDirectors(objects: any[]) {
    for (const object of objects) {
      if (!ImportService.isDirector(object)) {
        throw new BadRequestException(
          'The file does not contain the necessary director fields.',
        );
      }
      const oldId = object.id;
      object.id = null; // will update if we don't delete the id

      // import of files is not supported
      object.filmography = null;
      object.biographyEnglish = null;
      object.biographyGerman = null;

      const createdDirector = await this.directorsService.create(object);
      this.directorIds.set(oldId, createdDirector.id);
    }
  }

  private async importMovies(objects: any[]) {
    for (const object of objects) {
      if (!ImportService.isMovie(object)) {
        throw new BadRequestException(
          'The file does not contain the necessary movie fields.',
        );
      }
      const oldId = object.id;
      object.id = null; // will update if we don't delete the id

      // import of files is not supported
      object.movieFiles = null;
      object.dcpFiles = null;
      object.previewFile = null;
      object.trailerFile = null;
      object.stillFiles = null;
      object.subtitleFiles = null;

      object.directors = this.getNewDirectors(object);
      object.countriesOfProduction = this.getNewTags(
        object.countriesOfProduction,
      );
      object.animationTechniques = this.getNewTags(object.animationTechniques);
      object.softwareUsed = this.getNewTags(object.softwareUsed);
      object.keywords = this.getNewTags(object.keywords);
      object.submissionCategories = this.getNewTags(
        object.submissionCategories,
      );
      object.dialogLanguages = this.getNewTags(object.dialogLanguages);
      object.contact = this.getNewContact(object.contact);

      if (object.yearOfProduction === '') {
        object.yearOfProduction = undefined;
      }
      if (object.duration === '') {
        object.duration = undefined;
      }

      const createdMovie = await this.moviesService.create(object);
      this.movieIds.set(oldId, createdMovie.id);
    }
  }

  private getNewDirectors(object: any): DirectorReferenceDto[] {
    const newDirectors: DirectorReferenceDto[] = new Array(
      object.directors.length,
    );
    for (let i = 0; i < object.directors.length; i++) {
      const id = object.directors[i];
      if (!this.directorIds.has(id)) {
        throw new BadRequestException(
          `Director with id ${id} has not been imported yet.`,
        );
      }
      const director = new DirectorReferenceDto();
      director.id = this.directorIds.get(id);
      newDirectors[i] = director;
    }
    return newDirectors;
  }

  private getNewTags(tags: any[]): TagReferenceDto[] {
    const newTags: TagReferenceDto[] = new Array(tags.length);
    for (let i = 0; i < tags.length; i++) {
      const id = tags[i];
      if (!this.tagIds.has(id)) {
        throw new BadRequestException(
          `Tag with id ${id} has not been imported yet.`,
        );
      }
      const tag = new TagReferenceDto();
      tag.id = this.tagIds.get(id);
      newTags[i] = tag;
    }
    return newTags;
  }

  private getNewTag(id: number): TagReferenceDto {
    if (!this.tagIds.has(id)) {
      throw new BadRequestException(
        `Tag with id ${id} has not been imported yet.`,
      );
    }
    const tag = new TagReferenceDto();
    tag.id = this.tagIds.get(id);
    return tag;
  }

  private getNewContact(id: number): ContactReferenceDto {
    if (!this.contactIds.has(id)) {
      throw new BadRequestException(
        `Contact with id ${id} has not been imported yet.`,
      );
    }
    const contact = new ContactReferenceDto();
    contact.id = this.contactIds.get(id);
    return contact;
  }

  private static isTag(object: any): boolean {
    return (
      'type' in object &&
      'value' in object &&
      'user' in object &&
      'public' in object
    );
  }

  private static isContact(object: any): boolean {
    return 'type' in object && 'name' in object;
  }

  private static isDirector(object: any): boolean {
    return 'firstName' in object && 'lastName' in object;
  }

  private static isMovie(object: any): boolean {
    return (
      'originalTitle' in object &&
      'englishTitle' in object &&
      'directors' in object &&
      'duration' in object &&
      'germanSynopsis' in object &&
      'englishSynopsis' in object &&
      'isStudentFilm' in object &&
      'contact' in object
    );
  }

  private static async cleanUp(jsonPath: string, csvPath: string) {
    await deleteFile(jsonPath);
    await deleteFile(csvPath);
  }
}
