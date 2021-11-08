import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Festivator';


  constructor(
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title); // set webpage title
  }
}
