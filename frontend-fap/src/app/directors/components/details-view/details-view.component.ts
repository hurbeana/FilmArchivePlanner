import {Component, Input, OnInit} from '@angular/core';
import {Director} from "../../models/director";
import {Store} from "@ngrx/store";
import {AppState} from "../../../app.state";
import {ActivatedRoute} from "@angular/router";
import { FileDto } from "../../../shared/models/file";
import { DirectorService } from "../../services/director.service";

@Component({
  selector: 'directors-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less']
})
export class DetailsViewComponent implements OnInit {

  @Input() director: Director | null;

  constructor(private directorService: DirectorService) {}


  ngOnInit(): void {

  }

  getDownloadLink(filetyp: string,file?: FileDto){
    return this.directorService.getDownloadLink(filetyp,file);
  }

  printFile(file?: FileDto){
    if(!file){
      return "empty";
    }
    return [file.filename].join("/");
  }

}
