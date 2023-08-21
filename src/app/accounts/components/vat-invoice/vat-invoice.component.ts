import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-vat-invoice',
  templateUrl: './vat-invoice.component.html',
  styleUrls: ['./vat-invoice.component.scss']
})
export class VatInvoiceComponent implements OnInit {
  review : boolean = false;
  showReceipt : boolean = false;
  searchShownFlag : boolean = false;
  clearFlag : boolean = false;
  debitAccountDetailsObj : any;
  fromAccData: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromAccountDetails: any = [];
  isLoadingCompelete : boolean = true;
  vatInvoiceInfo: any;
  dataSource: any;
  invoiceDetails : boolean = false;
  categories : any;
  types : any;
  scoopes : any;
  points : any;
  levels : any;
  errObj ={
    catErr : '',
    typeErr : '',
    scoopErr : '',
    pointErr : '',
    lvlErr : '',
    dateErr:'',
  };
  invoiceObj={
    category : '',
    type : '',
    scoop : '',
    point : '',
    lvl : '',
    fmtFrmDate:'',
    frmtToDate:'',
  }
  maxDate = new Date();
  minDate :any;
  frmDateErr : boolean = false;
  toDateErr : boolean = false;
  dateFlag : any;
  fromDate:any;
  toDate:any;
  receiptData:any;
  constructor( private location: Location,private translateService: TranslateService,private accountService: AccountDetailsService, private router: Router, private datePipe: DatePipe) {
    if (this.rootScopeData.dataFromContextMenu) {
      this.rootScopeData.changeHeading = "Review";
      let selectedData: any = [];
      Object.assign(this.rootScopeData.dataFromContextMenu,{"HIDDEN":this.translateService.instant('LBL_HIDDEN')})
      selectedData.push(this.rootScopeData.dataFromContextMenu);
      this.debitAccountDetailsObj = {
        "title": "LBL_FROM",
        "data": selectedData,
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
            "dispKey": "LBL_STATUS",
            "dataKey": "STATUS"
          },
          {
            "dispKey": "LBL_BALANCE",
            "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
            "dataKeySupport": "OD_CCY_CODE"
          }
        ]
      };
      this.fromAccountDetails[0] = this.rootScopeData.dataFromContextMenu;
      this.fromAccData = this.fromAccountDetails[0];
      
      this.getFields();
      this.searchShownFlag = false;   
    }
    else {
      this.getDebitInfo();
    }
   }

  ngOnInit(): void {
    this.isLoadingCompelete = true;
    
  }
  afterFromAccountSelection(fromAccount: any) {
    this.fromAccData = fromAccount;
    if (fromAccount === 'iconClick') {
      if(this.rootScopeData.accountsSummaryObject){
        this.invoiceDetails = false
        this.debitAccountDetailsObj ='';
        this.getDebitInfo();
      }    
    } else {
      this.rootScopeData.changeHeading = "Review";
      this.fromAccountDetails[0] = fromAccount;
      this.getFields();
      
    }
  }
   getDebitInfo() {
    this.isLoadingCompelete = false;
    this.accountService.getChequeBookRequest().subscribe((chequeBookData: any) => {
      if (chequeBookData) {
        this.isLoadingCompelete = true;
        this.vatInvoiceInfo = chequeBookData.DATA.ALL_RECORDS;
        this.dataSource = this.vatInvoiceInfo;

        for (let i in this.dataSource) {
          let crntAvail_amount = this.dataSource[i].CURR_AVAIL_BAL_AMOUNT_NEW;
          let convtd_ccy = this.dataSource[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.dataSource[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            this.dataSource[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
          "data": this.vatInvoiceInfo,
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
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
      }

    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  getFields(){
    this.isLoadingCompelete=false;
    let param;
    
    this.accountService.getInvoiceData(param).subscribe((res:any)=>{
      // debugger
      if(res && res.data){
        this.isLoadingCompelete = true;
        this.categories=res.data.CATEGORY;
        this.types=res.data.TYPE;
        this.scoopes=res.data.SCOOP;
        this.points=res.data.POINT;
        this.levels=res.data.LEVEL;
        this.invoiceDetails=true
      }
      else{
        this.isLoadingCompelete=true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    },err=>{
        this.isLoadingCompelete=true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  validate(event:any,field:any){
    if(field === 'ctg'){
      this.errObj.catErr = '';
    }else if(field === 'typ'){
      this.errObj.typeErr = '';
    }else if(field === 'scp'){
      this.errObj.scoopErr = '';
    }else if(field === 'pnt'){
      this.errObj.pointErr = '';
    }else if(field === 'lvl'){
      this.errObj.lvlErr = '';
    }
  }
  getDate(event:any,field:any){
    // debugger;
    if(field === 'frm'){
      this.errObj.dateErr=''
      if(!(this.toDate && this.toDate.getTime()<=event.getTime())){
        this.dateFlag = false;
        
        if(this.toDate){
          this.errObj.dateErr = (this.toDate.getFullYear() - event.getFullYear()) <2 ? "LBL_DATE_PRD_ERR":""
        }
      }else{
        this.dateFlag = true;
      }
      this.fromDate = event;
      this.invoiceObj.fmtFrmDate=this.datePipe.transform(event,this.rootScopeData.userInfo.mDateFormat)+""
    }else{
      this.toDate=event
      this.invoiceObj.frmtToDate=this.datePipe.transform(event,this.rootScopeData.userInfo.mDateFormat)+"";
      if(this.fromDate){
        if((event.getFullYear() - this.fromDate.getFullYear())>=2){
          this.errObj.dateErr=''
        }else{
          this.errObj.dateErr='LBL_DATE_PRD_ERR'
        }
      }
    }
  }
  onClickCancel(){
    this.errObj ={
      catErr : '',
      typeErr : '',
      scoopErr : '',
      pointErr : '',
      lvlErr : '',
      dateErr:'',
    };
    this.invoiceObj={
      category : '',
      type : '',
      scoop : '',
      point : '',
      lvl : '',
      fmtFrmDate:'',
      frmtToDate:'',
    }
    this.invoiceDetails= false;
    this.location.back();
  }
  submit(){
    this.errObj.catErr = !this.invoiceObj.category ? "LBL_CAT_ERR" : '';
    this.errObj.typeErr = !this.invoiceObj.type ? "LBL_TYPE_ERR" : '';
    this.errObj.scoopErr = !this.invoiceObj.scoop ? "LBL_SCOOP_ERR" : '';
    this.errObj.pointErr = !this.invoiceObj.point ? "LBL_POINT_ERR" : '';
    this.errObj.lvlErr = !this.invoiceObj.lvl ? "LBL_LEVEL_ERR" : '';
    this.frmDateErr = !this.invoiceObj.fmtFrmDate ? true : false;
    this.toDateErr = !this.invoiceObj.frmtToDate ? true : false;
    let param;
    // this.errObj.dateErr = this.toDate && this.fromDate && (this.toDate.getFullYear() - this.fromDate.getFullYear()) <2 ? "LBL_DATE_PRD_ERR":""
    if(!this.errObj.catErr && !this.errObj.typeErr && !this.errObj.scoopErr && !this.errObj.pointErr && !this.errObj.lvlErr && !this.frmDateErr && !this.toDateErr &&! this.errObj.dateErr){
      this.isLoadingCompelete=false;
      this.accountService.submitInvoiceApi(param).subscribe((response:any)=>{
        this.isLoadingCompelete = true;    
        if(response){
            this.rootScopeData.changeHeading = "";
            let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.constructReceiptData(refNo);
            this.showReceipt= true;
          
        }else{
          this.isLoadingCompelete = true;    
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      })
    }
  }
  constructReceiptData(refNumber: any){
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0],{USER_ID:userId})
    this.receiptData = {
      "msg1": "LBL_REQ_SUCCESSFUL",
      "msg2": "LBL_VAT_INVOICE_DOWNLOAD_MSG",
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
          "title": "LBL_VAT_INVOICE_DETAIL",
          "isTable": "false",
          "data": this.invoiceObj,
          "fieldDetails": [
            {
              "dispKey": "LBL_CATEGORY",
              "dataKey": this.invoiceObj.category
            },
            {
              "dispKey": "LBL_DEPO_TYPE",
              "dataKey": this.invoiceObj.type
            },
            {
              "dispKey": "LBL_SCOOP",
              "dataKey": this.invoiceObj.scoop
            },
            {
              "dispKey": "LBL_POINT",
              "dataKey": this.invoiceObj.point
            },
            {
              "dispKey": "LBL_LEVEL",
              "dataKey": this.invoiceObj.lvl
            },
            {
              "dispKey": "LBL_DATE_RNG",
              "dataKey": this.invoiceObj.fmtFrmDate + " - "+this.invoiceObj.frmtToDate
            },
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
      "finishButton": {
        "buttonLabel": "LBL_DOWNLOAD",
        "buttonPath": "/accounts/service-request/downloadcenter"
      }
    };
  }
  downloadPdf(){

  }
}
