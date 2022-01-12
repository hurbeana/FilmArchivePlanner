import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MoviesState } from '../../../app.state';
import { Movie } from '../../models/movie';
import { getMovie } from '../../state/movies.actions';
import { selectDetailsMovie } from '../../state/movies.selectors';
import { FileDto } from '../../../shared/models/file';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Tag } from '../../../tags/models/tag';
import * as ContactSelectors from '../../../contacts/state/contacts.selectors';
import * as ContactActions from '../../../contacts/state/contacts.actions';

import { Contact } from '../../../contacts/models/contact';
@Component({
  selector: 'app-full-detail-view',
  templateUrl: './full-detail-view.component.html',
  styleUrls: ['./full-detail-view.component.less'],
})
export class FullDetailViewComponent implements OnInit {
  movie?: Movie;
  contact?: Contact | null;
  id: number;

  images: GalleryItem[];
  @ViewChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<MoviesState>,
    public gallery: Gallery,
    public lightbox: Lightbox,
  ) {}

  ngOnInit(): void {
    this.store
      .select(ContactSelectors.selectSelectedContact)
      .subscribe((contact) => {
        this.contact = contact;
        console.log('CONTACT', contact);
      });
    this.store.select(selectDetailsMovie).subscribe((movie) => {
      this.movie = movie;
      if (movie?.contact.id) {
        this.store.dispatch(
          ContactActions.getContactByIdAndSetAsSelectedContact({
            id: movie.contact.id,
          }),
        );
      }
      this.images =
        this.movie?.stillFiles?.map(
          (s) =>
            new ImageItem({
              src: `http://localhost:3000/files/${s.id}?fileType=still_file`,
              thumb: `http://localhost:3000/files/${s.id}?fileType=still_file&width=120&height=80`,
            }),
        ) ?? [];
      console.log(movie);
    });

    this.route.params.subscribe((params) => {
      const id: number = +params['id'];
      if (id) {
        this.store.dispatch(getMovie({ id: id })); // load movie by id
      }
    });

    //const lightboxRef = this.gallery.ref("lightbox");

    // Add custom gallery config to the lightbox (optional)
    /*lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
      itemTemplate: this.itemTemplate,
      gestures: false
    });*/

    // Load items into the lightbox gallery ref
    //lightboxRef.load(this.images);
  }

  printFile(file?: FileDto) {
    if (!file) {
      return '';
    }
    return [file.path, file.filename].join('/');
  }

  getDownloadLink(filetyp: string, file?: FileDto): string {
    if (!file) return '';
    return `http://localhost:3000/files/${file.id}?fileType=${filetyp}`;
  }
  printTags(tags?: Tag[]) {
    console.log(tags);
    if (!tags) {
      return '';
    }
    return tags.map((f) => f.value).join(', ');
  }
}
