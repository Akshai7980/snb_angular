import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-esal-biller-details-layout',
  templateUrl: './my-tasks-esal-biller-details-layout.component.html',
  styleUrls: ['./my-tasks-esal-biller-details-layout.component.scss']
})
export class MyTasksEsalBillerDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams:any;
  constructor(private router:Router) { }
 
  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesEsalBillerSummaryObj.referenceNumber,
      productCode:"PAYMNT",
      subProductCode:"PAYRMAIN",
      functionCode:"PAYCRET",
    }
  }



  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeEsalBiller'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectEsalBiller'])
  }
  back(){
    this.router.navigate(['/mytask/billerManagement/esal-biller'])
  }

}
