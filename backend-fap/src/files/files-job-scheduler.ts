import { join } from 'path';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { FILES_MODULE_OPTIONS } from './files.constants';
import { readdir, unlink, access } from 'fs/promises';

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
  @Cron(CronExpression.EVERY_10_SECONDS) // TODO: change this back to 10min later
  async clearStagedFiles() {
    const cachedKeys = await this.cacheManager.store.keys();
    const cachedFileNames = new Array<string>();
    for (const key of cachedKeys) {
      cachedFileNames.push((await this.cacheManager.get(key))['filename']);
    }

    try {
      await access(this.filesOptions.baseCachePath);
    } catch (err) {
      this.logger.warn(
        `BaseCachePath <${this.filesOptions.baseCachePath} does not exist yet`,
      );
      return;
    }
    const files = await readdir(this.filesOptions.baseCachePath);
    files.forEach(async (file) => {
      if (cachedFileNames.indexOf(file) < 0) {
        try {
          await unlink(join(this.filesOptions.baseCachePath, file));
        } catch (err) {
          this.logger.error(`Could not delete cached file! (${file})`, err);
          return;
        }
        this.logger.log(`Successfully deleted cached file. (${file})`);
      }
    });
  }
}
