import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { moviesListStub } from './movies.stub';
import * as querystring from 'querystring';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let moviesRepository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    moviesRepository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );

    const movies = moviesRepository.create(moviesListStub());
    await moviesRepository.save(movies);
  });

  test('/movies (GET) should fail with unknown parameter', () => {
    const search = { unknownparam: 'data' };
    request(app.getHttpServer())
      .get('/movies')
      .query(querystring.stringify(search))
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/);
  });

  test('/movies (GET) with limit 10 delivers 10 records', async () => {
    const search = { limit: 10 };
    const response = await request(app.getHttpServer())
      .get('/movies')
      .query(querystring.stringify(search))
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.items.length).toEqual(10);
  });

  test('/movies (GET) search for originalTitle=sieben returns one movie', async () => {
    const search = { originalTitle: 'sieben' };
    const response = await request(app.getHttpServer())
      .get('/movies')
      .query(querystring.stringify(search))
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.meta.totalItems).toBe(1);
    expect(response.body.items[0].originalTitle).toEqual('Sieben');
  });

  test('/movies (GET) searchstring seven returns one movie', async () => {
    const search = { limit: 10, page: 1, searchstring: 'seven' };
    const response = await request(app.getHttpServer())
      .get('/movies')
      .query(querystring.stringify(search))
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.meta.totalItems).toBe(1);
    expect(response.body.items[0].originalTitle).toEqual('Sieben');
  });

  test('/movies (GET) pagination delivers 14 total items', async () => {
    const search = { limit: 10 };
    const response = await request(app.getHttpServer())
      .get('/movies')
      .query(querystring.stringify(search))
      .expect(function (res) {
        if (res.status != HttpStatus.OK) {
          console.log(JSON.stringify(res.body, null, 2));
        }
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.meta.totalItems).toBe(14);
  });

  afterAll(async () => {
    await moviesRepository.clear(); // Clear table's content
    await app.close();
  });
});
