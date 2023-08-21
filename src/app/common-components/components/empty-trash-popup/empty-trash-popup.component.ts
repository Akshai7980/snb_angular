import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-trash-popup',
  templateUrl: './empty-trash-popup.component.html',
  styleUrls: ['./empty-trash-popup.component.scss']
})
export class EmptyTrashPopupComponent implements OnInit {

  @Output() onDelete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  deleteRecord(){
    this.onDelete.emit();
  }
}
