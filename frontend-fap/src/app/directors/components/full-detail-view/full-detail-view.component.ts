import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Director } from '../../models/director';
import { getDirector } from '../../state/directors.actions';
import { selectDetailsDirector } from '../../state/directors.selectors';
import { DirectorsState } from '../../../app.state';
import { FileDto } from '../../../shared/models/file';
import { DirectorService } from '../../services/director.service';

@Component({
  selector: 'app-full-detail-view',
  templateUrl: './full-detail-view.component.html',
  styleUrls: ['./full-detail-view.component.less'],
})
export class FullDetailViewComponent implements OnInit {
  director?: Director;
  id: number;

  //images: GalleryItem[];
  @ViewChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<DirectorsState>,
    private directorService: DirectorService,
  ) {}

  ngOnInit(): void {
    this.store.select(selectDetailsDirector).subscribe((director) => {
      console.log(director);
      this.director = director;
    });

    this.route.params.subscribe((params) => {
      const id: number = +params['id'];
      if (id) {
        this.store.dispatch(getDirector({ id: id })); // load director by id
      }
    });
  }

  printFile(file?: FileDto) {
    if (!file) {
      return 'empty';
    }
    return [file.filename].join('/');
  }

  getDownloadLink(filetyp: string, file?: FileDto) {
    return this.directorService.getDownloadLink(filetyp, file);
  }
}
