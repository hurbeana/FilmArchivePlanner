import { ConfigService } from '@nestjs/config';
import {
  FILES_PERSISTENCY_PROVIDER,
  FILES_MODULE_OPTIONS,
} from './files.constants';
import {
  CacheModule,
  CACHE_MANAGER,
  DynamicModule,
  Global,
  Logger,
  Module,
  NotImplementedException,
  Provider,
  Type,
} from '@nestjs/common';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import {
  FilesModuleOptions,
  FilesModuleAsyncOptions,
  FilesModuleOptionsFactory,
} from './interfaces/files-options.interface';
import { FtpFsService } from './providers/sftp-fs.service';
import {
  createCacheOptions,
  createMulterOptions,
} from '../config/files-config.functions';
import { Cache } from 'cache-manager';
import { FilesJobScheduler } from './files-job-scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { LocalFsService } from './providers/local-fs.service';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AutomapperModule } from '@automapper/nestjs';

@Global()
@Module({
  imports: [ScheduleModule.forRoot(), AutomapperModule],
  providers: [FilesJobScheduler],
  controllers: [FilesController],
})
export class FilesModule {
  private readonly logger = new Logger(FilesModule.name);

  static forRoot(options: FilesModuleOptions): DynamicModule {
    return {
      module: FilesModule,
      imports: this.createModuleImports(options),
      providers: [
        {
          provide: FILES_MODULE_OPTIONS,
          useValue: options,
        },
        this.createPersistencyProvider(options),
      ],
      exports: [FILES_PERSISTENCY_PROVIDER],
    };
  }

  static forRootAsync(options: FilesModuleAsyncOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncProviders(options);
    const persistenceProvider = {
      provide: FILES_PERSISTENCY_PROVIDER,
      useFactory: (
        options: FilesModuleOptions,
        cache: Cache,
        manager: EntityManager,
      ) => {
        switch (options.persistenceType) {
          case 'sftp':
            return new FtpFsService(options, cache, manager);
          case 'localfs':
            return new LocalFsService(options, cache, manager);
          default:
            throw new NotImplementedException();
        }
      },
      inject: [FILES_MODULE_OPTIONS, CACHE_MANAGER, getEntityManagerToken()],
    };
    return {
      module: FilesModule,
      imports: [
        ...options.imports,
        CacheModule.registerAsync({
          useFactory: createCacheOptions,
          inject: [ConfigService],
        }),
        MulterModule.registerAsync({
          useFactory: createMulterOptions,
          inject: [ConfigService],
        }),
      ],
      providers: [
        ...asyncOptionsProvider,
        persistenceProvider,
        ...(options.extraProviders || []),
      ],
      exports: [FILES_PERSISTENCY_PROVIDER],
    };
  }

  private static createModuleImports(
    options: FilesModuleOptions,
  ): Array<DynamicModule> {
    return [
      CacheModule.register(options.cache),
      MulterModule.register(options.endpoint),
    ];
  }

  private static createPersistencyProvider(
    options: FilesModuleOptions,
  ): Provider {
    switch (options.persistenceType) {
      case 'sftp':
        return {
          provide: FILES_PERSISTENCY_PROVIDER,
          useClass: FtpFsService,
        };
      case 'localfs':
        return {
          provide: FILES_PERSISTENCY_PROVIDER,
          useClass: LocalFsService,
        };
      default:
        throw new NotImplementedException();
    }
  }

  private static createAsyncProviders(
    options: FilesModuleAsyncOptions,
  ): Array<Provider> {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<FilesModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FilesModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILES_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<FilesModuleOptionsFactory>,
    ];
    return {
      provide: FILES_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FilesModuleOptionsFactory) =>
        await optionsFactory.createFilesOptions(),
      inject,
    };
  }
}
