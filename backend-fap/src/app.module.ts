import { Movie } from './movies/entities/movie.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { Connection } from 'typeorm';

//TODO make db configurable via .env file, see https://docs.nestjs.com/techniques/configuration
// also this https://docs.nestjs.com/techniques/database#async-configuration
// and https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      keepConnectionAlive: true, //only for dev purposes
      autoLoadEntities: true, //TODO doesn't quite work, look into why
      //entities: [Movie],
      synchronize: true, //TODO Turn off for non dev, auto-creates tables for entities
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
