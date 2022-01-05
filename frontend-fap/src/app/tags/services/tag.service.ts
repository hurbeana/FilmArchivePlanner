import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { CreateUpdateTagDto } from '../models/create.tag';
import { TagsPaginationState } from '../../app.state';

const api = 'http://localhost:3000/tags'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient) {}

  createTag(tag: CreateUpdateTagDto): Observable<Tag> {
    console.log('[TagService] - CREATE TAG');
    return this.http.post<Tag>(api, tag);
  }

  getTags(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<TagsPaginationState> {
    console.log(
      '[TagService] - GET TAGS WITH page, limit, orderBy, sortOrder, searchString',
      page,
      limit,
      orderBy,
      sortOrder,
      searchString,
    );

    const params = new HttpParams({
      fromObject: {
        page: page,
        limit: limit,
        ...(orderBy !== undefined && { orderBy: orderBy }),
        ...(sortOrder !== undefined && { sortOrder: sortOrder }),
        ...(searchString !== undefined && { searchString: searchString }),
      },
    });

    return this.http.get<TagsPaginationState>(api, { params: params });
  }

  getAllTags(): Observable<Tag[]> {
    console.log('[TagService] - GET ALL MOVIE TAGS WITHOUT PAGING');
    return this.http.get<Tag[]>(`${api}/all`);
  }

  updateTag(tag: CreateUpdateTagDto, id: number) {
    console.log('[TagService] - UPDATE TAG');
    return this.http.put<Tag>(`${api}/${id}`, tag);
  }

  deleteTag(tag: Tag) {
    console.log('[TagService] - DELETE TAG', tag.id);
    return this.http.delete(`${api}/${tag.id}`);
  }

  checkIfTagIsInUse(tag: Tag): Observable<boolean> {
    console.log('[TagService] - CHECK IF TAG IS IN USE', tag.id);
    return this.http.get<boolean>(`${api}/tagIdIsInUse/${tag.id}`);
  }

  getTagsByType(tagType: string): Observable<Tag[]> {
    console.log('[TagService] - GET TAGS BY TYPE', tagType);
    return this.http.get<Tag[]>(`${api}/type/${tagType}`);
  }

  downloadCSV() {
    console.log('[TagService] - DOWNLOAD CSV');
    return this.http.get(`http://localhost:3000/export/tags`, {
      responseType: 'blob',
    });
  }
}
