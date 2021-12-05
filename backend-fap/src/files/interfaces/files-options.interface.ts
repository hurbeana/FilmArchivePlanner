import { CacheModuleOptions, ModuleMetadata, Type } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { ConnectOptions } from 'ssh2-sftp-client';

export type PersistenceTypes = 'sftp' | 'localfs';

export interface BaseConnectionOptions {
  persistenceType: PersistenceTypes;
}

export interface SFTPConnectionOptions extends BaseConnectionOptions {
  persistenceType: 'sftp';
  connectOptions: ConnectOptions;
}

export interface LocalFSOptions extends BaseConnectionOptions {
  persistenceType: 'localfs';
  path: string;
}

export type ConnectionOptions = SFTPConnectionOptions | LocalFSOptions;

export type FilesModuleOptions = {
  baseUploadPath: string;
  downloadTTL: number;
  cache?: CacheModuleOptions;
  endpoint?: MulterModuleOptions;
} & Partial<ConnectionOptions>;

export interface FilesModuleOptionsFactory {
  createFilesOptions(): Promise<FilesModuleOptions> | FilesModuleOptions;
}

export interface FilesModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FilesModuleOptionsFactory>;
  useClass?: Type<FilesModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<FilesModuleOptions> | FilesModuleOptions;
  inject?: any[];
  extraProviders?: any[];
}
