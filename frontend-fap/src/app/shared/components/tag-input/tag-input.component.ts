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
  model: Tag[] | Tag | null | undefined; // depending on multiple
  @Output()
  modelChange = new EventEmitter<any>();
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
  @Input()
  bindLabel = 'value';

  items: Tag[];
  className: string;
  addTagText: string;
  loading = false;
  invalid = false;

  constructor(private tagService: TagService) {}

  addTag(tag: Tag, model: Tag[] | Tag | null | undefined) {
    /* Add a tag to the list of tags (Multiple Select) */
    this.loading = true;
    if (!tag.type) {
      console.log('add');
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
      console.log('add-existed');
      /* Tag already existed in list --> Nothing to do here */
      this.loading = false;
    }
  }

  setTag(tag: Tag, model: Tag[] | Tag | null | undefined) {
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

  removeTag(event: Event, model: Tag[] | Tag | null | undefined) {
    if (model === null || (Array.isArray(model) && model.length === 0)) {
      console.log('remove', model);
      this.setInvalid(true);
    }
  }

  onChange(tag: Tag) {
    if (this.multiple) {
      /* if Multi-Select let the change Event be handled by addTagToItemsMultiple */
      return;
    }
    if (tag === undefined || tag === null) {
      console.log('change-remove');
      //this.setInvalid(true);
    } else {
      console.log('change-addnewtag');
      if (!tag.type) {
        /* Tag is new and must be created */
        /* TODO maybe add modal with confirmation? */
        /* Set tag as selected (Single Select) */
        this.setTag(tag, this.model);
      }
      this.setInvalid(false);
    }
    if (this.form.submitted && this.invalid) {
      this.setInvalid(true);
    } else {
      this.setInvalid(false);
    }
    this.modelChange.emit(this.model);
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

    /* setting className to show proper tag colors */

    this.className =
      'custom-tag-select ' + 'tag-' + this.tagType.toLowerCase() + '-input';

    /* setting responsible classes for validation */
    this.form.ngSubmit.subscribe(() => {
      console.log('subsc', this.invalid);
      if (this.form.submitted && this.invalid) {
        this.setInvalid(true);
      } else {
        this.setInvalid(false);
      }
    });

    this.addTagText = 'Add ' + this.tagType;
  }

  setInvalid(value: boolean) {
    console.log('setInvalid', value);
    this.invalid = value;
    this.form.form.controls[this.formCtrlName].setErrors({
      invalid: value,
    });
    if (value) {
      console.log('setClass');
      this.className += ' required is-invalid';
    } else {
      console.log('removeClass');
      this.className.replace(/required/g, '');
      this.className.replace(/is-invalid/g, '');
    }
    this.form.form.updateValueAndValidity();
  }
}
