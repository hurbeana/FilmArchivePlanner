import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-yes-no-label',
  templateUrl: './yes-no-label.component.html',
  styleUrls: ['./yes-no-label.component.less'],
})
export class YesNoLabelComponent implements OnInit {
  @Input() value: boolean;

  constructor() {}

  ngOnInit(): void {}
}
