import { Component, OnInit } from '@angular/core';
import { Director } from '../../models/director';

@Component({
  selector: 'core-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
})
export class ContentComponent implements OnInit {
  constructor() {}

  selectedDirector: Director | null = null;

  changeDetails(row: Director) {
    this.selectedDirector = row;
  }

  ngOnInit(): void {}
}
