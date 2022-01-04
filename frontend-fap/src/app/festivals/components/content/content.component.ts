import { Component, OnInit } from '@angular/core';
import { Festival } from '../../models/festival';

@Component({
  selector: 'core-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
})
export class ContentComponent implements OnInit {
  constructor() {}

  selectedFestival: Festival | null = null;

  changeDetails(row: Festival) {
    this.selectedFestival = row;
  }

  ngOnInit(): void {}
}
