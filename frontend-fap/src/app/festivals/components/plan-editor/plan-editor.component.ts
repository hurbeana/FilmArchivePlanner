import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { fromEvent, Observable, Subject } from 'rxjs';
import { WeekViewHourSegment } from 'calendar-utils';
import { finalize, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditEventModalComponent } from '../edit-event-modal/edit-event-modal.component';
import { Movie } from '../../../movies/models/movie';
import { Store } from '@ngrx/store';
import * as MovieSelectors from '../../../movies/state/movies.selectors';
import { Festival } from '../../models/festival';
import { selectDetailsFestival } from '../../state/festivals.selectors';
import { ActivatedRoute } from '@angular/router';
import {
  createFestivalEvent,
  deleteFestivalEvent,
  getFestival,
  updateFestival,
  updateFestivalEvent,
} from '../../state/festivals.actions';
import { CreateFestivalModalComponent } from '../table-view/create-festival-modal.component';
import { FestivalEvent } from '../../models/event';
import { MoviesState } from '../../../app.state';

import { registerLocaleData } from '@angular/common';
// import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEn);

@Component({
  selector: 'app-plan-editor',
  templateUrl: './plan-editor.component.html',
  styleUrls: ['./plan-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEditorComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private store: Store<MoviesState>,
    private route: ActivatedRoute,
  ) {
    this.movies = this.store.select(MovieSelectors.selectMovies);
  }
  movies: Observable<Movie[]>;
  viewDate: Date; // initial empty = new Date();

  // locale = 'de-AT';
  locale = 'en-GB';

  readonly = false;
  colors = [
    {
      primary: '#eddf1d',
      secondary: '#fbf8cc',
    },
    {
      primary: '#eb6f0a',
      secondary: '#fde4cf',
    },
    {
      primary: '#E0000F',
      secondary: '#ffcfd2',
    },
    {
      primary: '#A7258F',
      secondary: '#f1c0e8',
    },
    {
      primary: '#5F28B8',
      secondary: '#cfbaf0',
    },
    {
      primary: '#1759B5',
      secondary: '#a3c4f3',
    },
    {
      primary: '#1290BA',
      secondary: '#90dbf4',
    },
    {
      primary: '#0F9CA9',
      secondary: '#8eecf5',
    },
    {
      primary: '#11A786',
      secondary: '#98f5e1',
    },
    {
      primary: '#0BC11D',
      secondary: '#b9fbc0',
    },
  ];

  eventActions = [
    {
      label: 'pencil',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openEditEventModal(event)
          .then((res) => {
            if (!this.readonly) {
              // giga secure
              this.store.dispatch(
                updateFestivalEvent({
                  festivalEvent: this.mapEventCalendarToFestival(res),
                }),
              );
            }
          })
          .catch((er) => {
            //delete recently created event
          });
      },
    },
    {
      label: 'trash',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        if (!this.readonly) {
          // giga secure
          this.store.dispatch(
            deleteFestivalEvent({
              festivalEventToDelete: this.mapEventCalendarToFestival(event),
            }),
          );
        }
      },
    },
  ];

  festivalID: number;
  festival: Festival;
  events: CalendarEvent[] = [];

  refresh = new Subject<void>();

  dragToCreateActive = false;
  weekStartsOn: 1 = 1;

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  setView(view: CalendarView) {
    this.view = view;
  }

  ngOnInit(): void {
    // set weekstart to monday
    moment.updateLocale(this.locale, {
      week: {
        dow: 1, // set start of week to monday instead
        doy: 0,
      },
    });
    this.store.select(selectDetailsFestival).subscribe((festival) => {
      if (festival && this.festivalID) {
        this.festival = festival;
        if (!this.viewDate) {
          // only if unset
          console.log(festival);
          this.viewDate = festival.firstDate ?? new Date();
        }

        this.events = festival.events.map((fe) =>
          this.mapEventFestivalToCalendar(fe),
        );
        this.refresh.next();
      }
    });
    this.route.data.subscribe((v) => {
      this.readonly = v.readonly;
    });
    this.route.params.subscribe((params) => {
      this.festivalID = +params['id'];
      if (this.festivalID) {
        this.store.dispatch(getFestival({ id: this.festivalID })); // load festival by id
      }
    });
  }

  viewDateChange() {
    this.refresh.next();
  }

  mapEventCalendarToFestival(ce: CalendarEvent): FestivalEvent {
    return {
      description: ce.meta.description,
      endDate: ce.end ?? ce.start,
      id: +(ce.id ?? -1),
      movie: ce.meta.movie,
      eventLocation: ce.meta.eventLocation,
      startDate: ce.start,
      title: ce.title,
      type: ce.meta.type,
      festival: this.festivalID,
    };
  }

  mapEventFestivalToCalendar(fe: FestivalEvent): CalendarEvent {
    return {
      id: fe.id,
      start: fe.startDate,
      end: fe.endDate,
      title: fe.title,
      meta: {
        eventLocation: fe.eventLocation,
        type: fe.type,
        movie: fe.movie,
        description: fe.description,
      },
      color: this.colors[this.getColorIndex(fe.eventLocation)],
      draggable: !this.readonly,
      resizable: {
        beforeStart: !this.readonly, // this allows you to configure the sides the event is resizable from
        afterEnd: !this.readonly,
      },
      ...(!this.readonly && { actions: this.eventActions }),
    };
  }

  openEditFestivalModal() {
    const modalRef = this.modalService.open(CreateFestivalModalComponent, {
      centered: true,
      keyboard: true,
    });

    const name = this.festival.name;
    const location = this.festival.location;
    const description = this.festival.description;

    modalRef.componentInstance.festivalToCreate = {
      name,
      location,
      description,
    };
    modalRef.componentInstance.modalTitle = 'Festival edit';
    modalRef.componentInstance.modalSubmitText = 'Save Festival';

    modalRef.result.then(
      (festival: Festival) => {
        if (
          (name !== festival.name ||
            location !== festival.location ||
            description !== festival.description) &&
          !this.readonly
        ) {
          this.store.dispatch(
            updateFestival({ festival: festival, id: this.festivalID }),
          );
        }
      },
      () => {
        //nothing
      },
    );
  }

  openEditEventModal(event: CalendarEvent): Promise<CalendarEvent> {
    const modalRef = this.modalService.open(EditEventModalComponent, {
      centered: true,
      keyboard: true,
    });
    modalRef.componentInstance.movies = this.movies;
    modalRef.componentInstance.event = event;
    return modalRef.result;
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement,
  ) {
    if (mouseDownEvent.button === 0) {
      const dragToSelectEvent: CalendarEvent = {
        id: 0, // has 0 id during drag process as it is not in db at this moment
        title: '',
        start: segment.date,
        draggable: !this.readonly,
        resizable: {
          beforeStart: !this.readonly,
          afterEnd: !this.readonly,
        },
        ...(!this.readonly && { actions: this.eventActions }),
        meta: {
          tmpEvent: true,
        },
      };
      this.events = [...this.events, dragToSelectEvent];
      const segmentPosition = segmentElement.getBoundingClientRect();
      this.dragToCreateActive = true;
      const endOfView = endOfWeek(this.viewDate, {
        weekStartsOn: this.weekStartsOn,
      });

      fromEvent(document, 'mousemove')
        .pipe(
          finalize(() => {
            //delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            //this.refresh.next();
            this.openEditEventModal(dragToSelectEvent)
              .then((res) => {
                if (!this.readonly) {
                  // giga secure
                  this.store.dispatch(
                    createFestivalEvent({
                      festivalEvent: this.mapEventCalendarToFestival(res),
                    }),
                  );
                }
              })
              .catch((er) => {})
              .finally(() => {
                //delete temp events
                this.events = this.events.filter((ev) => ev.id !== 0);
                this.refresh.next();
              });
          }),
          takeUntil(fromEvent(document, 'mouseup')),
        )
        .subscribe((mouseMoveEvent: Event) => {
          if (mouseMoveEvent instanceof MouseEvent) {
            const minutesDiff = this.ceilToNearest(
              mouseMoveEvent.clientY - segmentPosition.top,
              30,
            );
            const daysDiff =
              this.floorToNearest(
                mouseMoveEvent.clientX - segmentPosition.left,
                segmentPosition.width,
              ) / segmentPosition.width;

            const newEnd = addDays(
              addMinutes(segment.date, minutesDiff),
              daysDiff,
            );
            if (newEnd > segment.date && newEnd < endOfView) {
              dragToSelectEvent.end = newEnd;
            }
            this.refresh.next();
          }
        });
    }
  }

  floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    console.log(event);

    //TODO: überprüfen obs geht
    if (event.meta?.dropped) {
      //droppen
      event.start = newStart;
      event.end = addMinutes(newStart, event.meta.movie.duration);
      const createEvent: FestivalEvent = this.mapEventCalendarToFestival(event);
      if (!this.readonly) {
        // giga secure
        this.store.dispatch(
          createFestivalEvent({ festivalEvent: createEvent }),
        );
      }
    } else {
      event.start = newStart;
      event.end = newEnd;
      const updateEvent: FestivalEvent = this.mapEventCalendarToFestival(event);
      if (!this.readonly) {
        // giga secure
        this.store.dispatch(
          updateFestivalEvent({ festivalEvent: updateEvent }),
        );
      }
    }
    this.refresh.next();
  }

  parseDate(str: string) {
    return moment(str).toDate();
  }

  getColorIndex(s: string) {
    return this.hashCode(s) % Object.keys(this.colors).length;
  }

  hashCode(s: string) {
    return s.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
}
