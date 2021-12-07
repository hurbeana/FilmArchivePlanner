import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'core-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
})
export class ContentComponent implements OnInit {
  constructor() {}

  selectedContact: Contact | null = null;

  changeDetails(row: Contact) {
    this.selectedContact = row;
  }

  ngOnInit(): void {}
}
