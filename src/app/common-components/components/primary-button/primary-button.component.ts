import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent implements OnInit {
@Input() public buttonValue:any;
@Output() onPrimarybtnemitClick = new EventEmitter();
@Input() disablBtn= false
  constructor() { }

  ngOnInit(): void {
  }


  primarybtnevent(){
    this.onPrimarybtnemitClick.emit();
  }
}
