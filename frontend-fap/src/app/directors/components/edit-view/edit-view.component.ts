import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DirectorsState } from '../../../app.state';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { selectDetailsDirector } from '../../state/directors.selectors';
import { Director } from 'src/app/directors/models/director';
import * as DirectorActions from '../../../directors/state/directors.actions';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.less'],
})
export class EditViewComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  directorsForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl(),
    lastName: new FormControl('', [Validators.required]),
    biographyEnglish: new FormGroup({}, [Validators.required]),
    biographyGerman: new FormGroup({}),
    filmography: new FormGroup({}),
  });
  directors: Observable<Director[]>;
  id: number;
  // All Validation messages
  validation_messages = {
    firstName: [{ type: 'required', message: 'Original Title is required' }],
    middleName: undefined,
    lastName: [{ type: 'required', message: 'Original Title is required' }],
    biographyEnglish: [
      { type: 'required', message: 'Original Title is required' },
    ],
    biographyGerman: undefined,
    filmography: [{ type: 'required', message: 'Original Title is required' }],
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<DirectorsState>,
    private actions$: Actions,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.store.dispatch(DirectorActions.getDirectors({ page: 1, limit: 10 }));
    this.actions$
      .pipe(
        ofType(DirectorActions.createDirectorSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Director created successfully',
            'OK',
            'success-snackbar',
          );
          this.directorsForm.reset();
          this.router.navigate(['/directors']);
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(DirectorActions.createDirectorFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(DirectorActions.updateDirectorFailed),
        map(({ errormessage }) => {
          this.openSnackBar(errormessage, 'OK', 'error-snackbar');
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(DirectorActions.getDirectorFailed),
        map(({ errormessage }) => {
          this.router.navigate(['/notfound']);
        }),
      )
      .subscribe();

    this.actions$
      .pipe(
        ofType(DirectorActions.updateDirectorSuccess),
        takeUntil(this.destroy$),
        tap(() => {
          this.openSnackBar(
            'Director was updated successfully',
            'OK',
            'success-snackbar',
          );
          this.router.navigate(['/directors']);
        }),
      )
      .subscribe();
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: [panelClass],
    });
  }

  getSubmissionTagsFormGroup() {
    return (this.directorsForm.controls['submissionCategories'] as FormArray)
      .controls[0] as FormGroup;
  }

  getContactForm() {
    return this.directorsForm.controls['contact'] as FormGroup;
  }

  ngOnInit(): void {
    this.store.select(selectDetailsDirector).subscribe((director) => {
      if (director && this.id) {
        console.log(director);
        if (director.biographyEnglish) {
          (
            this.directorsForm.controls['biographyEnglish'] as FormGroup
          ).addControl('id', new FormControl(''));
          (
            this.directorsForm.controls['biographyEnglish'] as FormGroup
          ).addControl('path', new FormControl(''));
          (
            this.directorsForm.controls['biographyEnglish'] as FormGroup
          ).addControl('mimetype', new FormControl(''));
          (
            this.directorsForm.controls['biographyEnglish'] as FormGroup
          ).addControl('filename', new FormControl(''));
        }
        if (director.biographyGerman) {
          (
            this.directorsForm.controls['biographyGerman'] as FormGroup
          ).addControl('id', new FormControl(''));
          (
            this.directorsForm.controls['biographyGerman'] as FormGroup
          ).addControl('path', new FormControl(''));
          (
            this.directorsForm.controls['biographyGerman'] as FormGroup
          ).addControl('mimetype', new FormControl(''));
          (
            this.directorsForm.controls['biographyGerman'] as FormGroup
          ).addControl('filename', new FormControl(''));
        }
        if (director.filmography) {
          (this.directorsForm.controls['filmography'] as FormGroup).addControl(
            'id',
            new FormControl(''),
          );
          (this.directorsForm.controls['filmography'] as FormGroup).addControl(
            'path',
            new FormControl(''),
          );
          (this.directorsForm.controls['filmography'] as FormGroup).addControl(
            'mimetype',
            new FormControl(''),
          );
          (this.directorsForm.controls['filmography'] as FormGroup).addControl(
            'filename',
            new FormControl(''),
          );
        }
        this.directorsForm.patchValue(director);
      }
    });

    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      console.log(this.id);
      if (this.id) {
        this.store.dispatch(DirectorActions.getDirector({ id: this.id })); // load director by id
      }
    });
  }

  onSubmit() {
    console.log('formvalue: ', this.directorsForm.value);
    if (this.directorsForm.valid) {
      if (this.id) {
        // update
        this.store.dispatch(
          DirectorActions.updateDirector({
            id: this.id,
            director: this.directorsForm.value,
          }),
        );
      } else {
        // create
        this.store.dispatch(
          DirectorActions.createDirector({
            director: this.directorsForm.value,
          }),
        );
      }
    } else {
      this.openSnackBar('Validation Error!', 'OK', 'error-snackbar');
      this.getFormValidationErrors();
    }
  }

  compareSelectObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  getFormValidationErrors() {
    if (this.directorsForm) {
      Object.keys(this.directorsForm.controls).forEach((key) => {
        const controlErrors = this.directorsForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            console.log(
              'Key control: ' +
                key +
                ', keyError: ' +
                keyError +
                ', err value: ',
              controlErrors[keyError],
            );
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
