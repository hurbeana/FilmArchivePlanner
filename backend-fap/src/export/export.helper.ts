import { MovieDto } from '../movies/dto/movie.dto';
import { DirectorReferenceDto } from '../directors/dto/director-reference.dto';
import { ContactDto } from '../contacts/dto/contact.dto';
import { TagDto } from '../tags/dto/tag.dto';
import { createFile } from './storage.helper';
import { TagReferenceDto } from '../tags/dto/tag-reference.dto';
import { FileDto } from '../files/dto/file.dto';
import { ContactReferenceDto } from '../contacts/dto/contact-reference.dto';
import { parse } from 'json2csv';

export const generateCSVFile = async (
  object: MovieDto | DirectorReferenceDto | ContactDto | TagDto,
): Promise<string> => {
  const csvData = object;

  if (object[0] === null || object[0] === undefined) {
    return Promise.reject(
      'Unable to transform movie data to CSV file. There are no movies',
    );
  }

  const csvFields = Object.keys(object[0])
    .filter((key) => key !== 'id') // dont export ids
    .filter((key) => key !== 'folderId') // dont export folderIds
    .map((key) => {
      return getCSVExportField(key);
    });
  if (!csvData || !csvFields) {
    return Promise.reject('Unable to transform movie data to CSV file.');
  }

  const csv = parse(csvData, { fields: csvFields, delimiter: ';' });

  const filePath = 'storage/app/exports';
  const fileName = 'export.csv';

  await createFile(filePath, fileName, csv);

  return Promise.resolve(fileName);
};

export const getCSVExportField = (key: string): Record<string, unknown> => {
  return {
    label: key,
    value: function (object) {
      // object can be movie, director, contact
      const property = object[key];

      // Output for Empty Values
      if (property === [] || property === null || property === undefined) {
        return '';
      }
      // Output for Arrays
      if (property instanceof Array) {
        // Output for Directors
        if (property.every((v) => v instanceof DirectorReferenceDto)) {
          return property.map((director) => director.fullName).join(', ');
        }
        // Output for Tags
        if (property.every((v) => v instanceof TagReferenceDto)) {
          return property.map((tag) => tag.value).join(', ');
        }
        // Output for Files
        if (property.every((v) => v instanceof FileDto)) {
          return property
            .map((file) => file.path + '/' + file.filename)
            .join(', ');
        }
      }
      // Output for Contact
      if (property instanceof ContactReferenceDto) {
        return property.name;
      }
      // Output for File
      if (property instanceof FileDto) {
        return property ? property.path + '/' + property.filename : '';
      }
      // Output for Tag
      if (property instanceof TagReferenceDto) {
        return property.value;
      }
      // Output for everything else
      return property;
    },
  };
};
