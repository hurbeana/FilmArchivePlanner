import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadingItem } from '../../models/loading-item';
import { Director } from '../../../directors/models/director';
import { Movie } from '../../../movies/models/movie';
import { Store } from '@ngrx/store';
import * as LoadingItemsSelector from '../../loading-item-state/loading.items.selectors';
import { createLoadingItem } from '../../loading-item-state/loading.items.actions';

@Component({
  selector: 'core-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  constructor(private store: Store) {}

  laodingItems: Observable<LoadingItem[]>;

  ngOnInit(): void {
    this.laodingItems = this.store.select(LoadingItemsSelector.selectitemState);
  }

  add() {
    this.store.dispatch(
      createLoadingItem({ loadingItem: { title: 'Bernhard' } }),
    );
  }
}
