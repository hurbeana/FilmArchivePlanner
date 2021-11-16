import {Component, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";


@Component({
  selector: 'core-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit {

  constructor() { }

  selectedMovie:Movie|null = null;

  changeDetails(row: Movie) {
    this.selectedMovie = row;
  }

  ngOnInit(): void {
  }

}
