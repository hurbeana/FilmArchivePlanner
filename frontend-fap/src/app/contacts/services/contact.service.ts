import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Contact } from '../models/contact';
import { CreateUpdateContactDto } from '../models/create.contact';
import { ContactsPaginationState } from '../../app.state';
import {
  CondOperator,
  QuerySort,
  RequestQueryBuilder,
} from '@nestjsx/crud-request';
import { map, tap } from 'rxjs/operators';

const api = 'http://localhost:3000/contacts'; //TODO: url to rest

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  createContact(contact: CreateUpdateContactDto): Observable<Contact> {
    console.log('[ContactService] - CREATE CONTACT');
    return this.http.post<Contact>(api, contact);
  }

  getContact(id: number) {
    console.log('[ContactService] - GET CONTACT ID: ' + id);
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'typeId' }],
      //filter: { id: { $ne: true } },
    });
    return this.http.get<Contact>(api + '/' + id, { params: rb.queryObject });
  }

  getContacts(
    page: number,
    limit: number,
    orderBy: string | undefined,
    sortOrder: string | undefined,
    searchString: string | undefined,
  ): Observable<ContactsPaginationState> {
    console.log(
      '[ContactService] - GET CONTACTS WITH page, limit, orderBy, sortOrder, searchString',
      page,
      limit,
      orderBy,
      sortOrder,
      searchString,
    );

    const rb = RequestQueryBuilder.create({
      limit: limit,
      page: page,
      join: [{ field: 'type' }],
    });

    if (searchString) {
      rb.setOr([
        {
          field: 'name',
          operator: CondOperator.CONTAINS_LOW,
          value: searchString,
        },
        {
          field: 'type.value',
          operator: CondOperator.CONTAINS_LOW,
          value: searchString,
        },
        {
          field: 'email',
          operator: CondOperator.CONTAINS_LOW,
          value: searchString,
        },
        {
          field: 'phone',
          operator: CondOperator.CONTAINS_LOW,
          value: searchString,
        },
        {
          field: 'website',
          operator: CondOperator.CONTAINS_LOW,
          value: searchString,
        },
        /*
          {
            field: 'created_at',
            operator: CondOperator.CONTAINS_LOW, // does not work on Date Type
            value: searchString,
          },
           */
      ]);
    }

    if (sortOrder && orderBy) {
      rb.sortBy([
        { field: orderBy, order: sortOrder.toUpperCase() } as QuerySort,
      ]);
    }
    if (sortOrder === undefined && orderBy === undefined) {
      rb.sortBy([{ field: 'created_at', order: 'DESC' } as QuerySort]);
    }
    return this.http
      .get<GetManyDefaultResponse<Contact>>(api, { params: rb.queryObject })
      .pipe(
        tap((page) => console.log('PAGE', page)),
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
            } as ContactsPaginationState),
        ),
      );
  }

  getAllContacts(): Observable<Contact[]> {
    console.log('[ContactService] - GET ALL CONTACTS WITHOUT PAGING');
    return this.http.get<Contact[]>(`${api}`);
  }

  updateContact(contact: CreateUpdateContactDto, id: number) {
    console.log('[ContactService] - UPDATE CONTACT');
    const rb = RequestQueryBuilder.create({
      join: [{ field: 'type' }],
    });

    return this.http.put<Contact>(`${api}/${id}`, contact, {
      params: rb.queryObject,
    });
  }

  deleteContact(contact: Contact) {
    console.log('[ContactService] - DELETE CONTACT', contact.id);
    return this.http.delete(`${api}/${contact.id}`);
  }

  checkIfContactIsInUse(contact: Contact): Observable<boolean> {
    console.log('[TagService] - CHECK IF CONTACT IS IN USE', contact.id);
    return this.http.get<boolean>(`${api}/contactIdIsInUse/${contact.id}`);
  }

  downloadCSV() {
    console.log('[ContactService] - DOWNLOAD CSV');
    return this.http.get('http://localhost:3000/export/contacts', {
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
