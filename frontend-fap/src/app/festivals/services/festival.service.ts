import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Festival } from '../models/festival';
import { CreateUpdateFestivalDto } from '../models/create.festival';
import { FestivalsPaginationState } from '../../app.state';
import {
  CondOperator,
  QuerySort,
  RequestQueryBuilder,
} from '@nestjsx/crud-request';
import { map } from 'rxjs/operators';
import { Movie } from '../../movies/models/movie';
import { Contact } from '../../contacts/models/contact';

const api = 'http://localhost:3000/festivals';

@Injectable({ providedIn: 'root' })
export class FestivalService {
  constructor(private http: HttpClient) {}

  createFestival(festival: CreateUpdateFestivalDto): Observable<Festival> {
    console.log('[FestivalService] - CREATE FESTIVAL');
    return this.http.post<Festival>(api, festival);
  }

  getFestival(id: number) {
    console.log('[FestivalService] - GET FESTIVAL ID: ' + id);
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'events' }, { field: 'events.movie' }],
    });
    return this.http
      .get<Festival>(api + '/' + id, { params: rb.queryObject })
      .pipe(map(this.mapFestivalDate));
  }

  getFestivals(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<FestivalsPaginationState> {
    console.log(
      '[TagService] - GET FESTIVALS WITH page, limit, orderBy, sortOrder, searchString',
      page,
      limit,
      orderBy,
      sortOrder,
      searchString,
    );

    const rb = RequestQueryBuilder.create({
      limit: limit,
      page: page,
      join: [{ field: 'events' }],
    });

    if (searchString) {
      rb.setOr(
        [
          {
            field: 'name',
            operator: CondOperator.CONTAINS_LOW,
            value: searchString,
          },
          {
            field: 'location',
            operator: CondOperator.CONTAINS_LOW,
            value: searchString,
          },
        ],
        //{ field: 'year', operator: CondOperator.CONTAINS_LOW }, // gibts ned im backend
      );
    }

    if (sortOrder && orderBy) {
      rb.sortBy([
        { field: orderBy, order: sortOrder.toUpperCase() } as QuerySort,
      ]);
    }

    return this.http
      .get<GetManyDefaultResponse<Festival>>(api, { params: rb.queryObject })
      .pipe(
        map(
          // map to old format
          (page) =>
            ({
              items: page.data.map(this.mapFestivalDate),
              meta: {
                totalItems: page.total,
                itemCount: page.count,
                itemsPerPage: limit,
                totalPages: page.pageCount,
                currentPage: page.page,
              },
              searchString: searchString,
              orderBy: orderBy,
              sortOrder: sortOrder,
            } as FestivalsPaginationState),
        ),
      );
  }

  updateFestival(festival: CreateUpdateFestivalDto, id: number) {
    console.log('[FestivalService] - UPDATE FESTIVAL');
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'events' }, { field: 'events.movie' }],
    });
    return this.http
      .put<Festival>(`${api}/${id}`, festival, {
        params: rb.queryObject,
      })
      .pipe(map(this.mapFestivalDate));
  }

  deleteFestival(festival: Festival) {
    console.log('[FestivalService] - DELETE FESTIVAL', festival.id);
    return this.http.delete(`${api}/${festival.id}`);
  }

  mapFestivalDate(f: Festival) {
    if (!f.firstDate) f.firstDate = new Date();
    else f.firstDate = new Date(f.firstDate);
    f.events = f.events.map((e) => {
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
      return e;
    });
    return f;
  }

  checkHasEvents(festival: Festival): Observable<boolean> {
    console.log(
      '[FestivalService] - CHECK IF festival HAS EVENTS',
      festival.id,
    );
    return this.http.get<boolean>(`${api}/hasEvents/${festival.id}`);
  }

  downloadCSV() {
    console.log('[FestivalService] - DOWNLOAD CSV');
    return this.http.get('http://localhost:3000/export/festivals', {
      responseType: 'blob',
    });
  }
}

/* stolen from  nestjsx/crud  */
export interface GetManyDefaultResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
