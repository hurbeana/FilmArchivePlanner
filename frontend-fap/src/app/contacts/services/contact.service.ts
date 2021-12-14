import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Contact } from '../models/contact';
import { CreateUpdateContactDto } from '../models/create.contact';
import { ContactsPaginationState } from '../../app.state';

const api = 'http://localhost:3000/contacts'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  createContact(contact: CreateUpdateContactDto): Observable<Contact> {
    console.log('[ContactService] - CREATE CONTACT');
    return this.http.post<Contact>(api, contact);
  }

  getContacts(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<ContactsPaginationState> {
    console.log(
      '[TagService] - GET CONTACTS WITH page, limit, orderBy, sortOrder, searchString',
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
    return this.http.get<ContactsPaginationState>(api, { params: params });
  }

  updateContact(contact: CreateUpdateContactDto, id: number) {
    console.log('[ContactService] - UPDATE CONTACT');
    return this.http.put<Contact>(`${api}/${id}`, contact);
  }

  deleteContact(contact: Contact) {
    console.log('[ContactService] - DELETE CONTACT', contact.id);
    return this.http.delete(`${api}/${contact.id}`);
  }

  checkIfContactIsInUse(contact: Contact): Observable<boolean> {
    console.log('[TagService] - CHECK IF CONTACT IS IN USE', contact.id);
    return this.http.get<boolean>(`${api}/contactIdIsInUse/${contact.id}`);
  }
}
