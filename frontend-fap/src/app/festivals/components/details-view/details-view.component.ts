import { Component, OnInit } from '@angular/core';
import { Festival } from '../../models/festival';
import * as FestivalSelectors from '../../state/festivals.selectors';
import { Store } from '@ngrx/store';
import { FestivalsState } from '../../../app.state';

@Component({
  selector: 'festivals-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  festival: Festival | null | undefined;

  constructor(private store: Store<FestivalsState>) {}

  ngOnInit(): void {
    this.store
      .select(FestivalSelectors.selectSelectedFestival)
      .subscribe((selectedFestival) => (this.festival = selectedFestival));
  }
}
