import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tags-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  @Input() tag: Tag | null;

  constructor() //private route: ActivatedRoute //private store: Store<AppState>,
  {}

  ngOnInit(): void {
    /*this.route.params.subscribe(params => {
      const id:number = +params['id'];
      if(id){ //TODO: 0???
        this.store.select(selectTagCollection).subscribe(tags => {
          this.tag = tags.find(m=>m.id === id);
        })
      }
    });*/
  }

  /*createTag(){
    if(!this.tag){
      //TODO: error message can not add empty!
    }else{
      let { id,created_at,last_updated, ...createdtag } = this.tag; //TODO: use createDTO as @input, also never use items directly from store as input, as they are immutable
      this.store.dispatch(createTag({tag: createdtag})); // create tag
    }
  }*/
}
