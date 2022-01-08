import { generateCSVFile } from './export.helper';
import {
  checkIfFileOrDirectoryExists,
  deleteFile,
  getFile,
} from './storage.helper';
import { NotFoundException } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';

import { TagsService } from '../tags/tags.service';
import { MoviesService } from '../movies/movies.service';
import { DirectorsService } from '../directors/directors.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  /**
   * Creates a CSV file with users data
   * @returns {Promise<string>}
   */
  async exportObjectsToCSV(
    service: MoviesService | DirectorsService | ContactsService | TagsService,
  ): Promise<string> {
    return await service
      .findAll()
      .then(async (objects) => generateCSVFile(objects))
      .catch((error) => Promise.reject(error));
  }

  /**
   * Gets an exported CSV file
   * @param {string} filename
   * @returns {Promise<string>}
   */
  async getExportedObjectsCSV(filename: string): Promise<string> {
    const filePath = `storage/app/exports/${filename}`;

    if (!checkIfFileOrDirectoryExists(filePath)) {
      throw new NotFoundException('Users export not found.');
    }

    const csvText = (await getFile(filePath)).toString();
    await deleteFile(filePath);
    return csvText;
  }
}
