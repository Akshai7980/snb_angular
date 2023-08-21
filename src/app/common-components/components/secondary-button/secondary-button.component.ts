import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss']
})
export class SecondaryButtonComponent implements OnInit {
  @Input() public buttonValue:any;
  @Input() iconPath: any;
  @Input() routerPath: any;
  @Input() disablBtn= false
  @Output() onPrint = new EventEmitter()
  @Input() printSection = '';
  @Output() onsecondaryClick = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  eventClick()
  {
    this.onsecondaryClick.emit();
  }
}
