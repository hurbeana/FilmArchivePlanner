import { Component, Injectable, Input, OnInit } from '@angular/core';
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbTimeAdapter,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import {
  addHours,
  addMinutes,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear,
} from 'date-fns';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Movie } from '../../../movies/models/movie';
import { EventService } from '../../services/event.service';

//TODO: move adapters to global

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<Date> {
  readonly DELIMITER = '.';

  fromModel(value: any | null): NgbDateStruct | null {
    if (value && value instanceof Date) {
      const obj = {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      };
      return obj;
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): Date | null {
    if (date) {
      return setYear(
        setMonth(setDate(new Date(), date.day), date.month - 1),
        date.year,
      );
    }
    return null;
  }
}

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeDateAdapter extends NgbTimeAdapter<Date> {
  fromModel(value: Date | null): NgbTimeStruct | null {
    if (value) {
      return {
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
      };
    }
    return null;
  }

  toModel(time: NgbTimeStruct | null): Date | null {
    if (time) {
      return setSeconds(
        setMinutes(setHours(new Date(), time.hour), time.minute),
        time.second,
      );
    }
    return null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '.';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.less'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbTimeAdapter, useClass: NgbTimeDateAdapter },
  ],
})
export class EditEventModalComponent implements OnInit {
  constructor(
    public modal: NgbActiveModal,
    private eventService: EventService,
  ) {}

  eventForm: FormGroup;
  @Input() movies: Observable<Movie[]>;

  @Input() event: CalendarEvent;
  selectedMovieId = -1;

  eventTypes: string[];

  ngOnInit(): void {
    this.eventService
      .getEventTypes()
      .subscribe((evs) => (this.eventTypes = evs));
    this.eventForm = new FormGroup({
      title: new FormControl(this.event.title, [Validators.required]),
      startDate: new FormControl(this.event.start, [Validators.required]),
      startTime: new FormControl(this.event.start, [Validators.required]),
      endDate: new FormControl(
        this.event.end ?? addMinutes(this.event.start, 30),
        [Validators.required],
      ),
      endTime: new FormControl(
        this.event.end ?? addMinutes(this.event.start, 30),
        [Validators.required],
      ),
      type: new FormControl(this.event.meta?.type, [Validators.required]),
      description: new FormControl(this.event.meta?.description),
      eventLocation: new FormControl(this.event.meta?.eventLocation),
      movie: new FormControl(this.event.meta?.movie?.id), //TODO: movie is no selectd
    });
    this.eventForm.addValidators([this.StartBeforeEndValidator]);
  }
  mergeDateTime(date: Date, time: Date): Date {
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    return date;
  }

  saveModal() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      this.event.title = this.eventForm.get('title')?.value;
      const startDate: Date = this.eventForm.get('startDate')?.value;
      const startTime: Date = this.eventForm.get('startTime')?.value;
      const endDate: Date = this.eventForm.get('endDate')?.value;
      const endTime: Date = this.eventForm.get('endTime')?.value;
      this.event.start = this.mergeDateTime(startDate, startTime);
      this.event.end = this.mergeDateTime(endDate, endTime);
      this.event.meta.description = this.eventForm.get('description')?.value;
      this.event.meta.eventLocation =
        this.eventForm.get('eventLocation')?.value;
      this.event.meta.movie = { id: this.eventForm.get('movie')?.value };
      this.event.meta.type = this.eventForm.get('type')?.value;
      this.modal.close(this.event);
    }
  }

  onCancelModal() {
    this.modal.dismiss('cancel click');
  }

  /** Start Date has to be before end date */
  StartBeforeEndValidator(control: AbstractControl) {
    if (!control) {
      return null;
    }
    const startDate: Date = control?.get('startDate')?.value;
    const startTime: Date = control?.get('startTime')?.value;
    const endDate: Date = control?.get('endDate')?.value;
    const endTime: Date = control?.get('endTime')?.value;
    if (!startDate || !startTime || !endTime || !endDate) {
      return null;
    }
    startDate.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds(),
    );
    endDate.setHours(
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds(),
    );
    return startDate > endDate ? { startBeforeEnd: true } : null;
  }

  fieldInvalid(field: string) {
    return (
      this.eventForm.get(field)?.invalid &&
      (this.eventForm.get(field)?.dirty || this.eventForm.get(field)?.touched)
    );
  }

  trackMovie(index: number, item: Movie) {
    return item.id;
  }
}
