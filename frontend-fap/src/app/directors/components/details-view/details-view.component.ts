import {Component, Input, OnInit} from '@angular/core';
import {Director} from "../../models/director";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'directors-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less']
})
export class DetailsViewComponent implements OnInit {

  @Input() director: Director | null;

  constructor(
    //private store: Store<AppState>,
    //private route: ActivatedRoute
    ) {}


  ngOnInit(): void {
    /*this.route.params.subscribe(params => {
      const id:number = +params['id'];
      if(id){ //TODO: 0???
        this.store.select(selectDirectorCollection).subscribe(directors => {
          this.director = directors.find(m=>m.id === id);
        })
      }
    });*/
  }

  /*createDirector(){
    if(!this.director){
      //TODO: error message can not add empty!
    }else{
      let { id,created_at,last_updated, ...createddirector } = this.director; //TODO: use createDTO as @input, also never use items directly from store as input, as they are immutable
      this.store.dispatch(createDirector({director: createddirector})); // create director
    }
  }*/
}
