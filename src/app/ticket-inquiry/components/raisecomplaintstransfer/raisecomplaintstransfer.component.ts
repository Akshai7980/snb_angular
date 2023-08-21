import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TicketServiceService } from '../../services/ticket-service.service';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-raisecomplaintstransfer',
  templateUrl: './raisecomplaintstransfer.component.html',
  styleUrls: ['./raisecomplaintstransfer.component.scss']
})
export class RaisecomplaintstransferComponent implements OnInit {
  isChecked = "TRFFNC"
  transfer:string = "LBL_TRANSFER"
  payroll:string = "LBL_PAYROLL"
  rootScopeData: RootScopeDeclare = RootScopeData;
  debitAccountDetailsObj: any
  fromAccountDetails: any = [];
  isLoadingCompelete = false;
  shownSearchFlag = true;
  DebitClearFlag = false;
  compliantType = false;
  // compdetail = false;
  // showFeeDetails:boolean=false;
  showReadOly:boolean=false;
  review : boolean =false;
  complaintsObj:any;
  receiptData:any;
  showReceipt : boolean = false;
  hideBtn: boolean = false; 
  compTypeObj: any;
  isTransferCompliant = true;
  isPayrollCompliant = false;
  dataSource:any=[];
  transferData: any = [];
  enititlementTabs : any;
  constructor(private ticketService:TicketServiceService,private router :Router,private translateService:TranslateService) { }

  ngOnInit(): void {
    this.getEntitleTabs();
    this.getDebitData();
    this.getTransferDirections();
  }
  getDebitData() {
    this.ticketService.getTransferDetails().subscribe((debData: any) => {
      if (debData) {
        this.isLoadingCompelete = true;
        let debitData = debData.DATA.ALL_RECORDS;

        for (let i in debitData) {         
          let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = debitData[i].OD_CCY_CODE;
          let convtd_amount ='';
          if(crntAvail_amount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
             convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
             debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
             debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }               
        }  
        this.debitAccountDetailsObj = {
          "title": "LBL_ACCOUNTS",
          "data": debitData,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "OD_ACC_NAME"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              "dataKeySupport":"OD_CCY_CODE"
            }
          ]
        };
      }
    
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  afterFromAccountSelection(fromAccount: any){
    

    if (fromAccount == 'iconClick'){
      this.debitAccountDetailsObj = "";
      this.getDebitData();
      this.compliantType = false;
      this.review = false;
      this.complaintsObj = false;

      // this.showFeeDetails = false;
      
    }else{
      this.compliantType = true;
      // this.review = false;
      // this.complaintsObj = false
      // this.showFeeDetails = true;
      this.fromAccountDetails=[fromAccount]
    }
  }
  prceedNext(){
    // this.hideBtn = false;
    
    this.isLoadingCompelete=false
    if(this.isChecked == 'TRFFNC'){
      Object.assign(this.complaintsObj,
        {"complaintType":'TRFFNC'});
    }
    else if(this.isChecked == 'PAYFNC'){
      Object.assign(this.complaintsObj,
        {"complaintType":'PAYFNC'});
    }

    let param = {
      functionCode  : this.isChecked,
      UNIT_ID : this.rootScopeData.userInfo.UNIT_ID,
      mobNum : this.complaintsObj.mobNum,
      direction : this.complaintsObj.direction,
      amount : this.complaintsObj.amount,
      refnum : this.complaintsObj.refnum,
      claimdesc : this.complaintsObj.claimdesc,
      type : this.complaintsObj.type,
      filename : this.complaintsObj.filename,
      dot : this.complaintsObj.dot,
      retentionDate : this.complaintsObj.retentionDate,
      heldamount : this.complaintsObj.heldamount,
      accNo : (this.fromAccountDetails &&  this.fromAccountDetails[0].OD_PORTAL_ACC_NO) ?  this.fromAccountDetails[0].OD_PORTAL_ACC_NO : ''
    }
    
    this.ticketService.raiseComplaintSubmit(param).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      this.dataSource = res.dataValue.serviceRequest;
      this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO);
      this.hideBtn = false;
      this.showReceipt = true;
      this.complaintsObj={};
    },err=>{
      this.isLoadingCompelete = true;
    })
    
  }
      
  

  
  constructReceiptData(refNumber: any){
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0],{USER_ID:userId})
    
    // console.log(this.complaintsObj);
    if(this.isTransferCompliant){
      this.receiptData = {
        "msg1": "LBL_PAYMENT_SUCCESSFULL",
        "msg2": "LBL_APPLY_EPAY_PNDG_FR_APPROVAL",
        "referenceNumber": refNumber,
        "receiptDetails": [
          {
            "title": "LBL_FROM",
            "isTable": "true",
            "data": this.fromAccountDetails,
            "fieldDetails": [
              {
                "dispKey": "LBL_ACTION_BY",
                "dataKey": "USER_ID"
              },
              {
                "dispKey": "LBL_ACC_NUMBER",
                "dataKey": "OD_ACC_NO"
              },
              {
                "dispKey": "LBL_SHORT_NAME",
                "dataKey": "ALIAS_NAME"
              }
            ]
          },
          {
            "title": "LBL_COMPALINT_DETAILS",
            "title2": "LBL_TRANSFER",
            "isTable": "false",
            "data": this.complaintsObj,
            "fieldDetails": [
              {
                "dispKey": "ComplaintType",
                "dataKey": this.complaintsObj.type
              },
              {
                "dispKey": "LBL_MOBILE_NUMBER",
                "dataKey": this.complaintsObj.mobNum
              },
              {
                "dispKey": "LBL_DATE_OF_TRANSFER",
                "dataKey": this.complaintsObj.dot
              },
              {
                "dispKey": "LBL_AMOUNT",
                "dataKey": this.complaintsObj.amount
              },
              {
                "dispKey": "LBL_TRANSFER_REFERENCE_NUMBER",
                "dataKey": this.complaintsObj.refnum
              },
              {
                "dispKey": "LBL_CLAIM_DESC",
                // "dataKey": this.complaintsObj.claimdesc
                "dataKey": this.complaintsObj && this.complaintsObj.claimdesc ? this.complaintsObj.claimdesc : this.translateService.instant("LBL_NOT_PROVIDED")
              },
              {
                "dispKey": "LBL_TRANSFER_DIRECTION",
                "dataKey": this.complaintsObj.direction
              }
            ]
            
          },       
        ],
        "printButton": {
          "buttonLabel": "LBL_PRINT_RECEIPT",
          "buttonIcon": "./assets/images/PrinterIcon.png"
        },
        "saveButton": {
          "buttonLabel": "LBL_SAVE_RECEIPT",
          "buttonIcon": "./assets/images/saveReceipt.svg"
        },
        "initiateButton": {
          "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
        },
        "finishButton": {
          "buttonLabel": "LBL_FINISH",
          "buttonPath": "/dashboard"
        }
      }; 
    }
    else {
      this.receiptData = {
        "msg1": "LBL_PAYMENT_SUCCESSFULL",
        "msg2": "LBL_APPLY_EPAY_PNDG_FR_APPROVAL",
        "referenceNumber": refNumber,
        "receiptDetails": [
          {
            "title": "LBL_FROM",
            "isTable": "true",
            "data": this.fromAccountDetails,
            "fieldDetails": [
              {
                "dispKey": "LBL_ACTION_BY",
                "dataKey": "USER_ID"
              },
              {
                "dispKey": "LBL_ACC_NUMBER",
                "dataKey": "OD_ACC_NO"
              },
              {
                "dispKey": "LBL_SHORT_NAME",
                "dataKey": "ALIAS_NAME"
              }
            ]
          },
          {
            "title": "LBL_COMPALINT_DETAILS",
            
            "isTable": "false",
            "data": this.complaintsObj,
            "fieldDetails": [
              {
                "dispKey": "ComplaintType",
                "dataKey": this.complaintsObj.type
              },
              {
                "dispKey": "LBL_MOBILE_NUMBER",
                "dataKey": this.complaintsObj.mobNum
              },
              {
                "dispKey": "LBL_RENTENSION_DATE",
                "dataKey": this.complaintsObj.retentionDate
              },
              {
                "dispKey": "LBL_HELD_AMOUNT",
                "dataKey": this.complaintsObj.heldamount
              },
              {
                "dispKey": "LBL_FILE_NAME",
                "dataKey": this.complaintsObj.filename
              },
              {"dispKey": "LBL_CLAIM_DESC",
              "dataKey": this.complaintsObj && this.complaintsObj.claimdesc ? this.complaintsObj.claimdesc : this.translateService.instant("LBL_NOT_PROVIDED")
              }
    
            ]
            
          }        
        ],
        "printButton": {
          "buttonLabel": "LBL_PRINT_RECEIPT",
          "buttonIcon": "./assets/images/PrinterIcon.png"
        },
        "saveButton": {
          "buttonLabel": "LBL_SAVE_RECEIPT",
          "buttonIcon": "./assets/images/saveReceipt.svg"
        },
        "initiateButton": {
          "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
        },
        "finishButton": {
          "buttonLabel": "LBL_FINISH",
          "buttonPath": "/dashboard"
        }
      };
    }
   
    
  }
  downloadPdf(){

  }

  displayContent(value: any) {
    this.isChecked = value

    if(this.isChecked == 'TRFFNC'){
      // this.router.navigate(['ticketInquiry/RaiseComplaint']);
      this.isTransferCompliant = true;  
      this.isPayrollCompliant = false;
    }else {
      // this.router.navigate(['ticketInquiry/RaiseComplaintPayroll']);
      // this.getRefundDebitData();
      this.isTransferCompliant = false;
      this.isPayrollCompliant = true;
    }
  }
  getProceedDetailValue(event:any){

    this.review = true;
    // console.log("",event)
    this.complaintsObj=event;
    console.log(this.complaintsObj)  
  }
  getProceedDetails(event:any){
    this.review = true;
    this.complaintsObj=event;     
    // console.log(this.complaintsObj);
    }


onClickCancel(){
  this.initGenerateStatement();
  
  this.getCancel();
  this.getCancelClick();
}
initGenerateStatement(){
  // this.comptype = true;
  
  this.compliantType = false;
  this.review = false;
  this.complaintsObj = false;
  this.debitAccountDetailsObj = "";
  this.getDebitData();

}
getCancel(event?:any){
  this.debitAccountDetailsObj = "";
  this.getDebitData();
  // console.log(event);
  this.compliantType = false;
  this.review = false;
  this.complaintsObj = false;
  
}
getCancelClick(event?:any){
  this.debitAccountDetailsObj = "";
  this.getDebitData();
  // console.log(event);
  this.compliantType = false;
  this.review = false;
  this.complaintsObj = false;

}

getTransferDirections(){
let param = {
  UNIT_ID : this.rootScopeData?.userInfo?.UNIT_ID
};
this.isLoadingCompelete = false;
  this.ticketService.getTransferDirections(param).subscribe((res:any)=> {
    this.isLoadingCompelete = true;
    if(res && res.data){
      this.transferData = res.data;
    }
  }, error => {
    this.isLoadingCompelete = true;
  });
}
  
getEntitleTabs(){
  this.isLoadingCompelete = false;
  let param = {
    UNIT_ID  : this.rootScopeData?.userInfo?.UNIT_ID
  }
  this.ticketService.getRaiseComplaintTabs(param).subscribe((res : any)=>{
    this.isLoadingCompelete = true;
    if(res && res.data && res.data.entitledSubPdt){
      this.enititlementTabs = res.data.entitledSubPdt;
    }
  }, error => {
    this.isLoadingCompelete = true;
  })
}


}

