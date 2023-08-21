import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-sadad',
  templateUrl: './sadad.component.html',
  styleUrls: ['./sadad.component.scss']
})
export class SadadComponent implements OnInit {
@Input() public toCardDisplay=false;
hideArrow=true
  constructor() { }

  ngOnInit(): void {
  }
  getDisplayStatus(val:any){
    this.toCardDisplay=val
  }
  getDisplayArrowStatus(val:any){
    this.hideArrow=(val)
  }
}
