import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FilesModuleOptions } from '../files/interfaces/files-options.interface';
import * as redisStore from 'cache-manager-redis-store';

export function createFilesOptions(
  configService: ConfigService,
): FilesModuleOptions | Promise<FilesModuleOptions> {
  const filesConfig = configService.get<FilesModuleOptions>('files');
  return { baseUploadPath: '/tmp/fapArchive', ...filesConfig };
}

export function createMulterOptions(
  configService: ConfigService,
): MulterOptions | Promise<MulterOptions> {
  return configService.get<MulterOptions>('files.endpoint');
}
export function createCacheOptions(
  configService: ConfigService,
): CacheModuleOptions | Promise<CacheModuleOptions> {
  const ttl = 1 * 24 * 60 * 60; // 1 days * 24 hours * 60 minutes * 60 seconds
  return {
    ttl,
    max: 500,
    ...configService.get<CacheModuleOptions>('files.cache'),
    store: redisStore,
  };
}
