import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import * as MovieSelector from '../../state/movies.selectors';
import { FileDto } from '../../../shared/models/file';
import { Tag } from '../../../tags/models/tag';

@Component({
  selector: 'movies-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  movie: Movie | null | undefined;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(MovieSelector.selectMovie).subscribe((movie) => {
      this.movie = movie;
    });
  }

  printFiles(files?: FileDto[]) {
    if (!files) {
      return '';
    }
    return files.map((f) => this.printFile(f));
  }
  printTags(tags?: Tag[]) {
    if (!tags) {
      return '';
    }
    return tags.map((f) => f.value).join(', ');
  }
  printFile(file?: FileDto) {
    if (!file) {
      return '';
    }
    return [file.path, file.filename].join('/');
  }
}
