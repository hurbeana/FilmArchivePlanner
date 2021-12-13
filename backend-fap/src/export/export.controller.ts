import { Controller, Get, Logger, Param, Response } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ContactsService } from '../contacts/contacts.service';
import { DirectorsService } from '../directors/directors.service';
import { MoviesService } from '../movies/movies.service';
import { TagsService } from '../tags/tags.service';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  private readonly logger = new Logger(ExportController.name);

  constructor(
    private readonly moviesService: MoviesService,
    private readonly directorsService: DirectorsService,
    private readonly contactsService: ContactsService,
    private readonly tagsService: TagsService,
    private exportService: ExportService,
  ) {}

  // exports movie data as csv file
  @Get(':type')
  export(
    @Response() res: ExpressResponse,
    @Param('type') type: string,
  ): Promise<ExpressResponse> {
    this.logger.log(`Export for ${type} called.`);

    let service = null;
    if (type === 'movies') {
      service = this.moviesService;
    } else if (type === 'directors') {
      service = this.directorsService;
    } else if (type === 'contacts') {
      service = this.contactsService;
    } else if (type === 'tags') {
      service = this.tagsService;
    }

    return this.exportService.exportObjectsToCSV(service).then(
      async (fileName) =>
        await this.exportService
          .getExportedObjectsCSV(fileName)
          .then((csvData) => {
            //res.set('Content-Type', 'text/csv');
            res.setHeader('Content-Type', 'text/csv');
            return res.send(csvData);
          }),
    );
  }
}
