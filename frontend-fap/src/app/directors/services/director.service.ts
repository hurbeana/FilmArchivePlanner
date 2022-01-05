import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Director } from '../models/director';
import { CreateUpdateDirectorDto } from '../models/create.director';
import { DirectorsPaginationState } from '../../app.state';
import { FileDto } from '../../shared/models/file';

const api = 'http://localhost:3000/directors'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class DirectorService {
  constructor(private http: HttpClient) {}

  createDirector(director: CreateUpdateDirectorDto): Observable<Director> {
    console.log('[DirectorService] - CREATE DIRECTOR');
    return this.http.post<Director>(api, director);
  }

  getDirector(id: number) {
    console.log('[DirectorService] - GET DIRECTOR: ' + id);
    return this.http.get<Director>(`${api}/${id}`);
  }

  getDirectors(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<DirectorsPaginationState> {
    console.log(
      '[DirectorService] - GET DIRECTORS WITH page, limit, orderBy, sortOrder, searchString',
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

    return this.http.get<DirectorsPaginationState>(api, { params: params });
  }

  updateDirector(id: number, director: CreateUpdateDirectorDto) {
    console.log('[DirectorService] - UPDATE DIRECTOR');
    return this.http.put<Director>(`${api}/${id}`, director);
  }

  deleteDirector(director: Director) {
    console.log('[DirectorService] - DELETE DIRECTOR', director.id);
    return this.http.delete(`${api}/${director.id}`);
  }

  checkIfDirectorIsInUse(director: Director): Observable<boolean> {
    console.log('[DirectorService] - CHECK IF DIRECTOR IS IN USE', director.id);
    return this.http.get<boolean>(`${api}/directorIdIsInUse/${director.id}`);
  }

  getDownloadLink(filetyp: string, file?: FileDto): string {
    if (!file) return '';
    return `http://localhost:3000/files/${file.id}?fileType=${filetyp}`;
  }

  downloadCSV() {
    console.log('[DirectorService] - DOWNLOAD CSV');
    return this.http.get(`http://localhost:3000/export/directors`, {
      responseType: 'blob',
    });
  }
}
