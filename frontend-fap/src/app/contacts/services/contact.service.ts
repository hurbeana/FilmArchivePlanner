import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Contact } from '../models/contact';
import { CreateUpdateContactDto } from '../models/create.contact';
import { ContactsPaginationState } from '../../app.state';

const api: string = 'http://localhost:3000/contacts'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  createContact(contact: CreateUpdateContactDto): Observable<Contact> {
    console.log('[ContactService] - CREATE CONTACT');
    return this.http.post<Contact>(api, contact);
  }

  getContacts(
    search: string,
    page: number,
    limit: number
  ): Observable<ContactsPaginationState> {
    console.log(
      '[ContactService] - GET CONTACTS WITH SEARCH PAGE AND LIMIT',
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
    return this.http.get<ContactsPaginationState>(api, { params: params });
  }

  updateContact(contact: Contact) {
    console.log('[ContactService] - UPDATE CONTACT');
    return this.http.put(api, contact);
  }

  deleteContact(contact: Contact) {
    console.log('[ContactService] - DELETE CONTACT', contact.id);
    return this.http.delete(`${api}/${contact.id}`);
  }
}
