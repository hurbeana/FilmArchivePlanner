import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FestivalEvent } from '../models/event';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { FestivalEventDTO } from '../models/event.dto';
import { map } from 'rxjs/operators';

const api = 'http://localhost:3000/events';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  /**
   * This is a function to get all possible event types.
   *
   * @returns the array of possible event types
   */
  getEventTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${api}/types`);
  }

  createFestivalEvent(festivalEvent: FestivalEvent): Observable<FestivalEvent> {
    console.log('[FestivalEventService] - CREATE FestivalEvent');
    const { id, ...eventNoId } = festivalEvent; //this.eventToDTO(festivalEvent);
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'movie' }],
    });
    return this.http
      .post<FestivalEventDTO>(api, eventNoId, {
        params: rb.queryObject,
      })
      .pipe(map((e) => this.DTOtoEvent(e)));
  }

  updateFestivalEvent(festivalEvent: FestivalEvent) {
    console.log(
      '[FestivalEventService] - UPDATE FestivalEvent ',
      festivalEvent.id,
    );
    const { id, ...eventNoId } = this.eventToDTO(festivalEvent);
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'movie' }],
    });
    return this.http
      .put<FestivalEventDTO>(`${api}/${id}`, eventNoId, {
        params: rb.queryObject,
      })
      .pipe(map((e) => this.DTOtoEvent(e)));
  }

  deleteFestivalEvent(festivalEvent: FestivalEvent) {
    console.log(
      '[FestivalEventService] - DELETE FestivalEvent ',
      festivalEvent.id,
    );
    return this.http.delete(`${api}/${festivalEvent.id}`);
  }

  eventToDTO(event: FestivalEvent): FestivalEventDTO {
    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
    };
  }

  DTOtoEvent(dto: FestivalEventDTO): FestivalEvent {
    return {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    };
  }
}
