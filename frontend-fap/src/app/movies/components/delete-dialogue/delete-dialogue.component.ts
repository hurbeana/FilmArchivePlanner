import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialogue',
  templateUrl: './delete-dialogue.component.html',
  styleUrls: ['./delete-dialogue.component.less'],
})
export class DeleteDialogueComponent implements OnInit {
  //gets called by edit-view when Delete button is called. Opens dialogue box with "are you sure?" message

  constructor(
    public dialogueRef: MatDialogRef<DeleteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueData,
  ) {}

  ngOnInit(): void {}

  //get called when answer buttons are clicked
  onNoClick(): void {
    this.dialogueRef.close(false);
  }
  onYesClick(): void {
    this.dialogueRef.close(true);
  }
}

export interface DialogueData {
  movie: string;
}
