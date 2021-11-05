import {Component, Input, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";
import {Store} from "@ngrx/store";
import {AppState} from "../../state/app.state";
import {createMovie} from "../../state/movies/movies.actions";

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less']
})
export class DetailsViewComponent implements OnInit {
  @Input() movie!: Movie|null;

  constructor(private store: Store<AppState>) {
  }

  objectKeys(obj:any) {
    return Object.keys(obj);
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }

  noSort(): any{

  }


  ngOnInit(): void {
  }

  createMovie(){
    if(!this.movie){
      //TODO: error message can not add empty!
    }else{
      let { id,created_at,last_updated, ...createdmovie } = this.movie;
      this.store.dispatch(createMovie({movie: createdmovie})); // create movie
    }
  }
}
