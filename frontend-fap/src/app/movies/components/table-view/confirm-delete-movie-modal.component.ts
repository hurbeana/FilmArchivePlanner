import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'ngbd-modal-confirm',
  template: `
    <div *ngIf="initialized; else loadingBlock">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Movie deletion</h4>
        <button
          type="button"
          class="btn btn-md close"
          aria-label="Close button"
          aria-describedby="modal-title"
          (click)="modal.dismiss('Cross click')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>
          <strong
            >Are you sure you want to delete movie
            <span class="text-primary">{{ movieToDelete.englishTitle }}</span
            >?</strong
          >
        </p>
        <p>
          All information associated to this movie will be permanently
          removed.<br />
          <span class="text-danger">This action cannot be undone.</span>
        </p>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-light"
          (click)="modal.dismiss('cancel click')"
        >
          Cancel
        </button>
        <div *ngIf="movieHasFiles; then thenBlock; else elseBlock"></div>
        <ng-template #thenBlock>
          <span
            ngbPopover="The movie cannot be deleted because {{ errorReason }}."
            [openDelay]="200"
            [closeDelay]="400"
            triggers="mouseenter:mouseleave"
          >
            <button disabled="true" type="button" class="btn btn-danger">
              Ok
            </button>
          </span>
        </ng-template>
        <ng-template #elseBlock>
          <button
            type="button"
            class="btn btn-danger"
            (click)="modal.close(movieToDelete)"
          >
            Ok
          </button>
        </ng-template>
        <!-- autoFocus a button with ngbAutofocus as attribute-->
      </div>
    </div>
    <ng-template #loadingBlock
      ><div
        style="display: flex; justify-content: center; align-items: center; min-height:250px"
      >
        Loading...
      </div></ng-template
    >
  `,
})
export class ConfirmDeleteMovieModalComponent {
  movieToDelete: Movie;
  movieIsInUse: boolean; // TODO: Implement check in table
  movieHasFiles: boolean;
  errorReason: string;
  initialized = false;

  constructor(
    public modal: NgbActiveModal,
    private store: Store,
    private movieService: MovieService,
  ) {}
  ngOnInit() {
    this.movieService
      .getMovie(this.movieToDelete.id)
      .toPromise()
      .then((movie) => {
        const movieHasFiles = [movie.previewFile].some(
          (f) => f !== null,
        );

        this.movieHasFiles =
          movieHasFiles ||
          [
            movie.movieFiles,
            movie.dcpFiles,
            movie.stillFiles,
            movie.subtitleFiles,
          ].some((f) => (f ?? []).length > 0);

        if (this.movieHasFiles)
          this.errorReason = 'movie has files left, remove them first';
        else this.errorReason = 'movie is in use';
        this.initialized = true;
      });
  }
}
