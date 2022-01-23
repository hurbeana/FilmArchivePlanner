import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { TagService } from '../../../tags/services/tag.service';
import { Tag } from '../../../tags/models/tag';
import { CreateUpdateTagDto } from '../../../tags/models/create.tag';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'shared-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.less'],
  //viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class TagInputComponent {
  @Input()
  form: NgForm;
  @Input()
  model: Tag[] | Tag | null | undefined; // depending on multiple
  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();
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
  @Input()
  enterSubmit = false;

  @ViewChild('tagInput') ngSelect: NgSelectComponent;

  items: Tag[];
  @HostBinding('className')
  className: string;
  isRequired: boolean;
  addTagText: string;
  loading = false;
  invalid = true;

  //private control: NgForm
  constructor(private tagService: TagService) {}

  async addTag(tag: Tag, model: Tag[] | Tag | null | undefined) {
    /* Add a tag to the list of tags (Multiple Select) */
    this.loading = true;
    if (!tag.type) {
      console.log('creating new tag');
      /* Tag is new and must be created first */
      const newTag: CreateUpdateTagDto = {
        type: this.tagType,
        value: tag.value,
        user: 'User',
        public: true,
      };

      const result = await this.tagService.createTag(newTag).toPromise();
      this.items = [...this.items, result];

      if (Array.isArray(this.model)) {
        this.model = this.model.filter((item) => {
          return item.value !== tag.value;
        });
        this.model.push(result);
      }
      //this.modelChange.emit(this.model);

      this.loading = false;
    } else {
      console.log('add-existed');
      /* Tag already existed in list --> Nothing to do here */
      this.loading = false;
    }
    this.modelChange.emit(this.getTagsAsReference(this.model));
    this.checkIsValid();
  }

  async setTag(tag: Tag, model: Tag[] | Tag | null | undefined) {
    /* Set tag as selected (Single Select) */
    this.loading = true;
    const newTag: CreateUpdateTagDto = {
      type: this.tagType,
      value: tag.value,
      user: 'User',
      public: true,
    };

    console.log('Creating new tag');
    const result = await this.tagService.createTag(newTag).toPromise();
    this.items = [...this.items, result];
    this.model = result;
    this.loading = false;
    this.modelChange.emit(this.getTagsAsReference(this.model));
  }

  removeTag() {
    this.checkIsValid();
    this.modelChange.emit(this.getTagsAsReference(this.model));
  }

  getTagsAsReference(model: any) {
    if (Array.isArray(model)) {
      return model.map((tag) => ({
        id: tag.id,
        type: tag.type,
        value: tag.value,
      }));
    } else if (model.id && model.type && model.value) {
      return {
        id: model.id,
        type: model.type,
        value: model.value,
      };
    } else {
      return null;
    }
  }

  async onChange(tag: Tag) {
    if (this.multiple) {
      /* if Multi-Select let the change Event be handled by addTagToItemsMultiple */
      return;
    }
    if (tag === undefined || tag === null) {
      console.log('change-remove');
    } else {
      console.log('change-addnewtag');
      if (!tag.type) {
        /* Tag is new and must be created */
        /* TODO maybe add modal with confirmation? */
        /* Set tag as selected (Single Select) */
        await this.setTag(tag, this.model);
      }
    }
    this.modelChange.emit(this.getTagsAsReference(this.model));
    this.checkIsValid();
  }

  ngOnInit() {
    if (!this.items) {
      this.tagService.getTagsByType(this.tagType).subscribe((tags) => {
        this.items = tags;
      });
    }
  }

  ngAfterContentInit() {
    this.className =
      'custom-tag-select ' + 'tag-' + this.tagType.toLowerCase() + '-input';
    this.addTagText = 'Add ' + this.tagType;
  }

  checkIsValid() {
    if (!this.required) {
      this.invalid = false;
      return;
    }
    this.invalid =
      !this.model || this.model === null || this.model === undefined;
    if (Array.isArray(this.model)) {
      this.invalid = this.invalid || this.model.length === 0;
    }
  }
}
