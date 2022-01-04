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

const api = 'http://localhost:3000/festivals';

@Injectable({ providedIn: 'root' })
export class FestivalService {
  constructor(private http: HttpClient) {}

  createFestival(festival: CreateUpdateFestivalDto): Observable<Festival> {
    console.log('[FestivalService] - CREATE FESTIVAL');
    return this.http.post<Festival>(api, festival);
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

    console.log(rb.query(false));
    return this.http.get<any>(api, { params: rb.queryObject }).pipe(
      map(
        // map to old format
        (page) =>
          ({
            items: page.data,
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
    return this.http.put<Festival>(`${api}/${id}`, festival);
  }

  deleteFestival(festival: Festival) {
    console.log('[FestivalService] - DELETE FESTIVAL', festival.id);
    return this.http.delete(`${api}/${festival.id}`);
  }

  downloadCSV() {
    console.log('[FestivalService] - DOWNLOAD CSV');
    return this.http.get('http://localhost:3000/export/festivals', {
      responseType: 'blob',
    });
  }
}
