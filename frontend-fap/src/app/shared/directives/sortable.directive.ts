import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Tag } from '../../tags/models/tag';
import { Movie } from '../../movies/models/movie';
import { Contact } from '../../contacts/models/contact';
import { Director } from '../../directors/models/director';

export type SortColumn = string;
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
})
export class NgbdSortableHeaderDirective {
  @Input() sortable: SortColumn = 'created_at';
  @HostBinding('class')
  @Input()
  direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostListener('click')
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
