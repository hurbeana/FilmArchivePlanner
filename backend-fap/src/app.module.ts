import { DatabaseConfigService } from './database/database-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { Connection } from 'typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { TagsModule } from './tags/tags.module';
import { createFilesOptions } from './config/files-config.functions';
import { DirectorsModule } from './directors/directors.module';
import { ContactsModule } from './contacts/contacts.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: DatabaseConfigService,
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      options: [{ name: '', pluginInitializer: classes }],
      singular: true,
    }),
    DatabaseModule,
    MoviesModule,
    DirectorsModule,
    ContactsModule,
    TagsModule,
    ExportModule,
    FilesModule.forRootAsync({
      imports: [],
      useFactory: createFilesOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
