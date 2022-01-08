import {
  Controller,
  Logger,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { DomainType } from './domain-type.enum';

@Controller('import')
export class ImportController {
  private readonly logger = new Logger(ImportController.name);

  constructor(private readonly importService: ImportService) {}

  @Post(':type')
  @UseInterceptors(FileInterceptor('file'))
  import(
    @UploadedFile() file: Express.Multer.File,
    @Param('type') type: string,
  ) {
    this.logger.log(`Import for ${type} called.`);

    if (DomainType[type] === undefined) {
      this.logger.warn(`No import for ${type} defined.`);
      throw new NotFoundException(`No import for ${type} defined.`);
    }

    return this.importService.importObjectsFromCSV(DomainType[type], file);
  }
}
