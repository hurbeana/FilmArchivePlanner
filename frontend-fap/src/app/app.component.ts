import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'Film Archiver & Planner';

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.title); // set page title
  }
}
