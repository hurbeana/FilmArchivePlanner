import { Component, Input, OnInit } from '@angular/core';
import * as MovieSelectors from '../../movies/state/movies.selectors';
import * as DirectorSelectors from '../../directors/state/directors.selectors';
import * as ContactSelectors from '../../contacts/state/contacts.selectors';
import * as TagSelectors from '../../tags/state/tags.selectors';
import * as FestivalSelectors from '../../festivals/state/festivals.selectors';
import { Store } from '@ngrx/store';
import { FileDto } from '../models/file';

@Component({
  selector: 'details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  @Input()
  type: 'Movie' | 'Director' | 'Contact' | 'Tag' | 'Festival';
  object: any;
  renderObject: any;
  properties: any[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.type === 'Movie') {
      this.store
        .select(MovieSelectors.selectSelectedMovie)
        .subscribe((selectedMovie) => {
          this.object = selectedMovie;

          console.log('Selected Movie', selectedMovie);
          console.log(selectedMovie?.directors);
        });
    } else if (this.type === 'Director') {
      this.store
        .select(DirectorSelectors.selectSelectedDirector)
        .subscribe((selectedDirector) => {
          this.object = selectedDirector;
        });
    } else if (this.type === 'Contact') {
      this.store
        .select(ContactSelectors.selectSelectedContact)
        .subscribe((selectedContact) => {
          this.object = selectedContact;
        });
    } else if (this.type === 'Tag') {
      this.store
        .select(TagSelectors.selectSelectedTag)
        .subscribe((selectedTag) => {
          this.object = selectedTag;
        });
    } else if (this.type === 'Festival') {
      this.store
        .select(FestivalSelectors.selectSelectedFestival)
        .subscribe((selectedFestival) => {
          this.object = selectedFestival;
        });
    }
  }

  getDownloadLink(filetyp: string, file?: FileDto): string {
    if (!file) return '';
    return `http://localhost:3000/files/${file.id}?fileType=${filetyp}`;
  }
  printFile(file?: FileDto) {
    if (!file) {
      return '';
    }
    return [file.filename].join('/');
  }
}
