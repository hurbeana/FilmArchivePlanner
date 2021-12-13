import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MovieService } from '../../../movies/services/movie.service';
import { DirectorService } from '../../../directors/services/director.service';
import { ContactService } from '../../../contacts/services/contact.service';
import { TagService } from '../../../tags/services/tag.service';

@Component({
  selector: 'export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.less'],
})
export class ExportButtonComponent implements OnInit {
  @Input() downloadType: 'movies' | 'directors' | 'contacts' | 'tags';

  downloadLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private movieService: MovieService,
    private directorService: DirectorService,
    private contactService: ContactService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {}

  downloadCSV() {
    this.downloadLoading.next(true);
    let service = null;
    if (this.downloadType == 'movies') {
      service = this.movieService;
    } else if (this.downloadType == 'directors') {
      service = this.directorService;
    } else if (this.downloadType == 'contacts') {
      service = this.contactService;
    } else if (this.downloadType == 'tags') {
      service = this.tagService;
    }
    if (service !== null) {
      service.downloadCSV().subscribe((results: any) => {
        const url = window.URL.createObjectURL(results);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = results.filename
          ? results.filename
          : `${this.downloadType}-export.csv`;
        a.click();
        this.downloadLoading.next(false);
        window.URL.revokeObjectURL(url);
        a.remove();
      });
    }
  }
}
