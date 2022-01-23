import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { UploadFileResponseDto } from '../../models/upload.file.response';
import { fileTypes } from '../../models/file';

@Component({
  selector: 'shared-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
})
export class FileUploadComponent implements OnInit {
  @Input()
  requiredFileType: string;

  @Input() controlname: string;

  @Input() multiple: boolean;

  //multiple files
  formFileArray: FormArray;

  //single file
  fileGroup: FormGroup;

  //files: FileDto[] = [];

  uploadProgress: { [key: string]: number } = {};
  uploadSub?: Subscription;
  canceled = false;

  form: FormGroup;

  constructor(
    private http: HttpClient,
    private rootFormGroup: FormGroupDirective,
  ) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    if (this.multiple) {
      this.formFileArray = this.form.get(this.controlname) as FormArray; // has to be
    } else {
      this.fileGroup = this.form.get(this.controlname) as FormGroup;
      console.log(this.fileGroup);
      if (!this.fileGroup.contains('id')) {
        this.fileGroup.disable(); // disable -> no value
      }
    }
  }

  getFormGroup(a: AbstractControl): FormGroup {
    return a as FormGroup;
  }

  onFileSelected(event: Event) {
    this.canceled = false;
    const element = event.currentTarget as HTMLInputElement;
    if (!event || !element?.files) {
      return;
    }

    Array.from(element.files).forEach((file) => {
      if (file) {
        this.uploadProgress[file.name] = 0;
        const newfileGroup = new FormGroup({
          filename: new FormControl(file.name),
        });
        if (this.multiple) {
          this.formFileArray.push(newfileGroup);
        } else {
          if (this.fileGroup.contains('id')) {
            this.fileGroup.removeControl('id');
            this.fileGroup.removeControl('path');
            this.fileGroup.removeControl('mimetype');
            this.fileGroup.setControl('filename', new FormControl(file.name));
          } else {
            this.fileGroup.setControl('filename', new FormControl(file.name));
          }
          //this.fileGroup = new FormGroup({'filename': new FormControl(file.name)});
        }
        const formData = new FormData();
        formData.append('file', file);

        const upload$ = this.http
          .post<UploadFileResponseDto>(
            'http://localhost:3000/files/cache',
            formData,
            {
              reportProgress: true,
              observe: 'events',
            },
          )
          .pipe(finalize(() => this.finishedUpload(file.name)));

        this.uploadSub = upload$.subscribe((response) => {
          if (response?.type == HttpEventType.UploadProgress) {
            this.uploadProgress[file.name] = Math.round(
              100 * (response.loaded / (response.total ?? 0)),
            );
          } else if (
            response?.type == HttpEventType.Response &&
            response?.body?.id
          ) {
            console.log(response);
            console.log(response.body.id);

            if (this.multiple) {
              newfileGroup.addControl('id', new FormControl(response.body.id));
            } else {
              //remove file
              this.fileGroup.enable(); // enable -> value
              this.fileGroup.setControl(
                'id',
                new FormControl(response.body.id),
              );
            }
          }
        });
      }
    });
  }

  finishedUpload(filename: string) {
    this.reset(filename);
  }

  cancelUpload(filename: string) {
    this.canceled = true;
    this.uploadSub?.unsubscribe();
    //this.files = []; //TODO
    this.reset(filename);

    if (this.multiple) {
      //remove files from list when upload is canceled
      for (let i = 0; i < this.formFileArray.length; ++i) {
        console.log(this.formFileArray.value[i]);
        if (this.formFileArray.value[i].filename == filename) {
          this.formFileArray.removeAt(i);
          console.log('REMOVED');
        }
      }
    } else {
      this.resetFormGroup();
      this.fileGroup.disable();
    }
  }

  reset(filename: string) {
    this.uploadProgress[filename] = 0;
    this.uploadSub = undefined;
  }

  removeCacheFile(id: string) {
    console.log(id);
    this.http
      .delete('http://localhost:3000/files/cache/' + id)
      .subscribe((x) => {
        console.log(x);
        if (this.multiple) {
          this.formFileArray.controls = this.formFileArray.controls.filter(
            (c) => c.get('id')?.value !== id,
          );
        } else {
          this.resetFormGroup();
          this.fileGroup.disable();
        }
      });
  }
  removeFile(id: string) {
    console.log(id);
    const filetype = fileTypes[this.controlname];
    this.http
      .delete(`http://localhost:3000/files/${id}?fileType=${filetype}`)
      .subscribe((x) => {
        console.log(x);
        if (this.multiple) {
          this.formFileArray.controls = this.formFileArray.controls.filter(
            (c) => c.get('id')?.value !== id,
          );
        } else {
          this.resetFormGroup();
          this.fileGroup.disable();
        }
      });
  }

  resetFormGroup() {
    this.fileGroup.removeControl('id');
    this.fileGroup.removeControl('path');
    this.fileGroup.removeControl('mimetype');
    this.fileGroup.removeControl('filename');
  }
}
