import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit {
  // dataSourceToPass: any;
  @Input() workFlowData:any;
  dataSourceLength: any;
  responseHeader: any;
  isWorkFlowExpand: boolean = false;
  noRecordFoundInfoObj: any;
  contentHeight: any;
  norecordflag:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  dataSourceToPass: any;
  dataSource: any;
  authorizerData: any;
  pendingAuthorizerData: any;
  isLoadingCompelete = true;
  displayedColumns = [
  {key:"LBL_ROLE"},
  {key:"LBL_USER_NAME"},
  {key:"LBL_DATE"}  
  ];
  noPendAuthFlag: boolean = false;
  
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_PENDING_AUTHORIZER_FOUND", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getWorkFlowDetails();
  }

  getTableHeight() {
    let that = this;
    window.setTimeout(function() {
      that.contentHeight = document.getElementById("workFlowexpandCollapseElement")?.clientHeight + '';
    }, 1000);
  }

  getWorkFlowDetails() {
    this.isLoadingCompelete = false;
    this.commonService.getWorkFlowDetails(this.workFlowData).subscribe(
      (data: any) => {
        if(data){
          this.isLoadingCompelete = true;
          this.dataSource = data;
          
          this.authorizerData = data.approverDetails.authorizer; 
          this.pendingAuthorizerData = data.approverDetails.pendingAuthorizer;
          this.norecordflag = (!this.authorizerData && !this.pendingAuthorizerData) ? true:false;
          if(this.authorizerData.length === 0 && this.pendingAuthorizerData.length === 0){
            this.norecordflag = true;
          }
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.norecordflag = true;
      }

    )
  }
  onClickExpand(event:any){
   this.isWorkFlowExpand = !this.isWorkFlowExpand;
  }

}
