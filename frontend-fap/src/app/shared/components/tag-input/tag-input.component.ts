import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { TagService } from '../../../tags/services/tag.service';
import { Tag } from '../../../tags/models/tag';
import { CreateUpdateTagDto } from '../../../tags/models/create.tag';

@Component({
  selector: 'shared-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.less'],
})
export class TagInputComponent {
  @Input()
  form: NgForm;
  @Input()
  model: Tag[] | Tag | null; // depending on multiple
  @Output()
  modelChange = new EventEmitter<Tag[] | Tag | null>();
  @Input()
  tagType: string;
  @Input()
  formCtrlName: string;
  @Input()
  readonly = false;
  @Input()
  multiple = true;
  @Input()
  required = false;

  items: Tag[];
  className: string;
  addTagText: string;
  loading = false;

  constructor(private tagService: TagService) {}

  addTag(tag: Tag, model: Tag[] | Tag | null) {
    /* Add a tag to the list of tags (Multiple Select) */
    this.loading = true;
    if (!tag.type) {
      /* Tag is new and must be created first */
      const newTag: CreateUpdateTagDto = {
        type: this.tagType,
        value: tag.value,
        user: 'User',
        public: true,
      };

      this.tagService
        .createTag(newTag)
        .toPromise()
        .then((result) => {
          this.items = [...this.items, result];
          this.loading = false;
        });
    } else {
      /* Tag already existed in list --> Nothing to do here */
      this.loading = false;
    }
    this.resetFormControl();
  }

  setTag(tag: Tag, model: Tag[] | Tag | null) {
    /* Set tag as selected (Single Select) */
    this.loading = true;
    const newTag: CreateUpdateTagDto = {
      type: this.tagType,
      value: tag.value,
      user: 'User',
      public: true,
    };

    this.tagService
      .createTag(newTag)
      .toPromise()
      .then((result) => {
        this.items = [...this.items, result];
        this.loading = false;
      });
  }

  removeTag(event: Event, model: Tag[] | Tag | null) {
    console.log('removeTag', event, model);
    if (model === null || (Array.isArray(model) && model.length === 0)) {
      this.form.form.controls[this.formCtrlName].setErrors({
        invalid: true,
      });
    }
    this.form.form.updateValueAndValidity();
  }

  onChange(tag: Tag) {
    if (this.multiple) {
      /* if Multi-Select let the change Event be handled by addTagToItemsMultiple */
      return;
    }
    if (tag === undefined || tag === null) {
      this.form.form.controls[this.formCtrlName].setErrors({
        invalid: true,
      });
    } else {
      if (!tag.type) {
        /* Tag is new and must be created */
        /* TODO maybe add modal with confirmation? */

        /* Set tag as selected (Single Select) */
        this.setTag(tag, this.model);
      }
      this.resetFormControl();
    }
    this.form.form.updateValueAndValidity();
    this.modelChange.emit(this.model);
  }

  resetFormControl() {
    this.form.control.removeControl(this.formCtrlName);
    this.form.control.addControl(
      this.formCtrlName,
      new FormControl('valid', Validators.required),
    );
  }

  ngOnInit() {
    if (!this.items) {
      this.tagService.getTagsByType(this.tagType).subscribe((tags) => {
        this.items = tags;
      });
    }

    this.form.control.addControl(
      this.formCtrlName,
      new FormControl('valid', Validators.required),
    );
    this.form.form.updateValueAndValidity();

    /* setting className to show proper tag colors */
    this.className =
      'custom-tag-select ' + 'tag-' + this.tagType.toLowerCase() + '-input';

    /* setting responsible classes for validation */
    this.form.ngSubmit.subscribe(() => {
      if (this.form.submitted) {
        this.className += ' required is-invalid';
      }
      if (this.required) {
        this.className += ' required';
      }
    });

    this.addTagText = 'Add ' + this.tagType;
  }
}
