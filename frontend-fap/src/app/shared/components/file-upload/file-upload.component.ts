import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { AbstractControl, FormArray, FormControl, FormGroup, FormGroupDirective } from "@angular/forms";
import {  UploadFileResponseDto } from "../../models/upload.file.response";
import { FileDto } from "../../models/file";

@Component({
  selector: 'shared-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
})
export class FileUploadComponent {
  @Input()
  requiredFileType: string;

  @Input() controlname: string;

  @Input() multiple: boolean;

  //multiple files
  formFileArray: FormArray;

  //single file
  fileGroup: FormGroup;

  //files: FileDto[] = [];
  uploadProgress: number = 0;
  uploadSub?: Subscription;
  canceled = false;

  form: FormGroup;

  constructor(
    private http: HttpClient,
    private rootFormGroup: FormGroupDirective,
  ) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    if(this.multiple){
      this.formFileArray = this.form.get(this.controlname) as FormArray; // has to be
    }else{
      this.fileGroup = this.form.get(this.controlname) as FormGroup;
      console.log(this.fileGroup);
      if(!this.fileGroup.contains('id')){
        this.fileGroup.disable(); // disable -> no value
      }
    }
  }

  getFormGroup(a: AbstractControl): FormGroup{
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
        let newfileGroup = new FormGroup({filename: new FormControl(file.name)});
        if(this.multiple){
          this.formFileArray.push(newfileGroup);
        }else{
          //TODO:
          this.fileGroup.setControl('filename', new FormControl(file.name));
        }
        const formData = new FormData();
        formData.append('file', file);

        const upload$ = this.http
          .post<UploadFileResponseDto>('http://localhost:3000/files/cache', formData, {
            reportProgress: true,
            observe: 'events',
          })
          .pipe(finalize(() => this.finishedUpload()));

        this.uploadSub = upload$.subscribe((response) => {
          if (response?.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              100 * (response.loaded / (response.total ?? 0))
            );
          }else if(response?.type == HttpEventType.Response && response?.body?.id){
            console.log(response);

            if(this.multiple){
              newfileGroup.addControl('id',new FormControl(response.body.id));
            }else{
              this.fileGroup.enable(); // enable -> value
              this.fileGroup.setControl('id',new FormControl(response.body.id));
            }
          }
        });
      }
    });
  }

  finishedUpload() {
    this.reset();
  }

  cancelUpload() {
    this.canceled = true;
    this.uploadSub?.unsubscribe();
    //this.files = []; //TODO
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = undefined;
  }

  removeFile(id: string){
    console.log(id);
    this.http.delete('http://localhost:3000/files/cache/'+id).subscribe(x => {
      console.log(x);
      //this.files = this.files.filter(f => f.id !== id);
      this.formFileArray.controls = this.formFileArray.controls.filter(c => c.get('id')?.value !== id);
    });
  }
}
