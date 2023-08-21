import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { PaymentsServiceService } from '../../services/payments-service.service';

@Component({
  selector: 'app-delete-beneficiary',
  templateUrl: './delete-beneficiary.component.html',
  styleUrls: ['./delete-beneficiary.component.scss']
})
export class DeleteBeneficiaryComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  receiptForm = false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    type:""
  }
  callBeneValidation : boolean = false;
  constructor(public dialog: MatDialog,public paymentservice:PaymentsServiceService,private route: Router) { }

  ngOnInit(): void {
    this.initReqParam.accNo=this.rootScopeData.singleBeneficiaryDetailsObject && this.rootScopeData.singleBeneficiaryDetailsObject.childValues && this.rootScopeData.singleBeneficiaryDetailsObject.childValues.accountNo ? this.rootScopeData.singleBeneficiaryDetailsObject.childValues.accountNo:"";
    this.initReqParam.amt="0";
    this.initReqParam.pdroductCode=this.rootScopeData.singleBeneficiaryDetailsObject && this.rootScopeData.singleBeneficiaryDetailsObject.childValues && this.rootScopeData.singleBeneficiaryDetailsObject.childValues.product ? this.rootScopeData.singleBeneficiaryDetailsObject.childValues.product:"";
    this.initReqParam.subPrdCode="BENE";
    this.initReqParam.cif=this.rootScopeData.singleBeneficiaryDetailsObject && this.rootScopeData.singleBeneficiaryDetailsObject.childValues && this.rootScopeData.singleBeneficiaryDetailsObject.childValues.accountNo ? this.rootScopeData.singleBeneficiaryDetailsObject.childValues.accountNo:"";
    this.initReqParam.unitId=this.rootScopeData.singleBeneficiaryDetailsObject && this.rootScopeData.singleBeneficiaryDetailsObject.childValues && this.rootScopeData.singleBeneficiaryDetailsObject.childValues.unitId ? this.rootScopeData.singleBeneficiaryDetailsObject.childValues.unitId:"";
this.initReqParam.type = this.rootScopeData.singleBeneficiaryDetailsObject && this.rootScopeData.singleBeneficiaryDetailsObject.childValues && this.rootScopeData.singleBeneficiaryDetailsObject.childValues.subProduct ? this.rootScopeData.singleBeneficiaryDetailsObject.childValues.subProduct +''+"DEL":"" ;
    this.details = this.rootScopeData.singleBeneficiaryDetailsObject;
  }
  
  deleteBeneficiary(){
    if(this.rootScopeData.userInfo.isSingleUser === 'Y' && this.rootScopeData.userInfo.isSoloCorporate === 'Y'){
      if(!this.userOtpValue || this.userOtpValue.length !== 4){
         this.isOtpValid = "LBL_PLS_ENTER_OTP";
         return;
       }
    }
    let dialogRef = this.dialog.open(DeletePopupComponent,{
      width:'400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {
     this.deleteBeneRecord(this.rootScopeData.singleBeneficiaryDetailsObject);
     this.dialog.closeAll();
    });
  }
  
  deleteBeneRecord(data:any){
    this.isLoadingCompelete = false;
    let params={
      accountNo : this.details && this.details.childValues.accountNo?this.details.childValues.accountNo:"",
      refNo: this.details && this.details.parentValues.odRefNo ? this.details.parentValues.odRefNo:"",
      beneId: this.details && this.details.parentValues.beneId ? this.details.parentValues.beneId:"",
      beneName: this.details && this.details.parentValues.beneNme ? this.details.parentValues.beneNme:"",
      beneAliasName: this.details && this.details.parentValues.alliasName ? this.details.parentValues.alliasName :"",
      subProductCode: this.details && this.details.childValues.subProduct ? this.details.childValues.subProduct: "",
      otp: this.details && this.userOtpValue ? this.userOtpValue:"",
      otpRef: this.details && this.secAuthRef ? this.secAuthRef:""
    }
      this.paymentservice.deleteBeneficiaryAPiCall(params).subscribe(
        data =>{
          this.isLoadingCompelete = true;
          let vres:any = [];
          vres = data;
          if (vres.dataValue && vres.dataValue.OD_STATUS_DESC === "Success"){
            this.rootScopeData.showSystemError = true;
            this.rootScopeData.toastMessage = "LBL_BENEFICIARY_DELETE_TOAST";
            this.route.navigate(['/payments/beneficiaryInquiry'])
          }else{
              this.isOtpValid = "LBL_PLEASE_ENTER_VALID_OTP";
          }
          }, error => {
            this.isLoadingCompelete = true;
            this.rootScopeData.showSystemError = true;
        }
        
      )
  }
  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    // this.userOtpValue = otpValue;
    if (otpValue) {
      this.isOtpValid = "";
      this.userOtpValue = otpValue;
      this.deleteBeneficiary();
      // if(!this.callBeneValidation){
      //   this.deleteBeneficiary();
      // }else{
      //   this.callBeneValidation = false
      // }
    } else {
      this.userOtpValue = "";
      this.isOtpValid = "LBL_PLS_ENTER_OTP";
  
    }
    
  }
  getDetails(event:any){
    this.callBeneValidation = event
  }
  onClickCancel(){
    this.route.navigate(['/payments/beneficiaryInquiry'])
  }
}
