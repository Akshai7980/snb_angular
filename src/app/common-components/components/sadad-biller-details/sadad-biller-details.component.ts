import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sadad-biller-details',
  templateUrl: './sadad-biller-details.component.html',
  styleUrls: ['./sadad-biller-details.component.scss']
})
export class SadadBillerDetailsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  chequeBookDetailsData: any;
  logo :string ="";
  printSection:string="";
  chargeAmt: any; 
  taxAmt: any;
  refNum: any;
  nickname: any;
  sadadBillerDetailsData: any;
  @Output() onEnabledProp = new EventEmitter<any>();
  constructor(private commonService:CommonService) {this.logo = logoprint(); }

  ngOnInit(): void {
    this.printSection="sadadBillerDetailsPrintSection";
    if(this.rootScopeData.sadadBillerSummaryObject){
      this.refNum = this.rootScopeData.sadadBillerSummaryObject.refNo
      this.nickname = this.rootScopeData.sadadBillerSummaryObject.nickName;
    }
    if(this.rootScopeData.pendingActivitiesSadadBillerSummaryObj){
      this.refNum = this.rootScopeData.pendingActivitiesSadadBillerSummaryObj.lib_ref_no
      this.nickname = this.rootScopeData.pendingActivitiesSadadBillerSummaryObj.nickName;
    }
    this.getSadadBillerDetails();
  }

  getSadadBillerDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadBillerdetailsDetailsApiCall(this.refNum,this.nickname).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if(res.data[0]){
        this.sadadBillerDetailsData = res.data[0];
        this.rootScopeData.sadadBillerDetailsObj= res.data[0]; 
        this.onEnabledProp.emit('false');

      }
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
      this.rootScopeData.showSystemError = true;
    })
  }
}
