import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { ActivatedRoute } from '@angular/router';
import * as TagSelector from '../../state/tags.selectors';

@Component({
  selector: 'tags-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  tag: Tag | null | undefined;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(TagSelector.selectSelectedTag).subscribe((tag) => {
      this.tag = tag;
    });
  }
}
