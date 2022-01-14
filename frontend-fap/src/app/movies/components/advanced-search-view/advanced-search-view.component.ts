import { Component, Input, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Contact } from 'src/app/contacts/models/contact';
import { ContactService } from 'src/app/contacts/services/contact.service';
import { Director } from 'src/app/directors/models/director';
import { DirectorService } from 'src/app/directors/services/director.service';
import { Tag } from 'src/app/tags/models/tag';
import { TagService } from 'src/app/tags/services/tag.service';
import * as MovieActions from '../../state/movies.actions';
import * as MovieSelectors from '../../state/movies.selectors';
import { MoviesState } from '../../../app.state';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-advanced-search-view',
  templateUrl: './advanced-search-view.component.html',
  styleUrls: ['./advanced-search-view.component.less'],
})
export class AdvancedSearchViewComponent implements OnInit {
  tags$ = new Observable<Tag[]>();
  directors$ = new Observable<Director[]>();
  contacts$ = new Observable<Contact[]>();

  selectedTags: Tag[] = [];
  negativeTags: Tag[] = [];
  exactYear: string;
  fromYear: string;
  toYear: string;
  exactLength: string;
  fromLength: string;
  toLength: string;
  hasDialogue = 0; //0 = any, 1 = yes, 2 = no
  hasSubtitles = 0;
  isStudentFilm = 0;
  hasDCP = 0;
  selectedDirectors: Director[] = [];
  selectedContacts: Contact[] = [];

  movieCount: number;

  @Input()
  page: number;
  @Input()
  limit: number;
  @Input()
  orderBy: string;
  @Input()
  sortOrder: string;
  @Input()
  searchString: string;

  loadingSubscription = new Subscription();
  loading: boolean | undefined;

  constructor(
    private tagService: TagService,
    private directorsService: DirectorService,
    private contactService: ContactService,
    private store: Store<MoviesState>,
    private actionsSubject: ActionsSubject,
  ) {}

  ngOnInit(): void {
    this.tags$ = this.tagService.getAllTags(); //retrieve tags, contacts and directors from backend
    this.contacts$ = this.contactService.getAllContacts();
    this.directors$ = this.directorsService.getAllDirectors();
    this.store
      .select(MovieSelectors.selectTotalItems)
      .subscribe((itemCount) => {
        this.movieCount = itemCount;
        if (
          this.movieCount > 0 &&
          document.getElementsByClassName('movie-count').length > 0
        ) {
          document
            .getElementsByClassName('movie-count')[0]
            .setAttribute('style', 'color: #3d9e11; border: 1px solid #3d9e11');
        } else {
          document
            .getElementsByClassName('movie-count')[0]
            .setAttribute('style', 'color: #c94b1a; border: 1px solid #c94b1a');
        }
      });
    this.loadingSubscription = this.actionsSubject
      .pipe(ofType(MovieActions.getMoviesSuccess))
      .subscribe((movies) => {
        this.loading = false;
      });
  }

  ngOnDestory() {
    this.loadingSubscription.unsubscribe();
  }

  clearDirectors() {
    this.selectedDirectors = [];
  }
  clearContacts() {
    this.selectedContacts = [];
  }
  /*if Tag A was selected in pos search and then gets selected in neg search,
  it is removed from pos search automatically
  */
  removeContradictingTags(pos: boolean) {
    if (pos) {
      const ids: number[] = [];
      this.selectedTags.forEach((x) => ids.push(x.id));

      const nt: Tag[] = [];
      this.negativeTags.forEach((x) => {
        if (!ids.includes(x.id)) nt.push(x);
      });
      this.negativeTags = nt;
    } else {
      const ids: number[] = [];
      this.negativeTags.forEach((x) => ids.push(x.id));

      const st: Tag[] = [];
      this.selectedTags.forEach((x) => {
        if (!ids.includes(x.id)) st.push(x);
      });
      this.selectedTags = st;
    }
  }
  clearTags(pos: boolean) {
    if (pos) {
      this.selectedTags = [];
    } else {
      this.negativeTags = [];
    }
  }
  removeContradictingYears(exact: boolean) {
    if (exact) {
      this.fromYear = '';
      this.toYear = '';
    } else {
      this.exactYear = '';
    }
  }
  removeContradictingLengths(exact: boolean) {
    if (exact) {
      this.fromLength = '';
      this.toLength = '';
    } else {
      this.exactLength = '';
    }
  }
  setHasDialogue(val: number) {
    this.hasDialogue = val;
  }
  setHasSubtitles(val: number) {
    this.hasSubtitles = val;
  }
  setIsStudentFilm(val: number) {
    this.isStudentFilm = val;
  }
  sethasDCP(val: number) {
    this.hasDCP = val;
  }

  clearAll() {
    //reset all values
    this.clearTags(true);
    this.clearTags(false);
    this.exactYear = '';
    this.fromYear = '';
    this.toYear = '';
    this.exactLength = '';
    this.fromLength = '';
    this.toLength = '';
    this.setHasDialogue(0);
    this.setHasSubtitles(0);
    this.setIsStudentFilm(0);
    this.sethasDCP(0);
    //reset selected radio button
    const radioFields = document.getElementsByClassName('radio-field');
    for (let i = 0; i < radioFields.length; ++i) {
      const content = radioFields[i].innerHTML;
      radioFields[i].innerHTML = content;
    }

    this.clearDirectors();
    this.clearContacts();

    this.executeSearch();
  }

  executeSearch() {
    //convert elements to format needed for search
    const selectedTagIDs: number[] = [];
    this.selectedTags.forEach((x) => selectedTagIDs.push(x.id));
    const negativeTagIDs: number[] = [];
    this.negativeTags.forEach((x) => negativeTagIDs.push(x.id));

    let exactYearNum = Number(this.exactYear);
    let fromYearNum = Number(this.fromYear);
    let toYearNum = Number(this.toYear);
    if (!exactYearNum) exactYearNum = -1;
    if (!fromYearNum) fromYearNum = -1;
    if (!toYearNum) toYearNum = -1;

    let exactLengthNum = Number(this.exactLength);
    let fromLengthNum = Number(this.fromLength);
    let toLengthNum = Number(this.toLength);
    if (!exactLengthNum) exactLengthNum = -1;
    if (!fromLengthNum) fromLengthNum = -1;
    if (!toLengthNum) toLengthNum = -1;

    const selectedDirectorIDs: number[] = [];
    this.selectedDirectors.forEach((x) => selectedDirectorIDs.push(x.id));
    const selectedContactIDs: number[] = [];
    this.selectedContacts.forEach((x) => selectedContactIDs.push(x.id));

    //to be correctly transfered via url param, array must not have length 1
    if (selectedTagIDs.length == 1) selectedTagIDs.push(-1);
    if (negativeTagIDs.length == 1) negativeTagIDs.push(-1);
    if (selectedDirectorIDs.length == 1) selectedDirectorIDs.push(-1);
    if (selectedContactIDs.length == 1) selectedContactIDs.push(-1);

    this.store.dispatch(
      MovieActions.setAdvancedSearchState({
        advancedSearchState: {
          loading: true,
          selectedTagIDs: selectedTagIDs,
          negativeTagIDs: negativeTagIDs,
          exactYear: exactYearNum,
          fromYear: fromYearNum,
          toYear: toYearNum,
          exactLength: exactLengthNum,
          fromLength: fromLengthNum,
          toLength: toLengthNum,
          hasDialogue: this.hasDialogue,
          hasSubtitles: this.hasSubtitles,
          isStudentFilm: this.isStudentFilm,
          hasDCP: this.hasDCP,
          selectedDirectorIDs: selectedDirectorIDs,
          selectedContactIDs: selectedContactIDs,
        },
      }),
    );

    this.store.dispatch(
      MovieActions.getMoviesAdvanced({
        page: this.page,
        limit: this.limit,
        orderBy: this.orderBy,
        sortOrder: this.sortOrder,
        searchString: this.searchString ?? '',
        selectedTagIDs: selectedTagIDs,
        negativeTagIDs: negativeTagIDs,
        exactYear: exactYearNum,
        fromYear: fromYearNum,
        toYear: toYearNum,
        exactLength: exactLengthNum,
        fromLength: fromLengthNum,
        toLength: toLengthNum,
        hasDialogue: this.hasDialogue,
        hasSubtitles: this.hasSubtitles,
        isStudentFilm: this.isStudentFilm,
        hasDCP: this.hasDCP,
        selectedDirectorIDs: selectedDirectorIDs,
        selectedContactIDs: selectedContactIDs,
      }),
    );
    this.loading = true;
  }
}
