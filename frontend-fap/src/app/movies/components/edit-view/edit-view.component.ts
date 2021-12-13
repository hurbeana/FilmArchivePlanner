import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as MovieActions from '../../state/movies.actions';
import {
  createdMovieSuccess,
  createMovie,
  createMovieFailed,
  getMovie,
  updatedMovieSuccess,
  updateMovie,
  updateMovieFailed,
} from '../../state/movies.actions';
import {
  selectContactItems,
  selectDetailsMovie,
  selectDirectorItems,
  selectTagsAnimationItems,
  selectTagsCategoryItems,
  selectTagsCountryItems,
  selectTagsKeywordItems,
  selectTagsLanguageItems,
  selectTagsSoftwareItems,
} from '../../state/movies.selectors';
import { Director } from 'src/app/directors/models/director';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDto } from '../../../shared/models/file';
import * as DirectorActions from 'src/app/directors/state/directors.actions';
import * as ContactActions from 'src/app/contacts/state/contacts.actions';
import * as TagActions from 'src/app/tags/state/tags.actions';
import { Contact } from '../../../contacts/models/contact';
import { Tag } from '../../../tags/models/tag';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.less'],
})
export class EditViewComponent implements OnInit {
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions$: Actions,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    /* Fetch lists for dropdowns */
    this.store.dispatch(DirectorActions.getDirectors({ page: 1, limit: 30 }));
    this.store.dispatch(ContactActions.getContacts({ page: 1, limit: 30 }));
    this.store.dispatch(
      TagActions.getTags({ page: 1, limit: 50 }) //can get more as tagtypes share one list
    );

    this.actions$
      .pipe(
        ofType(createdMovieSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Movie created successfully',
            'OK',
            'success-snackbar'
          );
          this.moviesForm.reset();
          this.resetFileFormArrays();
          this.store.dispatch(MovieActions.getMovies({ page: 1, limit: 16 }));
          this.router.navigate(['/movies']);
        })
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(createMovieFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        })
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(updateMovieFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        })
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(updatedMovieSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Movie was updated successfully',
            'OK',
            'success-snackbar'
          );
          this.store.dispatch(MovieActions.getMovies({ page: 1, limit: 16 }));
          this.router.navigate(['/movies']);
        })
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: [panelClass],
    });
  }

  moviesForm = new FormGroup({
    originalTitle: new FormControl('', [Validators.required]),
    englishTitle: new FormControl('', [Validators.required]),
    movieFiles: new FormArray([]),
    dcpFiles: new FormArray([]),
    previewFile: new FormGroup({}),
    trailerFile: new FormGroup({}),
    stillFiles: new FormArray([]),
    subtitleFiles: new FormArray([]),
    directors: new FormControl('', [Validators.required]),
    countriesOfProduction: new FormControl([]), // TODO: tags
    yearOfProduction: new FormControl(),
    duration: new FormControl('', [Validators.required]),
    animationTechniques: new FormControl([]), // TODO: tags
    softwareUsed: new FormControl([]), // TODO: tags
    keywords: new FormControl([]), //TODO: tags
    germanSynopsis: new FormControl('', [Validators.required]),
    englishSynopsis: new FormControl('', [Validators.required]),
    submissionCategories: new FormControl(),
    hasDialog: new FormControl(),
    dialogLanguages: new FormControl([]), //TODO: tags
    hasSubtitles: new FormControl(),
    isStudentFilm: new FormControl(false, [Validators.required]), // required makes no sense for checkbox
    filmSchool: new FormControl(),
    script: new FormControl(),
    animation: new FormControl(),
    editing: new FormControl(),
    sound: new FormControl(),
    music: new FormControl(),
    productionCompany: new FormControl(),
    contact: new FormControl('', [Validators.required]),
  });

  getSubmissionTagsFormGroup() {
    return (this.moviesForm.controls['submissionCategories'] as FormArray)
      .controls[0] as FormGroup;
  }

  getContactForm() {
    return this.moviesForm.controls['contact'] as FormGroup;
  }

  //TODO: directors liste vom backend/store laden

  directors: Observable<Director[]>;
  contacts: Observable<Contact[]>;

  tagsAnimation: Observable<Tag[]>;
  tagsCategory: Observable<Tag[]>;
  tagsCountry: Observable<Tag[]>;
  tagsKeyword: Observable<Tag[]>;
  tagsLanguage: Observable<Tag[]>;
  tagsSoftware: Observable<Tag[]>;

  id: number;

  ngOnInit(): void {
    this.directors = this.store.select(selectDirectorItems);
    this.contacts = this.store.select(selectContactItems);
    /* tagtypes */
    this.tagsAnimation = this.store.select(selectTagsAnimationItems);
    this.tagsCategory = this.store.select(selectTagsCategoryItems);
    this.tagsCountry = this.store.select(selectTagsCountryItems);
    this.tagsKeyword = this.store.select(selectTagsKeywordItems);
    this.tagsLanguage = this.store.select(selectTagsLanguageItems);
    this.tagsSoftware = this.store.select(selectTagsSoftwareItems);

    this.store.select(selectDetailsMovie).subscribe((movie) => {
      if (movie && this.id) {
        console.log(movie);
        this.fillFilesFormGroup('movieFiles', movie.movieFiles);
        this.fillFilesFormGroup('dcpFiles', movie.dcpFiles);
        this.fillFilesFormGroup('subtitleFiles', movie.subtitleFiles);
        this.fillFilesFormGroup('stillFiles', movie.stillFiles);
        if (movie.trailerFile) {
          (this.moviesForm.controls['trailerFile'] as FormGroup).addControl(
            'id',
            new FormControl('')
          );
          (this.moviesForm.controls['trailerFile'] as FormGroup).addControl(
            'path',
            new FormControl('')
          );
          (this.moviesForm.controls['trailerFile'] as FormGroup).addControl(
            'mimetype',
            new FormControl('')
          );
          (this.moviesForm.controls['trailerFile'] as FormGroup).addControl(
            'filename',
            new FormControl('')
          );
        }
        if (movie.previewFile) {
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'id',
            new FormControl('')
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'path',
            new FormControl('')
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'mimetype',
            new FormControl('')
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'filename',
            new FormControl('')
          );
        }
        this.moviesForm.patchValue(movie);
      }
    });

    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      console.log(this.id);
      if (this.id) {
        this.store.dispatch(getMovie({ id: this.id })); // load movie by id
      }
    });
  }

  fillFilesFormGroup(name: string, files?: FileDto[]) {
    files?.forEach((s) =>
      (this.moviesForm.controls[name] as FormArray).push(
        new FormGroup({
          id: new FormControl(''),
          path: new FormControl(''),
          mimetype: new FormControl(''),
          filename: new FormControl(''),
        })
      )
    );
  }

  onSubmit() {
    console.log(this.moviesForm.value);
    if (this.moviesForm.valid) {
      if (this.id) {
        // update
        this.store.dispatch(
          updateMovie({ id: this.id, movie: this.moviesForm.value })
        );
      } else {
        // create
        this.store.dispatch(createMovie({ movie: this.moviesForm.value }));
      }
    } else {
      this.openSnackBar('Validation Error!', 'OK', 'error-snackbar');
      this.getFormValidationErrors();
    }
  }

  resetFileFormArrays() {
    this.moviesForm.controls['movieFiles'] = new FormArray([]);
    this.moviesForm.controls['dcpFiles'] = new FormArray([]);
    this.moviesForm.controls['stillFiles'] = new FormArray([]);
    this.moviesForm.controls['subtitleFiles'] = new FormArray([]);
  }

  compareSelectObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  getFormValidationErrors() {
    if (this.moviesForm) {
      Object.keys(this.moviesForm.controls).forEach((key) => {
        const controlErrors = this.moviesForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            console.log(
              'Key control: ' +
                key +
                ', keyError: ' +
                keyError +
                ', err value: ',
              controlErrors[keyError]
            );
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  doSomethingLocally() {}

  // All Validation messages
  validation_messages = {
    username: [
      // example (we have no username)
      { type: 'required', message: 'Username is required' },
      {
        type: 'minlength',

        message: 'Username must be at least 5 characters long',
      },
      {
        type: 'maxlength',
        message: 'Username cannot be more than 25 characters long',
      },
      {
        type: 'pattern',
        message: 'Your username must contain only numbers and letters',
      },
      {
        type: 'validUsername',
        message: 'Your username has already been taken',
      },
    ],
    originalTitle: [
      { type: 'required', message: 'Original Title is required' },
    ],
    englishTitle: [{ type: 'required', message: 'English Title is required' }],
    movieFiles: [{ type: 'required', message: 'Movie File is required' }],
    directors: [{ type: 'required', message: 'Directors are required' }],
    duration: [{ type: 'required', message: 'Duration is required' }],
    germanSynopsis: [
      { type: 'required', message: 'German Synopsis is required' },
    ],
    englishSynopsis: [
      { type: 'required', message: 'English Synopsis is required' },
    ],
    isStudentFilm: [
      { type: 'required', message: 'Is Studentfilm is required' },
    ],
    contact: [{ type: 'required', message: 'Contact is required' }],
    submissionCategories: undefined,
    dialogLanguages: undefined,
    keywords: undefined,
    softwareUsed: undefined,
    animationTechniques: undefined,
    productionCompany: undefined,
    music: undefined,
    sound: undefined,
    editing: undefined,
    animation: undefined,
    script: undefined,
    yearOfProduction: undefined,
    countriesOfProduction: undefined,
  };
}
