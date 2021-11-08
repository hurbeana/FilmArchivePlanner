import {Component, Input, OnInit} from '@angular/core';
import {Movie} from "../../models/movie";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {createMovie} from "../../state/movies.actions";
import {ActivatedRoute} from "@angular/router";
import {selectMovieCollection} from "../../services/movies.selectors";

@Component({
  selector: 'movies-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less']
})
export class DetailsViewComponent implements OnInit {

  @Input() movie: Movie | null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
    ) {}


  ngOnInit(): void {
    /*this.route.params.subscribe(params => {
      const id:number = +params['id'];
      if(id){ //TODO: 0???
        this.store.select(selectMovieCollection).subscribe(movies => {
          this.movie = movies.find(m=>m.id === id);
        })
      }
    });*/
  }

  /*createMovie(){
    if(!this.movie){
      //TODO: error message can not add empty!
    }else{
      let { id,created_at,last_updated, ...createdmovie } = this.movie; //TODO: use createDTO as @input, also never use items directly from store as input, as they are immutable
      this.store.dispatch(createMovie({movie: createdmovie})); // create movie
    }
  }*/
}
