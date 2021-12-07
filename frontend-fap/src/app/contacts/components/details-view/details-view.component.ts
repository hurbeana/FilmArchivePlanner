import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'contacts-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.less'],
})
export class DetailsViewComponent implements OnInit {
  @Input() contact: Contact | null;
  itemsToChooseFrom: Object[] = [ //TODO: Replace with call to getTagsByType()
    {
      type: 'Contact',
      value: 'Business',
      user: 'Sebi',
      public: true,
    },
    {
      type: 'Contact',
      value: 'Friend',
      user: 'Carl',
      public: true,
    },
    {
      type: 'Contact',
      value: 'Unknown',
      user: 'Frank',
      public: true,
    },
  ];

  constructor() { }

  ngOnInit(): void { }

  addTag(event: Event) {
    console.log('addTag', event, this.contact?.id, this.contact?.type);
    //this.selectValues.push(val);
  }
  removeTag(event: Event) {
    console.log('removeTag', event, this.contact?.id);
    //this.selectValues.push(val);
  }
}
