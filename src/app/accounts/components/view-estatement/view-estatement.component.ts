import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/common-components/services/common.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';
import { AccountDetailsService } from '../../services/account-details.service';


@Component({
  selector: 'app-view-estatement',
  templateUrl: './view-estatement.component.html',
  styleUrls: ['./view-estatement.component.scss']
})
export class ViewEstatementComponent implements OnInit {
  displayedColumns: string[] = ['refNumber', 'date', 'month', 'year', 'download'];
  cifNumber: any;
  cifNumberError = false;
  tabledataSource: any = [];
  fromDateError = false;
  toDateError = false;
  tableSelected = false;
  dataSource: any;
  maxDate = new Date();
  minDate = new Date();
  fromDateValue: any;
  toDateValue: any;
  gcifNumber :any;
  unitId:any;
  isLoadingCompelete = true;
  debitAccountDetailsObj: any;
  showStatementDetails = false;
  fromAccountDetails: any = [];
  clearFlag=false;
  searchShownFlag = true;
  monthList: any = {
    '01': 'JAN',
    '02':'FEB',
    '03':'MAR',
    '04':'APR',
    '05':'MAY',
    '06':'JUN',
    '07':'JUL',
    '08':'AUG',
    '09':'SEP',
    '10':'OCT',
    '11':'NOV',
    '12':'DEC'
  };
  

  rootScopeData:RootScopeDeclare=RootScopeData
  showCancelBtn: boolean = false;
  constructor(private translateService: TranslateService,private accountService: AccountDetailsService,private datepipe:DatePipe,private  router: Router,private commonService:CommonService) { 
    this.rootScopeData.lhsActiveComp = 'viewEstatement';
    this.minDate.setMonth(this.minDate.getMonth() - 12);
  }

  ngOnInit(): void {
    if(this.rootScopeData.dataFromContextMenu)
    {
      let selectedData:any=[];
      Object.assign(this.rootScopeData.dataFromContextMenu,{"HIDDEN":this.translateService.instant('LBL_HIDDEN')})
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
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
              "dataKeySupport":"OD_CCY_CODE"
          }
        ]
      };
      this.showStatementDetails = true;
      this.fromAccountDetails[0] = this.rootScopeData.dataFromContextMenu;
      this.searchShownFlag = false;

    }
    else{
      this.vieweStatementCIfInfo();
    }
    
  }
  // cifNumberSelected(selectedcif:any) {
  //   this.gcifNumber = selectedcif.gcif;
  //   this.unitId = selectedcif.unitId;

  // }
  vieweStatementCIfInfo() {
    let flag="N";
    this.isLoadingCompelete = false;
    this.accountService.getAccountSummaryCall(flag).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      this.dataSource = res.DATA.ALL_RECORDS;

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

        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
          "data": this.dataSource,
          "fieldDetails":[
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
                "dispKey": "LBL_ACC_NUMBER",
                "dataKey": "OD_ACC_NO"
            },
            {
                "dispKey": "LBL_ACCOUNT_STATUS",
                "dataKey": "STATUS"
            },
            {
                "dispKey": "LBL_BALANCE",
                "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
              "dataKeySupport":"OD_CCY_CODE"
            }
          ]
      };
    }, error => {
      this.isLoadingCompelete = true;
     })
  }


  submit() {
    this.cifNumberError = this.cifNumber ? false : true;
    // this.fromDateError = this.fromDateValue ? false : true;
    // this.toDateError = this.toDateValue ? false : true;
    //EDIT
    let cifnumber = this.fromAccountDetails[0].COD_CORECIF;
    let unitId = this.fromAccountDetails[0].UNIT_ID;
    let accNum = this.fromAccountDetails[0].OD_ACC_NO;
    let formData = {"accNum": accNum, "cifnumber": cifnumber,"fromdate" : "", "todate" : "", "unitId": unitId };
    // if (!this.cifNumberError && !this.fromDateError && !this.toDateError)
    this.isLoadingCompelete = false;
      this.accountService.geteStatementTableInfo(formData).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        this.tabledataSource = res.data;
        this.showStatementDetails = false;
        this.showCancelBtn = true;
        this.tableSelected = true;
      }, error => {
        this.isLoadingCompelete = true;
       })
  }
  fromDate(event: any) {
    this.fromDateValue = event
  }
  toDate(event: any) {
    this.toDateValue = event
  }

  clear(){
    // window.location.reload();
    this.tableSelected = false;
    this.cifNumber ='';
    this.fromDateValue ='';
    this.toDateValue ='';
    this.clearFlag = true;
    this.showCancelBtn = false;
    this.showStatementDetails = false;

    
  }

  download_Click(selectedrow:any){
    this.isLoadingCompelete = false;
    let moduleId = "GETINVOICE";
    let exportType = "PDF";
    let lang_ID = "en_US";
    let viewStatement = "viewEStatement";
    let invoice_no = selectedrow.res_InvoiceNumber;
    let invoiceDate = selectedrow.res_InvoiceDate;
    let accNum = this.fromAccountDetails[0].OD_ACC_NO;
    let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType +'&langId=' + lang_ID +'&statement='+viewStatement+ '&statementDate='+invoiceDate+ '&accountNum='+accNum;
    if(invoice_no) {
      url += '&refNo='+invoice_no
    }
    let params = {
      "moduleId": moduleId,
      "exportType": exportType,
      "statement":viewStatement,
      "statementDate":invoiceDate,
      "accountNum":accNum,
      "refNo":undefined
     }
    if(invoice_no){
      params.refNo=invoice_no
    }
    this.commonService.viewEStmtDownloadDocument(params).subscribe((response:any)=>{
      this.isLoadingCompelete = true;
      const src = 'data:application/'+exportType+';base64,'+ response.fileContent; // contentType of File pdf/csv/xls
      const link = document.createElement("a")
      link.href = src
      link.download = response.fileName; //Dynamic FileName 
      link.click();
      link.remove();
    },error=>{
      if (error.status == 200) {
        this.isLoadingCompelete = true;
      } else {
        this.isLoadingCompelete = true;
      }
    })

    // this.accountService.downloadApi(url).subscribe(
    //   response => {
    //     if (response.status === 200) {
    //       this.isLoadingCompelete = true;
    //      window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
    //     } else {
    //       this.isLoadingCompelete = true;
    //     }
    //   }, error => {
    //     if (error.status === 200) {
    //       this.isLoadingCompelete = true;
    //       window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
    //     } else {
    //       this.isLoadingCompelete = true;
    //     }
    //   }
    // )

  }


  afterFromAccountSelection(fromAccount: any) {
    if (fromAccount === 'iconClick') {
      this.showStatementDetails = false;
    } else {
      this.showStatementDetails = true;
      this.clearFlag=false;
      this.fromAccountDetails[0] = fromAccount;
    }
  }

  backToDashboard(){
    this.router.navigate(['/dashboard']);
   }
}
