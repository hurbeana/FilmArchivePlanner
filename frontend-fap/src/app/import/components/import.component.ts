import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const api = 'http://localhost:3000/import';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less'],
})
export class ImportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  private readonly files = new Map<string, FormData>();

  // types of entity that can be imported
  private readonly directors: string = 'directors';
  private readonly tags: string = 'tags';
  private readonly contacts: string = 'contacts';
  private readonly movies: string = 'movies';

  isDirectorsValid = false;
  isDirectorsSubmitted = false;
  directorsErrorMessage: string;

  isTagsValid = false;
  isTagsSubmitted = false;
  tagsErrorMessage: string;

  isContactsValid = false;
  isContactsSubmitted = false;
  contactsErrorMessage: string;

  isMoviesValid = false;
  isMoviesSubmitted = false;
  moviesErrorMessage: string;

  ngOnInit(): void {}

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(`[ImportComponent] - Selected ${type}`);
      const formData = new FormData();
      formData.append('file', file);
      this.files.set(type, formData);
      this.resetIsSubmitted(type);
    }
  }

  async importSelectedFiles() {
    console.log('[ImportComponent] - importSelectedFiles');
    if (!this.areFilesMissing()) {
      await this.importIfSelected(this.tags);
      await this.importIfSelected(this.directors);
      await this.importIfSelected(this.contacts);
      await this.importIfSelected(this.movies);
      await this.sendClearCacheRequest();
    }
  }

  private resetIsSubmitted(type: string) {
    switch (type) {
      case this.directors:
        this.isDirectorsSubmitted = false;
        break;
      case this.tags:
        this.isTagsSubmitted = false;
        break;
      case this.contacts:
        this.isContactsSubmitted = false;
        break;
      case this.movies:
        this.isMoviesSubmitted = false;
        break;
    }
  }

  private async importIfSelected(type: string) {
    if (this.files.has(type)) {
      await this.sendImportRequest(type);
      this.files.delete(type);
    }
  }

  private areFilesMissing(): boolean {
    if (this.files.has(this.contacts) && !this.files.has(this.tags)) {
      console.error(`[ImportComponent] - Cannot import contacts without tags`);
      this.setErrorMessage(
        this.contacts,
        'Cannot import contacts without tags.',
      );
      this.isContactsSubmitted = true;
      return true;
    } else if (
      this.files.has(this.movies) &&
      (!this.files.has(this.tags) ||
        !this.files.has(this.contacts) ||
        !this.files.has(this.directors))
    ) {
      console.error(
        `[ImportComponent] - Cannot import movies without tags, contacts and directors`,
      );
      this.setErrorMessage(
        this.movies,
        'Cannot import movies without tags, contacts and directors.',
      );
      this.isMoviesSubmitted = true;
      return true;
    }
    console.log(`[ImportComponent] - All necessary files available`);
    return false;
  }

  private async sendImportRequest(type: string) {
    try {
      console.log(`[ImportComponent] - Importing ${type}`);
      await this.http.post(`${api}/${type}`, this.files.get(type)).toPromise();
      this.setValid(type, true);
      this.setSubmitted(type, true);
    } catch (e) {
      console.error(`[ImportComponent] - importing ${type} failed`, e.error);
      this.setValid(type, false);
      this.setSubmitted(type, true);
      this.setErrorMessage(type, e.error.message);
    }
  }

  private setValid(type: string, isValid: boolean) {
    switch (type) {
      case this.directors:
        this.isDirectorsValid = isValid;
        break;
      case this.tags:
        this.isTagsValid = isValid;
        break;
      case this.contacts:
        this.isContactsValid = isValid;
        break;
      case this.movies:
        this.isMoviesValid = isValid;
        break;
    }
  }

  private setSubmitted(type: string, isSubmitted: boolean) {
    switch (type) {
      case this.directors:
        this.isDirectorsSubmitted = isSubmitted;
        break;
      case this.tags:
        this.isTagsSubmitted = isSubmitted;
        break;
      case this.contacts:
        this.isContactsSubmitted = isSubmitted;
        break;
      case this.movies:
        this.isMoviesSubmitted = isSubmitted;
        break;
    }
  }

  private setErrorMessage(type: string, message: string) {
    switch (type) {
      case this.directors:
        this.directorsErrorMessage = message;
        break;
      case this.tags:
        this.tagsErrorMessage = message;
        break;
      case this.contacts:
        this.contactsErrorMessage = message;
        break;
      case this.movies:
        this.moviesErrorMessage = message;
        break;
    }
  }

  private async sendClearCacheRequest() {
    console.log(`[ImportComponent] - Sending clear cache request`);
    await this.http.delete(`${api}/cache`).toPromise();
  }

  clearInput(type: string) {
    this.files.delete(type);
    this.setSubmitted(type, false);
  }
}
