import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { CreateUpdateTagDto } from '../models/create.tag';
import { TagsPaginationState } from '../../app.state';

const api: string = 'http://localhost:3000/tags'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient) {}

  createTag(tag: CreateUpdateTagDto): Observable<Tag> {
    console.log('[TagService] - CREATE TAG');
    return this.http.post<Tag>(api, tag);
  }

  getTags(
    search: string,
    page: number,
    limit: number
  ): Observable<TagsPaginationState> {
    console.log(
      '[TagService] - GET TAGS WITH SEARCH PAGE AND LIMIT',
      "'" + search + "'",
      page,
      limit
    );
    let params;
    if (search == '') {
      params = new HttpParams({ fromObject: { page: page, limit: limit } });
    } else {
      params = new HttpParams({
        fromObject: { searchstring: search, page: page, limit: limit },
      });
    }
    return this.http.get<TagsPaginationState>(api, { params: params });
  }

  updateTag(tag: CreateUpdateTagDto, id: number) {
    console.log('[TagService] - UPDATE TAG');
    return this.http.put<Tag>(`${api}/${id}`, tag);
  }

  deleteTag(tag: Tag) {
    console.log('[TagService] - DELETE TAG', tag.id);
    return this.http.delete(`${api}/${tag.id}`);
  }

  checkIfTagIsInUse(tag: Tag): Observable<Boolean> {
    console.log('[MovieService] - CHECK IF TAG IS IN USE', tag.id);
    return this.http.get<Boolean>(`${api}/tagIdIsInUse/${tag.id}`);
  }
}
