import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-reject-cheque-book-request',
  templateUrl: './reject-cheque-book-request.component.html',
  styleUrls: ['./reject-cheque-book-request.component.scss']
})
export class RejectChequeBookRequestComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  details: any;
  receiptForm: boolean = false;
  pdfData: any;
  saveReceiptObject:any;
  constructor(private router:Router,private myTaskService:MyTaskService,private location: Location,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.chequeBookDetailsObject;
    // console.log(this.details)
  }

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    let params={
      remarks: this.rejectreason,
      refNumber:this.details.INPUT_REFERENCE_NO,
      productCode:this.details.INPUT_PRODUCT,
      subProductCode:this.details.INPUT_SUB_PRODUCT,
      action:this.details.INPUT_FUNCTION_CODE,
      versionNumber:this.details.INPUT_VER_NO,
      hostCode:this.details.hostTxnCode
    }
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.chequeBookRequestRejectApiCall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;
          let vdata:any = [];
          vdata = response;          
          if(vdata.dataValue.STATUS === "Success"){
            this.constructReceiptData(this.rootScopeData.pendingActivitiesServiceRequestObject.ref_NO);
            this.receiptForm = true;
            // this.router.navigate(['/mytask/rejectReceipt']);
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
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_CHEQUE_BOOK_REJECTED",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "LBL_FROM",
            "isTable": "false",
            "data": this.rootScopeData.chequeBookDetailsObject,
            "fieldDetails":[
              {
                "dispKey": "LBL_ACTION_BY",
                "dataKey": this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : ''
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO
              },
              {
                  "dispKey": "LBL_NICKNAME",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME
              }
            ]
        },
        {
            "title": "LBL_CHEQUE_BOOK_DETAILS",
            "isTable": "false",
            "data": this.rootScopeData.chequeBookDetailsObject,
            "fieldDetails":[
              {
                "dispKey": "LBL_CHEQUE_BOOK_TYPE",
                "dataKey": this.rootScopeData.chequeBookDetailsObject.NO_BK
              },
              {
                  "dispKey": "LBL_NO_OF_BOOKS",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE
              },
              {
                "dispKey": "LBL_COLLECTION_BRANCH",
                "dataKey": this.rootScopeData.chequeBookDetailsObject.CHE_DEL +" : "+ this.rootScopeData.chequeBookDetailsObject.COL
            }
            ]
        }
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
      "pageheading": this.translateService.instant("LBL_CHQ_REQ_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_CHEQUE_APPROVAL_REQUEST_IS_INT_SUCCESS"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO ? this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME ? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME : "--"
        },
        {
          "subHead": "Cheque Book Details",
          "subValue": ""
        },
        {
          "subHead": "Cheque Book Type",
          "subValue": this.rootScopeData.chequeBookDetailsObject.NO_BK ? this.rootScopeData.chequeBookDetailsObject.NO_BK : "--"
        },
        {
          "subHead": "Number of book(s)",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE ? this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE : "--"
        },
        {
          "subHead": "Collection Branch",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CHE_DEL ? this.rootScopeData.chequeBookDetailsObject.CHE_DEL :"--" 
          +" : "+ this.rootScopeData.chequeBookDetailsObject.COL ? this.rootScopeData.chequeBookDetailsObject.COL : "--"
        },
      ],
      "pagecall":"chequebookrequest",
      "refNo":refNumber
    }
  }

  onBackArrowClick(){
    this.location.back();
  }
  initiateAnotherRequest(){
    this.router.navigate(['/mytask/serviceRequest'])
  }

  downloadPdf(values:any)
  { 
  let SelectedType = values;
  // let currencyFormatPipeFilter = new CurrencyFormatPipe();
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:"Rejected cheque book Receipt", x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:'Transaction Details', y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_DETAILS'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_TYPE'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_NO_OF_BOOKS'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_COLLECTION_BRANCH'), y:135},
    { type: 'text', value:this.rootScopeData.userInfo.loginID? this.rootScopeData.userInfo.loginID : '', y:75},
    { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO? this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO : '', y:85},
    { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME : '', y:95},
    { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.NO_BK? this.rootScopeData.chequeBookDetailsObject.NO_BK : '', y:115},
    { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE? this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE : '', y:125},
    { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.CHE_DEL+" : "+ this.rootScopeData.chequeBookDetailsObject.COL , y:135},
   
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.rootScopeData.pendingActivitiesServiceRequestObject.refNumber? this.rootScopeData.pendingActivitiesServiceRequestObject.refNumber : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_REJECTED'), y:155},
    
  ]
  // debugger;

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-SingleTransfer.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-SingleTransfer.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

}
