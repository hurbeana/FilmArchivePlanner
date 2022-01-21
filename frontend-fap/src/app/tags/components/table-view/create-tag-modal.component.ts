import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../../models/tag';
import { tagTypes } from '../../models/tagtypes';

@Component({
  selector: 'create-tag-modal',
  templateUrl: './create-tag-modal.component.html',
})
export class CreateTagModalComponent {
  constructor(public modal: NgbActiveModal) {}
  tagToCreateEdit: Tag;
  visible = true;
  tagTypes = tagTypes;
  enterSubmit = false;

  modalTitle = 'Create Tag';
  modalSubmitText = 'Create';
  isEditModal = false;

  onSubmitTagModal() {
    this.modal.close(this.tagToCreateEdit);
  }

  onCancelModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
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
