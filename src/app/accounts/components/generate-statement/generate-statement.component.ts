import { Component, OnInit } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { AccountDetailsService } from '../../services/account-details.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-generate-statement',
  templateUrl: './generate-statement.component.html',
  styleUrls: ['./generate-statement.component.scss']
})
export class GenerateStatementComponent implements OnInit {
  displayedColumns: string[] = ['nickName', 'accNumber', 'accStatus', 'balance', 'action'];
  dataSource: any;
  chequeBookInfo: any;
  chequeBookRequest = true;
  receiptForm = false;
  generateStatementForm = true;
  period = "";
  periodName="";
  selectedPeriod: any;
  exportAs = "";
  rowLength = 0;
  // periodError = false;
  // exportError = false;
  rootScopeData: RootScopeDeclare = RootScopeData
  selectedaccountDetails: any = [];
  currentday: any;
  firstday: any;
  fromdate: any;
  todate: any;
  maxDate = new Date();
  fromDateValue: any;
  selecteddata: any;
  isLoadingCompelete = true;
  debitAccountDetailsObj: any;
  showStatementDetails = false;
  fromAccountDetails: any = [];
  receiptData: any;
  clearFlag = false;
  searchShownFlag = true;
  errorObj:any={
    fromDateErr:false,
    toDateErr:false,
    exportErr:false,
    periodErr:false
  }
  pdfData: any;
  refNo:any
  saveReceiptObject: any;
  toDateValue:any;
  constructor(private translateService: TranslateService,private accountService: AccountDetailsService,private router: Router,  private downloadAsPdf:downloadAsPdf) 
  { this.rootScopeData.lhsActiveComp = 'generateStatement' }

  ngOnInit(): void {
    if(this.rootScopeData.checkGnerateStatementEdit === true){
      this.rootScopeData.changeHeading = 'Review';
    }else{
      this.rootScopeData.changeHeading = '';
    }
    if(this.rootScopeData.dataFromContextMenu)
    {
      let selectedData:any=[];
      selectedData.push(this.rootScopeData.dataFromContextMenu);
      this.debitAccountDetailsObj = {
        "title": "LBL_FROM",
        "data": selectedData,
        "fieldDetails":[
          {
            "dispKey": "LBL_NICKNAME",
            "dataKey": "NICK_NAME"
          },
          {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
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
      this.showStatementDetails = true;
      this.fromAccountDetails[0] = this.rootScopeData.dataFromContextMenu;
      this.searchShownFlag = false;
    }
    else if(this.rootScopeData.generateAccountsSummaryObject){
      this.getCloneAllStatementDetails();
     }
    else{
      this.getAllStatementDetails();
    }
  }

  getAllStatementDetails() {
    this.isLoadingCompelete = false;
    this.accountService.getGenerateStatementInfo().subscribe((respData: any) => {
      this.isLoadingCompelete = true;
      this.dataSource = respData.DATA.ALL_RECORDS;
      // this.dataSource = this.chequeBookInfo;
      for (let i in this.dataSource) {         
        let crntAvail_amount = this.dataSource[i].CURR_AVAIL_BAL_AMT;
        let convtd_ccy = this.dataSource[i].OD_CCY_CODE;
        let convtd_amount ='';
        if(crntAvail_amount && convtd_ccy){
          let currencyFormatPipeFilter = new CurrencyFormatPipe();
           convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
           this.dataSource[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
           this.dataSource[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
        }               
      }  
      // this.rootScopeData.generateAccountsSummaryObject ='';
      this.debitAccountDetailsObj = {
        "title": "LBL_FROM",
        "data": this.dataSource,
        "fieldDetails": [
          {
            "dispKey": "LBL_NICKNAME",
            "dataKey": "ALIAS_NAME"
          },
          {
            "dispKey": "LBL_ACC_NUMBER",
            "dataKey": "OD_ACC_NO"
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
            "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
            "dataKeySupport":"OD_CCY_CODE",
          }
        ]
      };
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  // selectedRow(row: any) {
  //   if (this.dataSource.length > 1) {
  //     this.dataSource = [row]
  //     this.selecteddata = row;
  //     var valudata = { 'TXN_REF_NO': row.OD_ACC_NO, 'AccName': row.OD_ACC_NAME, 'CIF_NO': row.COD_CORECIF, 'COUNTRY_CODE': row.REQ_COUNTRY_CODE, 'UNIT_ID': "IGTBBH" };   
  //     this.selectedaccountDetails[0] = valudata;
  //     this.rowLength = this.dataSource.length;
  //   }
  //   else {
  //     this.dataSource = this.chequeBookInfo;
  //     this.rowLength = this.dataSource.length;
  //   }
  // }

  click_period(value: any) {
    //debugger;
    this.period = value;

  }

  afterFromAccountSelection(fromAccount: any) {
    if (fromAccount === 'iconClick') {
      this.showStatementDetails = false;
      if(this.rootScopeData.generateAccountsSummaryObject){
        this.debitAccountDetailsObj ='';
        this.getAllStatementDetails();
      }   
    } else {
      this.showStatementDetails = true;
      this.fromAccountDetails[0] = fromAccount;
      this.clearFlag = false;
    }
  }

  initGenerateStatement() {
    this.clear();
  }

  submit() {
    this.rootScopeData.checkGnerateStatementEdit = false;
    this.rootScopeData.changeHeading = '';
    if(this.period==='customDate'){
      this.errorObj.fromDateErr=this.currentday?false:true;
      this.errorObj.toDateErr=this.firstday?false:true;
    }
    this.errorObj.periodErr = this.period ? false : true;
    this.errorObj.exportErr = this.exportAs ? false : true;
  
    if (!this.errorObj.periodErr && !this.errorObj.exportErr && !this.errorObj.fromDateErr && !this.errorObj.toDateErr) {
      this.isLoadingCompelete = false;
      this.accountService.submitGenerateStatementCall( this.fromAccountDetails, this.currentday, this.firstday, this.exportAs).subscribe((respData: any) => {
        let responseobject = respData.dataValue;
        this.isLoadingCompelete = true;
        if (responseobject.OD_STATUS_DESC === "Success") {
          this.generateStatementForm = false;
          this.rootScopeData.dataFromContextMenu='';
          this.refNo=responseobject.INPUT_REFERENCE_NO;
          this.constructReceiptData(responseobject.INPUT_REFERENCE_NO);
          this.receiptForm = true;
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
      }
      );
    }
  }

  constructReceiptData(refNumber: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0],{USER_ID:userId})
    this.receiptData = {
      "msg1": "LBL_GENERATE_STMT_SUCCESS",
      "msg2": "LBL_GENERATE_STATEMENT_DOWNLOAD",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "authorizeButtonRouterPath":"/accounts/generate-statement",
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
          "title": "LBL_STATEMENT_DETAILS",
          "isTable": "false",
          "data": "this.dataSource",
          "fieldDetails": [
            {
              "dispKey": "LBL_PERIOD",
              "dataKey": this.periodName
            },
            {
              "dispKey": "LBL_EXPORT_AS",
              "dataKey": this.exportAs
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
        "buttonLabel":"LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton":{
        "buttonLabel":"LBL_FINISH",
        "buttonPath":"/dashboard"
    }
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_GENERATE_STMT_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_GENERATE_STATEMENT_DOWNLOAD"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "--"
        },
        {
          "subHead": "Short Name",
          "subValue": this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : "--"
        },
        {
          "subHead": "Statement Details",
          "subValue": ""
        },
        {
          "subHead": "Period",
          "subValue": this.periodName ? this.periodName : "--"
        },
        {
          "subHead": "Export As",
          "subValue": this.exportAs ? this.exportAs : "--"
        }
      ],
      "pagecall":"generatestatement",
      "refNo":refNumber
    }
  }

  periodChanged(event: any) {
    this.selectedPeriod = event.value;
    if (this.period === "oneweek") {
      this.periodName = this.translateService.instant("LBL_LAST_ONE_WEEK");
      var curr = new Date;
      var today = curr.getDate() - curr.getDay();
      var last = today - 6;
      var vtoday = new Date(curr.setDate(today));
      this.firstday = "" + vtoday.getDate().toString().padStart(2, "0") + "/" + (vtoday.getMonth() + 1).toString().padStart(2, "0") + "/" + vtoday.getFullYear();
      var endDate = new Date(curr.setDate(last));
      this.currentday = "" + endDate.getDate().toString().padStart(2, "0") + "/" + (endDate.getMonth() + 1).toString().padStart(2, "0") + "/" + endDate.getFullYear();
    }
    else if (this.period === "twoweek") {
      this.periodName = this.translateService.instant("LBL_LAST_TWO_WEEK");
      var curr = new Date;
      var first = curr.getDate() - curr.getDay();
      var last = first - 13;
      var startDate = new Date(curr.setDate(first));
      this.firstday = "" + startDate.getDate().toString().padStart(2, "0") + "/" + (startDate.getMonth() + 1).toString().padStart(2, "0") + "/" + startDate.getFullYear();
      var endDate = new Date(curr.setDate(last));
      this.currentday = "" + endDate.getDate().toString().padStart(2, "0") + "/" + (endDate.getMonth() + 1).toString().padStart(2, "0") + "/" + endDate.getFullYear();
    }
    else if (this.period === "lastmonth") {
      this.periodName = this.translateService.instant("LBL_LAST_MONTH");     
      var curr = new Date;
      var first = curr.getDate() - curr.getDay();
      var last = first - 30;
      var startDate = new Date(curr.setDate(first));
      this.firstday = "" + startDate.getDate().toString().padStart(2, "0") + "/" + (startDate.getMonth() + 1).toString().padStart(2, "0") + "/" + startDate.getFullYear();
      var endDate = new Date(curr.setDate(last));
      this.currentday = "" + endDate.getDate().toString().padStart(2, "0") + "/" + (endDate.getMonth() + 1).toString().padStart(2, "0") + "/" + endDate.getFullYear();
      
    }
    else if (this.period === "customDate") {
      
    }

  }

  triggerSearchFilter(event: any) {
    showFilteredRows('generateStatementInquirytable', event.target.value);
  }

  clear() {
    this.period = '';
    this.exportAs = '';
    this.periodName = "";
    // this.dataSource ;
    this.rowLength = this.dataSource.length;
    this.showStatementDetails = true;
    this.currentday=undefined
    this.firstday=undefined
    // this.periodError= false;
    // this.exportError= false;
    this.errorObj.fromDateErr = false;
    this.errorObj.toDateErr = false;
    this.errorObj.periodErr = false;
    this.errorObj.exportErr = false;
    this.clearFlag = true;
    this.rootScopeData.dataFromContextMenu ='';
    this.afterFromAccountSelection('iconClick');
    this.receiptForm = false;
    this.generateStatementForm = true;
    this.selectedPeriod = "";
    this.rootScopeData.generateAccountsSummaryObject ='';
    this.rootScopeData.checkGnerateStatementEdit = false;
    this.rootScopeData.changeHeading = '';
    this.fromDateValue = '';
    this.toDateValue = '';
  }

  fromValue(event: any) {
    var endDate = event;
    this.fromDateValue = event
    this.currentday = "" + endDate.getDate().toString().padStart(2, "0") + "/" + (endDate.getMonth() + 1).toString().padStart(2, "0") + "/" + endDate.getFullYear();
    this.errorObj.fromDateErr=false;
    this.toDateValue = '';
  }

  toValue(event: any) {
    if(this.fromDateValue){
      var startDate = event;
      this.toDateValue = event;
      this.firstday = "" + startDate.getDate().toString().padStart(2, "0") + "/" + (startDate.getMonth() + 1).toString().padStart(2, "0") + "/" + startDate.getFullYear();
      this.periodName = "From"+' '+ this.currentday + " To"  +' '+ this.firstday;
      this.errorObj.toDateErr=false;

    }
  }

  // finish(){
  //   this.generateStatementForm = true;
  //   this.receiptForm = false;
  //   this.clear();
  // }

  backToDashboard(){
    this.router.navigate(['/dashboard']);
   }

  //  fromValue(event: any) {
  //   //console.log(event)
  //   this.fromDateValue = event
  // }
  clearErr(field:any){
    if(field==='period'){
      this.errorObj.periodErr=false
    }else if(field==='export'){
      this.errorObj.exportErr=false
    }
  }

  getCloneAllStatementDetails() {
    this.isLoadingCompelete = false;
    this.accountService.getGenerateStatementInfo().subscribe((respData: any) => {
      this.isLoadingCompelete = true;
      this.dataSource = respData.DATA.ALL_RECORDS;
      // this.dataSource = this.chequeBookInfo;
      for (let i in this.dataSource) {         
        let crntAvail_amount = this.dataSource[i].CURR_AVAIL_BAL_AMT;
        let convtd_ccy = this.dataSource[i].OD_CCY_CODE;
        let convtd_amount ='';
        if(crntAvail_amount && convtd_ccy){
          let currencyFormatPipeFilter = new CurrencyFormatPipe();
           convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
           this.dataSource[i].CURR_AVAIL_BAL_AMT = convtd_amount;
           this.dataSource[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
        } 
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].OD_ACC_NO == this.rootScopeData.generateAccountsSummaryObject.OD_ACC_NO) {
            this.fromAccountDetails[0] = this.dataSource[i];
          }
          this.showStatementDetails = true;
          this.searchShownFlag = false;
        }              
      }  
      this.debitAccountDetailsObj = {
        "title": "LBL_FROM",
        "data": this.fromAccountDetails,
        "fieldDetails": [
          {
            "dispKey": "LBL_NICKNAME",
            "dataKey": "ALIAS_NAME"
          },
          {
            "dispKey": "LBL_ACC_NUMBER",
            "dataKey": "OD_ACC_NO"
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
    }, error => {
      this.isLoadingCompelete = true;
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
        { type: 'title', value:this.translateService.instant('LBL_GENERATE_STATEMENT_RECEIPT'), x:80, y:35},
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
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_STATEMENT_DETAILS'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_PERIOD'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_EXPORT_AS'), y:125},
        { type: 'text', value:this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : '', y:75},
        { type: 'text', value:this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : '', y:85},
        { type: 'text', value:this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : '', y:95},
        { type: 'text', value:this.periodName ? this.periodName : '', y:115},
        { type: 'text', value:this.exportAs ? this.exportAs : '', y:125},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:135},
        { type: 'text', value:this.refNo ? this.refNo : '', y:135},
        { type: 'heading', value:this.translateService.instant('LBL_GENERATE_STATEMENT_DOWNLOAD'), y:145}
      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'GenerateStatement.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'GenerateStatement.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
}



