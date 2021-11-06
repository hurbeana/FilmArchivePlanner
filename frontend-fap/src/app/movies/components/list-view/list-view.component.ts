import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Movie} from "../../models/movie";
import {Observable} from "rxjs";
import {AppState} from "../../../app.state";
import {Store} from "@ngrx/store";


@Component({
  selector: 'movies-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less']
})
export class ListViewComponent implements OnInit {

  displayedColumns: string[] = ['id', 'originalTitle', 'movieFile', 'previewFile'];
  clickedRows : Movie[] = [];

  @Output() rowChangeEvent: EventEmitter<Movie> = new EventEmitter();

  changeRow(row:Movie){
    this.clickedRows.splice(0);
    this.clickedRows.push(row);
    this.rowChangeEvent.emit(this.clickedRows[0]);
    console.log("CHANGE");
  }

  movies: Observable<readonly Movie[]>

  constructor(private store: Store<AppState>) {
    this.movies = store.select('movies')
  }

  ngOnInit(): void {
  }

}
