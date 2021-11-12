import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(DatabaseConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const env = this.configService.get<string>('NODE_ENV');
    const isDev = env === 'development' || env === 'testing';
    const dbConfig = {
      connectionName,
      autoLoadEntities: isDev, // maybe also for prod?
      synchronize: isDev,
      keepConnectionAlive: isDev,
      ...this.configService.get<TypeOrmModuleOptions>('db'),
    };
    if (env === 'testing') {
      dbConfig.database = this.configService.get<string>('POSTGRES_DB');
    }
    return dbConfig;
  }
}
