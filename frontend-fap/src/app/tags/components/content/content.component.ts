import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';

@Component({
  selector: 'core-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
})
export class ContentComponent implements OnInit {
  constructor() {}

  selectedTag: Tag | null = null;

  changeDetails(row: Tag) {
    this.selectedTag = row;
  }

  ngOnInit(): void {}
}
