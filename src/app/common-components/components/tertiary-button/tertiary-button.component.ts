import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tertiary-button',
  templateUrl: './tertiary-button.component.html',
  styleUrls: ['./tertiary-button.component.scss']
})
export class TertiaryButtonComponent implements OnInit {
  @Input() public buttonValue:any;
  @Input() iconPath: any;
  @Output() onPrint = new EventEmitter()
  @Input() printSection = '';
  @Output() ontertiaryBtnClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  eventClick()
  {
    this.ontertiaryBtnClick.emit();
  }
 
}
