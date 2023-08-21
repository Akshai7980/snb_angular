import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {

  @Output() onDelete = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  deleteRecord(){
    this.onDelete.emit();
  }
}
