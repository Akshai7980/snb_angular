import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-reject-common-services',
  templateUrl: './reject-common-services.component.html',
  styleUrls: ['./reject-common-services.component.scss']
})
export class RejectCommonServicesComponent implements OnInit {
  receiptData:any;
  dataValue:any;
  hideAll = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails = RootScopeData.myTaskRejectDetails;
  rejectReason: string = '';
  isrejectreasonValid : boolean = false;
  routeBack = '/mytask/commonServices';
  saveReceiptObject:any;
  constructor(public mytaskService:MyTaskService,private translateService: TranslateService,) { }

  ngOnInit(): void {
    
  }

  submit(){
    this.hideAll = true;
    let param ={
      refNo: this.transferDetails && this.transferDetails.refNo ? this.transferDetails.refNo : '',
      productCode: this.transferDetails && this.transferDetails.productCode ? this.transferDetails.productCode : '',
      subprcode: this.transferDetails && this.transferDetails.subprcode ? this.transferDetails.subprcode : '',
      action: this.transferDetails && this.transferDetails.action ? this.transferDetails.action : '',
      hostCode: this.transferDetails && this.transferDetails.hostCode ?  this.transferDetails.hostCode : '',
      version: this.transferDetails &&  this.transferDetails.version ?  this.transferDetails.version  : '',
      param1 : this.rejectReason
  }
    this.mytaskService.rejectCommonServices(param).subscribe((res : any) => {
      if (res.dataValue.STATUS == "Success") {
        this.constructReceiptData(res.dataValue.INTERNAL_REFERENCE_NO);
      }
    })
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_REJECTION_STMT",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          title: '',
          "isTable": "true",
          "data": [{}],
          "authorizeButtonRouterPath": "/accounts/commonServices",
          "fieldDetails": [
            {
              dispKey: 'LBL_TRANSACTION_NUMBER',
              dataKey: refNumber,
            },
            {
              dispKey: 'LBL_PAYMENT_TYPE',
              dataKey: this.transferDetails.requestType,
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.transferDetails.acc_NO,
            },
          ]
        },
        
      ],
      "printButton":{
        "buttonLabel":"LBL_PRINT_RECEIPT",
        "buttonIcon":"./assets/images/PrinterIcon.png"
      },
      "saveButton":{
        "buttonLabel":"LBL_SAVE_RECEIPT",
        "buttonIcon":"./assets/images/saveReceipt.svg"
      },
      "initiateButton":{
        "buttonLabel":"LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton":{
        "buttonLabel":"LBL_FINISH",
        "buttonPath":"/dashboard"
      }
    };
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_BENEFICIARY_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Transaction Number",
          "subValue": this.transferDetails.refNo ? this.transferDetails.refNo : "--"
        },
        {
          "subHead": "Payment Type",
          "subValue": this.transferDetails.requestType ? this.transferDetails.requestType : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.transferDetails.acc_NO ? this.transferDetails.acc_NO : "--"
        }
      ],
      "pagecall":"commonauthorized",
      "refNo":refNumber
    }
  }

}
