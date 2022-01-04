import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Festival } from '../../models/festival';
import { Tag } from '../../../tags/models/tag';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'create-festival-modal',
  templateUrl: './create-festival-modal.component.html',
})
export class CreateFestivalModalComponent {
  constructor(public modal: NgbActiveModal) {}
  festivalToCreate: Festival;
  usableTags: Tag[];
  visible = true;

  createFestival() {}

  onCancelFestivalModal() {
    this.visible = false;
    this.modal.dismiss('cancel click');
  }

  onSubmitFestivalModal() {
    this.modal.close(this.festivalToCreate);
  }

  handleKeyUp(e: any, festivalForm: NgForm) {
    // only gets called once per form ??
    // validation is not displayed at 'Enter' input
    if (e.keyCode === 13) {
      console.log(e.keyCode);
      e.preventDefault();
      festivalForm.ngSubmit.emit();
    }
  }
}
