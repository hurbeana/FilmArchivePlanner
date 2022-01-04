import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const api = 'http://localhost:3000/events';

@Injectable({ providedIn: 'root' })
export class FestivalService {
  constructor(private http: HttpClient) {}

  /**
   * This is a function to get all possible event types.
   *
   * @returns the array of possible event types
   */
  getEventTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${api}/types`);
  }
}
