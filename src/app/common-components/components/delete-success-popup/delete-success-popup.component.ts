import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-success-popup',
  templateUrl: './delete-success-popup.component.html',
  styleUrls: ['./delete-success-popup.component.scss']
})
export class DeleteSuccessPopupComponent implements OnInit {


  @Output() onOkClick = new EventEmitter()
  refNumber: any;
  emptyTrashFlag: boolean = false;
  constructor(public matDialogRef: MatDialogRef<DeleteSuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any) { 
      this.refNumber = this._data.data;
    }

  ngOnInit(): void {
    if(this.refNumber === "emptyTrash"){
      this.emptyTrashFlag = true;
    }
  }

  onClickOk(){
    this.onOkClick.emit();
  }

}
