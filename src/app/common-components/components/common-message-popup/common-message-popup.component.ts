import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-message-popup',
  templateUrl: './common-message-popup.component.html',
  styleUrls: ['./common-message-popup.component.scss']
})
export class CommonMessagePopupComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<CommonMessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     }

  ngOnInit(): void {
  }

}
