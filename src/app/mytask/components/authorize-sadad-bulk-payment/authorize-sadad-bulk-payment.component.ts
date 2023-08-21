import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-sadad-bulk-payment',
  templateUrl: './authorize-sadad-bulk-payment.component.html',
  styleUrls: ['./authorize-sadad-bulk-payment.component.scss']
})
export class AuthorizeSadadBulkPaymentComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  selectedTransfer:any;
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private commonService:CommonService,private myTaskService:MyTaskService, private location: Location,private route: Router, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { 
  }

  ngOnInit(): void {
    //this.getSadadDetails();
    this.selectedTransfer=this.myTaskService.getSelectedElementDetails();
    this.checkAuthorization();
    // if (this.rootScopeData.myTaskSADADBulkUploadSummaryObject) {
    //   this.selectedTransfer = this.rootScopeData.myTaskSADADBulkUploadSummaryObject;
    // }
    //this.selectedTransfer=this.myTaskService.getSelectedElementDetails();
  }
  
  onClickSubmit(){
    let params = {
      refNumber: this.selectedTransfer.odDRefNo,
      productCode: this.selectedTransfer.odProductCode,
      subProductCode: this.selectedTransfer.odSubprodCode,
      functionCode: this.selectedTransfer.odFunctionCode,
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.OD_RULE_PARSE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      USER_NUMBER_LIST: this.authDataObj && this.authDataObj.selectedAprover
      ? this.authDataObj.selectedAprover.OD_USER_NO
      : '',
      remarks: !this.authDataObj ? '' : !this.authDataObj.aproveNote ? '':this.authDataObj.aproveNote
  };
        this.isLoadingCompelete = false;
      this.myTaskService.sadadFilePaymentsAuthorizeApiCall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
           this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
           this.refNo = response.dataValue.SELECTED_RECORDS;
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_SADAD_PAYMENT_APPROVED",
      "referenceNumber":refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_ACCOUNT_NAME',
              dataKey: this.selectedTransfer?.makerName ? this.selectedTransfer.makerName : '--',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.selectedTransfer?.accNo ? this.selectedTransfer.accNo : '--',
            }
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_DEPO_TYPE',
              dataKey: this.selectedTransfer?.uploadType ? this.selectedTransfer.uploadType : '--',
            },
            {
              dispKey: 'LBL_FORMAT',
              dataKey: this.selectedTransfer?.fileFormat ? this.selectedTransfer.fileFormat : '--',
            },
            {
              dispKey: 'LBL_UPLOAD_FILE',
              dataKey: this.selectedTransfer?.odFileName ? this.selectedTransfer.odFileName : '--',
            },
            {
              dispKey: 'LBL_TOTAL_AMOUNT',
              dataKey: this.selectedTransfer?.odFileAmount ? `${this.selectedTransfer?.odFileAmount} ${this.selectedTransfer.odTxnCy}` : '--',
            },
          ],
        },
        {
          "title": 'LBL_AUTHORIZATION',
          "isTable": 'false',
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_Next_Approver",
              "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.authDataObj.selectedAprover.AUTH_NAME
            },
            {
              "dispKey": "LBL_ADD_NEXT_APROVER",
              "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.aproveNote ? 'Not Provided':this.authDataObj.aproveNote
            },
          ],
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
              "buttonLabel":"LBL_MAKE_ANOTHER_AUTHORIZATION"
          },
        "finishButton":{
              "buttonLabel":"LBL_FINISH",
              "buttonPath":"/dashboard"
    }
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_SADAD_BULK_PAYMENT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_PAYMENT_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.selectedTransfer?.makerName ? this.selectedTransfer.makerName : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedTransfer?.accNo ? this.selectedTransfer.accNo : '--'
        },
        {
          "subHead": "File Details",
          "subValue": ""
        },
        {
          "subHead": "Type",
          "subValue": this.selectedTransfer?.uploadType ? this.selectedTransfer.uploadType : '--'
        },
        {
          "subHead": "Format",
          "subValue": this.selectedTransfer?.fileFormat ? this.selectedTransfer.fileFormat : '--'
        },
        {
          "subHead": "Upload File",
          "subValue": this.selectedTransfer?.odFileName ? this.selectedTransfer.odFileName : '--'
        },
        {
          "subHead": "Total Amount",
          "subValue": this.selectedTransfer?.odFileAmount ? `${this.selectedTransfer?.odFileAmount} ${this.selectedTransfer.odTxnCy}` : '--'
        }
      ],
      "pagecall":"sadadbulkauth",
      "refNo":refNumber
    }
  }

  onBackArrowClick(){
    this.location.back();
  }

  initiateAnotherRequest(){
    this.route.navigate(['/mytask/sadad/sadadfilepayment'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    //console.log(this.selectedTransfer)
    var sadad_bulk = this.selectedTransfer
    let data = {
      gcif: "",  
      cif: sadad_bulk.cifNo,
      productCode: sadad_bulk.odProductCode,
      subProdCode: sadad_bulk.subProduct,
      funcCode: sadad_bulk.odFunctionCode, 
      amount: sadad_bulk.odFileAmount,
      accNo: sadad_bulk.accNo,
      pymntCurrency: sadad_bulk.odTxnCy, 
      debitCurrency: sadad_bulk.currency,
      referenceNo:sadad_bulk.odDRefNo
    }
    this.myTaskService.checkAuthorizationData(data).subscribe((res)=>{

      if (res) {
        this.sefAuthFlag = res.data.selfAuth
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        // this.isLoadingCompelete = true;
      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_SADAD_BULK_PAYMENT"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type: 'heading', value:this.translateService.instant('LBL_ACCOUNT_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_DEPO_TYPE'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_FORMAT'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_UPLOAD_FILE'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_TOTAL_AMOUNT'), y:135},
    { type: 'text', value:this.selectedTransfer.makerName ? this.selectedTransfer.makerName : '--', y:75},
    { type: 'text', value:this.selectedTransfer.accNo ? this.selectedTransfer.accNo : '--', y:85},
    { type: 'text', value:this.selectedTransfer.uploadType ? this.selectedTransfer.uploadType : '--', y:105},
    { type: 'text', value:this.selectedTransfer.fileFormat ? this.selectedTransfer.fileFormat : '--', y:115},
    { type: 'text', value:this.selectedTransfer.odFileName ? this.selectedTransfer.odFileName : '--', y:125},
    { type: 'text', value:this.selectedTransfer?.odFileAmount ? `${this.selectedTransfer?.odFileAmount} ${this.selectedTransfer.odTxnCy}` : '--', y:135},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_PAYMENT_APPROVED'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-SadadBulkPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-SadadBulkPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/sadad/sadadfilepayment'])
}

}
