import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MoviesState } from '../../../app.state';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as MovieActions from '../../state/movies.actions';
import {
  createMovieSuccess,
  createMovie,
  createMovieFailed,
  getMovie,
  updateMovieSuccess,
  updateMovie,
  updateMovieFailed,
  setSelectedMovie,
} from '../../state/movies.actions';
import { selectDetailsMovie } from '../../state/movies.selectors';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDto } from '../../../shared/models/file';
import { Contact } from '../../../contacts/models/contact';
import { Tag } from '../../../tags/models/tag';
import { Movie } from '../../models/movie';
import { DirectorService } from '../../../directors/services/director.service';
import { ContactService } from '../../../contacts/services/contact.service';
import { DirectorReference } from 'src/app/directors/models/director-ref';
import { createLoadingItem } from '../../../core/loading-item-state/loading.items.actions';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TagInputComponent } from '../../../shared/components/tag-input/tag-input.component';
import { DurationFormatPipe } from '../../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.less'],
})
export class EditViewComponent implements OnInit {
  destroy$ = new Subject();
  formIsSubmitted = false;

  @ViewChild('directorNgSelect') directorNgSelect: NgSelectComponent;
  @ViewChild('contactNgSelect') contactNgSelect: NgSelectComponent;
  @ViewChild('countriesOfProductionInput')
  countriesOfProductionInput: TagInputComponent;
  @ViewChild('dialogLanguagesInput') dialogLanguagesInput: TagInputComponent;
  @ViewChild('animationTechniquesInput')
  animationTechniquesInput: TagInputComponent;
  @ViewChild('submissionCategoriesInput')
  submissionCategoriesInput: TagInputComponent;
  @ViewChild('softwareUsedInput') softwareUsedInput: TagInputComponent;
  @ViewChild('keywordsInput') keywordsInput: TagInputComponent;
  @ViewChild('selectionTagsInput') selectionTagsInput: TagInputComponent;

  moviesForm = new FormGroup({
    originalTitle: new FormControl('', [Validators.required]),
    englishTitle: new FormControl('', [Validators.required]),
    movieFiles: new FormArray([]),
    dcpFiles: new FormArray([]),
    previewFile: new FormGroup({}),
    stillFiles: new FormArray([]),
    subtitleFiles: new FormArray([]),
    directors: new FormControl([], [Validators.required]),
    selectionTags: new FormControl([]),
    countriesOfProduction: new FormControl([]),
    yearOfProduction: new FormControl('', [
      Validators.min(0),
      this.customNumberValidator2(),
    ]),
    duration: new FormControl('', [
      this.customDurationValidator(),
      Validators.required,
    ]),
    animationTechniques: new FormControl([]),
    softwareUsed: new FormControl(),
    keywords: new FormControl([]),
    germanSynopsis: new FormControl('', [Validators.required]),
    englishSynopsis: new FormControl('', [Validators.required]),
    submissionCategories: new FormControl(),
    hasDialog: new FormControl(),
    dialogLanguages: new FormControl([]),
    hasSubtitles: new FormControl(),
    isStudentFilm: new FormControl(false, [Validators.required]), // required makes no sense for checkbox
    filmSchool: new FormControl(),
    script: new FormControl(),
    animation: new FormControl(),
    editing: new FormControl(),
    sound: new FormControl(),
    music: new FormControl(),
    productionCompany: new FormControl(),
    referenceNumber: new FormControl(),
    previewLink: new FormControl(),
    contact: new FormControl({}, [
      Validators.required,
      this.customContactValidator(),
    ]),
  });

  directors: Observable<DirectorReference[]>;
  contacts: Observable<Contact[]>;

  id: number;
  movie: Movie;
  // All Validation messages
  validation_messages: { [key: string]: any } = {
    originalTitle: [
      { type: 'required', message: 'Original Title is required' },
    ],
    englishTitle: [{ type: 'required', message: 'English Title is required' }],
    directors: [{ type: 'required', message: 'Directors are required' }],
    contact: [{ type: 'required', message: 'Contact is required' }],
    duration: [
      { type: 'min', message: 'Duration must be > 0' },
      { type: 'notANumber', message: 'Duration is required' },
      { type: 'required', message: 'Duration is required' },
    ],
    yearOfProduction: [
      { type: 'min', message: 'Year of Production must be > 0' },
      { type: 'notANumber2', message: 'Year of Production has to be a number' },
    ],
    germanSynopsis: [
      { type: 'required', message: 'German Synopsis is required' },
    ],
    englishSynopsis: [
      { type: 'required', message: 'English Synopsis is required' },
    ],
  };

  customNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return isNaN(+control.value)
        ? { notANumber: { value: control.value } }
        : null;
    };
  }

  customNumberValidator2(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        control.value === undefined ||
        control.value === null ||
        control.value === ''
      ) {
        return null;
      }
      return isNaN(+control.value)
        ? { notANumber2: { value: control.value } }
        : null;
    };
  }

  customDurationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rexexp = new RegExp('^[0-9]{1,3}:[0-9]{2}$');
      return rexexp.test(control.value)
        ? { required: { value: control.value } }
        : null;
    };
  }

  customContactValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value);
      return isNaN(control.value.id)
        ? { required: { value: control.value } }
        : null;
    };
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<MoviesState>,
    private actions$: Actions,
    private _snackBar: MatSnackBar,
    private router: Router,
    private directorService: DirectorService,
    private contactService: ContactService,
    private durationFormatPipe: DurationFormatPipe
  ) {
    /* Fetch lists for dropdowns */
    this.directors = this.directorService.getAllDirectorsAsReferences();
    this.contacts = this.contactService.getAllContacts();

    this.actions$
      .pipe(
        ofType(createMovieSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Movie created successfully',
            'OK',
            'success-snackbar',
          );
          this.moviesForm.reset();
          this.resetFileFormArrays();
          this.store.dispatch(MovieActions.getMovies({ page: 1, limit: 16 }));
          this.destroy$.next();
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(createMovieFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(updateMovieFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(updateMovieSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Movie was updated successfully',
            'OK',
            'success-snackbar',
          );
          this.store.dispatch(MovieActions.getMovies({ page: 1, limit: 16 }));
          this.destroy$.next();
        }),
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBar.open(message, action, {
      duration: 8000,
      panelClass: [panelClass],
    });
  }

  ngOnInit(): void {
    this.store.select(selectDetailsMovie).subscribe((movie) => {
      console.log('SUBSC', movie);

      if (movie && this.id) {
        console.log('ASSIGNMENT HAPPENS!');
        this.movie = { ...movie };

        this.fillFilesFormGroup('movieFiles', movie.movieFiles);
        this.fillFilesFormGroup('dcpFiles', movie.dcpFiles);
        this.fillFilesFormGroup('subtitleFiles', movie.subtitleFiles);
        this.fillFilesFormGroup('stillFiles', movie.stillFiles);

        if (movie.previewFile) {
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'id',
            new FormControl(''),
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'path',
            new FormControl(''),
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'mimetype',
            new FormControl(''),
          );
          (this.moviesForm.controls['previewFile'] as FormGroup).addControl(
            'filename',
            new FormControl(''),
          );
        }
        this.moviesForm.patchValue(movie);
      } else {
        console.log('DUMMY ASSIGNMENT!');
        const emptyMovie = {
          animation: '',
          animationTechniques: [],
          contact: {
            id: NaN,
            type: {
              id: NaN,
              value: '',
              type: '',
              user: '',
              public: true,
              created_at: '',
            },
            name: '',
            created_at: '',
          },
          countriesOfProduction: [],
          dcpFiles: [],
          dialogLanguages: [],
          editing: '',
          filmSchool: '',
          hasDialog: false,
          hasSubtitles: false,
          isStudentFilm: false,
          keywords: [],
          movieFiles: [],
          previewFile: undefined,
          productionCompany: '',
          referenceNumber: '',
          previewLink: '',
          script: '',
          selectionTags: [],
          softwareUsed: [],
          sound: '',
          stillFiles: [],
          submissionCategories: [],
          subtitleFiles: [],
          yearOfProduction: undefined,
          id: NaN,
          originalTitle: '',
          englishTitle: '',
          directors: [],
          duration: 0, // 0
          germanSynopsis: '',
          englishSynopsis: '',
          created_at: new Date(),
          last_updated: new Date(),
        };

        this.movie = { ...emptyMovie };

        this.moviesForm.patchValue(this.movie);
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
        }),
      ),
    );
  }

  onSubmit() {
    if (this.moviesForm.valid) {
      this.movie.duration = this.durationFormatPipe.transform(this.moviesForm.value.duration);
      // update
      console.log(this.movie);
      console.log('FORM', this.moviesForm.value);

      this.moviesForm.patchValue({
        duration: this.movie.duration,
        countriesOfProduction: this.movie.countriesOfProduction,
        animationTechniques: this.movie.animationTechniques,
        submissionCategories: this.movie.submissionCategories,
        keywords: this.movie.keywords,
        dialogLanguages: this.movie.dialogLanguages,
        softwareUsed: this.movie.softwareUsed,
        selectionTags: this.movie.selectionTags,
      });

      console.log('FORM AFTER PATCH', this.moviesForm.value);

      if (this.id) {
        this.store.dispatch(
          updateMovie({
            id: this.id,
            movie: this.moviesForm.value,
            page: 1,
            limit: 16,
            orderBy: '',
            sortOrder: '',
            searchString: '',
          }),
        );
      } else {
        // create
        this.store.dispatch(
          createMovie({
            movieToCreate: this.moviesForm.value,
            searchOptions: {
              page: 1,
              limit: 16,
            },
          }),
        );
      }
      this.store.dispatch(
        createLoadingItem({
          loadingItem: { title: this.moviesForm.value.originalTitle },
        }),
      );
      this.store.dispatch(setSelectedMovie({ selectedMovie: null }));
      this.router.navigate(['/movies']);
    } else {
      this.formIsSubmitted = true;

      this.openSnackBar('Required Fields are missing', 'OK', 'error-snackbar');
      console.log(this.getFormValidationErrors());
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

  getValidationMessage(field: string): string {
    const messages: string[] = [];
    const controlErrors = this.moviesForm.get(field)?.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach((keyError) =>
        messages.push(
          this.validation_messages[field]?.find(
            (key: any) => key.type === keyError,
          ).message,
        ),
      );
    }
    return messages.shift() ?? field + 'is invalid';
  }

  getFormValidationErrors(): unknown[] {
    const errorMsgs: unknown[] = [];

    if (this.moviesForm) {
      Object.keys(this.moviesForm.controls).forEach((key) => {
        const controlErrors = this.moviesForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            errorMsgs.push({ keyControl: key, keyError: keyError });
          });
        }
      });
    }
    return errorMsgs;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngAfterViewInit() {}

  clearDirectors() {
    this.directorNgSelect.clearModel();
  }
  clearContact() {
    this.contactNgSelect.clearModel();
  }
  clearCountries() {
    this.countriesOfProductionInput.ngSelect.clearModel();
  }
  clearDialogLanguages() {
    this.dialogLanguagesInput.ngSelect.clearModel();
  }
  clearAnimationTechniques() {
    this.animationTechniquesInput.ngSelect.clearModel();
  }
  clearCategories() {
    this.submissionCategoriesInput.ngSelect.clearModel();
  }
  clearSoftware() {
    this.softwareUsedInput.ngSelect.clearModel();
  }
  clearKeywords() {
    this.keywordsInput.ngSelect.clearModel();
  }
  clearSelectionTags() {
    this.selectionTagsInput.ngSelect.clearModel();
  }
}
