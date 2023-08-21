import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
  styleUrls: ['./no-record-found.component.scss']
})
export class NoRecordFoundComponent implements OnInit {
  @Input() noRecordFoundInfo: any;
  constructor() { }

  ngOnInit(): void {
    
    
  }
 
}
