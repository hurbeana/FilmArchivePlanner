import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileDto } from 'src/app/shared/models/file';

export interface PlayEvent {
  url: string;
  mimetype: string;
}

@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.component.html',
  styleUrls: ['./file-display.component.less'],
})
export class FileDisplayComponent implements OnInit {
  @Input() file!: FileDto;
  @Input() fileType!: string;
  @Output() playClicked = new EventEmitter<PlayEvent>();

  filePath!: string;

  constructor() {}

  ngOnInit(): void {
    this.filePath = `http://localhost:3000/files/${this.file.id}?fileType=${this.fileType}`;
  }

  playClickedHandler() {
    let mimetype = '';
    if (this.file.mimetype) {
      // Sometimes the mimetype arrives strangely "('video/mp4', none)", could also be replaced by a regex
      const firstBounds = this.file.mimetype.indexOf("'") + 1;
      const secondBounds = this.file.mimetype.lastIndexOf("'");
      if (secondBounds === -1) mimetype = this.file.mimetype;
      else mimetype = this.file.mimetype.slice(firstBounds, secondBounds);
      this.playClicked.emit({
        url: this.filePath,
        mimetype,
      });
    }
  }
}
