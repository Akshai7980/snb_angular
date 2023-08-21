import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-execution-details-table',
  templateUrl: './execution-details-table.component.html',
  styleUrls: ['./execution-details-table.component.scss']
})
export class ExecutionDetailsTableComponent implements OnInit {

  executionDetailsExpand: boolean = false;
  noRecordFoundInfoObj: any;
  contentHeight: any;
  norecordflag:boolean = false;
  @Input() ExecutuionData : any
  accountDetailsToDisplay: any;
  constructor() { }

  ngOnInit(): void {
    this.getdebitinfo();
  }


  getdebitinfo(){
    this.accountDetailsToDisplay = Object.assign({}, this.ExecutuionData);
  }

  onClickExpand(event:any){
    this.executionDetailsExpand = !this.executionDetailsExpand;
   }

   getTableHeight() {
    let that = this;
    window.setTimeout(function() {
      that.contentHeight = document.getElementById("executionDetailsexpandCollapseElement")?.clientHeight + '';
    }, 1000);
  }

}
