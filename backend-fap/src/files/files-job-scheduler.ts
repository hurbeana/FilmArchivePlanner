import { join } from 'path';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { FILES_MODULE_OPTIONS } from './files.constants';
import * as fs from 'fs';

/**
 * Class to schedule cron jobs for different operations on files and/or directories.
 */
@Injectable()
export class FilesJobScheduler {
  private readonly logger = new Logger(FilesJobScheduler.name);

  constructor(
    @Inject(FILES_MODULE_OPTIONS)
    private readonly filesOptions: any,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * This function removes all files that no longer have an entry in the cache redis keystore from the file cache directory.
   * This function is executed every 10 minutes as a cron job.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async clearStagedFiles() {
    const cachedKeys = await this.cacheManager.store.keys();
    const cachedFileNames = new Array<string>();
    for (const key of cachedKeys) {
      cachedFileNames.push((await this.cacheManager.get(key))['filename']);
    }

    fs.readdir(this.filesOptions.endpoint.dest, (err, files) => {
      files.forEach((file) => {
        if (cachedFileNames.indexOf(file) < 0) {
          this.logger.log('Delete cached file:', file);
          fs.unlink(join(this.filesOptions.endpoint.dest, file), (err) => {
            if (err) {
              this.logger.error('Could not delete cached file!', err);
              return;
            }
            this.logger.log('File deleted!');
          });
        }
      });
    });
  }
}
