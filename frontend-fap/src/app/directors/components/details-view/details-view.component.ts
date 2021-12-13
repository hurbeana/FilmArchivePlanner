import { Component, Input, OnInit } from '@angular/core';
import { Director } from '../../models/director';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FileDto } from '../../../shared/models/file';
import { DirectorService } from '../../services/director.service';
import * as DirectorSelector from '../../state/directors.selectors';

@Component({
  selector: 'directors-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  @Input() director: Director | null | undefined;

  constructor(
    private directorService: DirectorService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select(DirectorSelector.selectSelectedDirector)
      .subscribe((director) => {
        this.director = director;
      });
  }

  getDownloadLink(filetyp: string, file?: FileDto) {
    return this.directorService.getDownloadLink(filetyp, file);
  }

  printFile(file?: FileDto) {
    if (!file) {
      return 'empty';
    }
    return [file.filename].join('/');
  }
}
