import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common-components/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-reject-sadad-bulk-payment',
  templateUrl: './reject-sadad-bulk-payment.component.html',
  styleUrls: ['./reject-sadad-bulk-payment.component.scss']
})
export class RejectSadadBulkPaymentComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  details: any;
  receiptForm: boolean = false;
  // sadadBillerDetails: any;
  sadadDetails: any;
  pdfData: any;
  selectedTransfer:any;
  refNo: any;
  saveReceiptObject:any;

  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location,  private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    //this.getSadadDetails();
    // if (this.rootScopeData.myTaskSADADBulkUploadSummaryObject) {
    //   this.selectedTransfer = this.rootScopeData.myTaskSADADBulkUploadSummaryObject;
    // }
    this.selectedTransfer=this.myTaskService.getSelectedElementDetails();
  }

  getSadadDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadDetailsAPICall(this.rootScopeData.myTaskSADADSummaryObject.ref_NO).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadDetails = res.data;
      // this.sadadBillerDetails = res.data.selectedBillers;
      // this.paymentCCY = res.data.paymentCcy;
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

  rejectReasonValidation(){
    this.rejectReasonModelValue();
  }
rejectReasonModelValue(){
  // this.isrejectreasonValid = this.rejectreason ? false : true;
}
  onClickSubmit(){
    this.rejectReasonModelValue();
    
    let params = {
      refNumber: this.selectedTransfer.odDRefNo,
      productCode: this.selectedTransfer.odProductCode,
      subProductCode: this.selectedTransfer.odSubprodCode,
      functionCode: this.selectedTransfer.odFunctionCode,
      rejectReason: this.rejectreason,
  };
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.sadadFilePaymentRejectApiCall(params).subscribe(
        (response:any) =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
            this.refNo = response.dataValue.SELECTED_RECORDS
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
        }
      )
    }
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_SADAD_FILE_PYMNT_REJECT',
      referenceNumber: refNumber,
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
      "Description": this.translateService.instant("LBL_SADAD_FILE_PYMNT_REJECT"),
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
    this.router.navigate(['/mytask/sadad/sadadfilepayment'])
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_REJECT_SADAD_BULK_PAYMENT"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
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
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_FILE_PYMNT_REJECT'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-SadadBulkPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-SadadBulkPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}