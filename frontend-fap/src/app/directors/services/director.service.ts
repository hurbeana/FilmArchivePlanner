import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Director} from "../models/director";
import {CreateUpdateDirectorDto} from "../models/create.director";
import {DirectorsPaginationState} from "../../app.state";
import { FileDto } from "../../shared/models/file";

const api: string='http://localhost:3000/directors'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class DirectorService {
  constructor(private http: HttpClient) {}

  createDirector(director: CreateUpdateDirectorDto): Observable<Director> {
    console.log("[DirectorService] - CREATE DIRECTOR");
    return this.http.post<Director>(api, director);
  }

  getDirector(id: number){
    console.log("[DirectorService] - GET DIRECTOR: "+id);
    return this.http.get<Director>(`${api}/${id}`);
  }

  getDirectors(search: string, page: number, limit: number): Observable<DirectorsPaginationState> {
    console.log("[DirectorService] - GET DIRECTORS WITH SEARCH PAGE AND LIMIT", "'"+search+"'", page, limit);
    let params;
    if(search == ""){
      params = new HttpParams({fromObject : {'page': page, 'limit': limit}});
    }else{
      params = new HttpParams({fromObject : {'searchstring': search, 'page': page, 'limit': limit}});
    }
    return this.http.get<DirectorsPaginationState>(api, {params: params});
}

  updateDirector(id: number, director: CreateUpdateDirectorDto) {
    console.log("[DirectorService] - UPDATE DIRECTOR");
    return this.http.put<Director>(`${api}/${id}`, director);
  }

  deleteDirector(director: Director){
    console.log("[DirectorService] - DELETE DIRECTOR", director.id);
    return this.http.delete(`${api}/${director.id}`);
  }

  getDownloadLink(filetyp: string,file?: FileDto): string{
    if(!file) return "";
    return `http://localhost:3000/files/${file.id}?fileType=${filetyp}`
  }
}
