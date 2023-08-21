import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-configuration-management',
  templateUrl: './configuration-management.component.html',
  styleUrls: ['./configuration-management.component.scss']
})
export class ConfigurationManagementComponent implements OnInit {
@Input() public toCardDisplay=false;
hideArrow=true
  constructor() { }

  ngOnInit(): void {
  }
//   getDisplayStatus(val:any){
//     this.toCardDisplay=val
//   }
//   getDisplayArrowStatus(val:any){
//     this.hideArrow=(val)
//   }
}
