import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../../models/contact';
import { Tag } from '../../../tags/models/tag';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-contact-modal',
  templateUrl: './create-contact-modal.component.html',
})
export class CreateContactModalComponent {
  constructor(public modal: NgbActiveModal) {}
  contact: Contact;
  usableTags: Tag[];
  visible = true;
  emailInvalid = false;
  enterSubmit = false;

  modalTitle = 'Create Contact';
  modalSubmitText = 'Create';

  onCancelContactModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }

  onSubmitContactModal() {
    if (Array.isArray(this.contact.type)) {
      this.contact.type = this.contact.type[0];
    }
    console.log('- SUBMIT -');
    console.log(`Contact type: ${this.contact.type?.toString()}`);
    if (this.emailInvalid) {
      return;
    }
    this.contact.type = {
      id: this.contact.type.id,
      value: this.contact.type.value,
      type: this.contact.type.type,
      user: this.contact.type.user,
      public: this.contact.type.public,
      created_at: this.contact.type.created_at,
    };
    console.log(this.contact);
    this.modal.close(this.contact);
  }

  onEmailChange() {
    const re = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    this.emailInvalid = !re.test(this.contact.email?.toString() || '');
  }

  handleKeyDown(e: any, contactForm: NgForm) {
    // only gets called once per form ??
    // validation is not displayed at 'Enter' input
    if (e.keyCode === 13) {
      e.preventDefault();
      this.enterSubmit = true;
      contactForm.ngSubmit.emit();
    }
  }
}
