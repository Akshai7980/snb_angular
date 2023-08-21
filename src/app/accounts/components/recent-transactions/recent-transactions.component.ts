import { Component, OnInit, ViewChild } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, MatSortable } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common'
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { dateFormateChanger } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { NavigationExtras, Router } from '@angular/router';
import { Amirifont } from 'src/app/utility/fontConversion';

export interface PeriodicElement {
  position: number;
  children?: any[];

}

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class RecentTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['res_Txn_Dt', 'res_beneName','res_Description', 'res_DebitCreditAmt', 'res_Running_Bal','res_TxnType', 'Action'];
  displayedColumnsWithExpand = ['expand', 'res_Txn_Dt','res_Description', 'res_DebitCreditAmt', 'hide_res_Credit_Amt', 'res_Running_Bal','hide_res_Running_Bal','res_TxnType', 'Action'];
  @ViewChild(MatSort) sort !: MatSort;

  contextMenuList: any = [];
  contextMenuListPdf: any = [];
  contextMenuListPdfDownload : any =[];
  dataSource: any = [];
  dataSourceToPassValue!: MatTableDataSource<any>;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  currentAct: any;
  isExpand = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  accNumber: any;
  isLoadingCompelete = true;
  enableProperty: boolean = true;
  norecordflag: boolean = false;
  advSearchPeriod = "";
  advSearchSearchWithin = "";
  advSearchSortOrder = "";
  advSearchFromDate :any;
  advSearchToDate :any;
  advSearchFromAmount :any;
  advSearchToAmount :any;
  noRecordFoundInfoObj: any;
  advSearchTransactType:any;
  mtFlag = true;
  beneName:string='';
  
  expandedRows: { [key: number]: boolean } = {};
  fromdate: any;
  todate: any;
  isShownCustomDates: boolean = true;
  isExpanded: boolean = false;
  expandedElement: any;
  cifNumber: any;
  unitId: any;
  portalAccNumber:any;
  formatedDate :any;
  pdfData:any;
  setDownload = true;
  dataSourceLength: any;
  totalRecords: any;
  fromRow: any;
  toRow: any;
  isRefreshFlag: boolean = false;
  tablePageSize: any;
  recordId: any;
  resFlagExport: any;
    expand(dataSourceToPass: PeriodicElement) {
    this.expandedRows[dataSourceToPass.position] = !this.expandedRows[dataSourceToPass.position]
  }

  onClickDownArrow() {
    this.isExpanded = true;
  }

  constructor(private translateService:TranslateService,public accService: AccountDetailsService,public datepipe: DatePipe,
    private router : Router) {
    this.rootScopeData.activeTabName = 'recenttransaction';  
    this.rootScopeData.advSearchCurrentPage = 'accDetailsRecentTransactions'
    this.tablePageSize = pageOptions;
    // this.fromRow = "1";
    // this.toRow = "11";
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.recordId = "";
   }

  ngOnInit(): void {
    this.accNumber = this.rootScopeData.accountsSummaryObject.OD_ACC_NO;
    this.portalAccNumber = this.rootScopeData.accountsSummaryObject.OD_PORTAL_ACC_NO;
    this.cifNumber = this.rootScopeData.accountsSummaryObject.COD_CORECIF;
    this.unitId = this.rootScopeData.accountsSummaryObject.UNIT_ID;

      this.contextMenuListPdf = [
      { "display_key": "LBL_SWIFT_GPI_TRACKER", "value": "SwiftGPI", "item_id":"SWIFTGPI_ACCOUNTS_SUMMARY" },
      { "display_key": "LBL_DOWNLOAD", "value": "Download" },
      { "display_key": "LBL_VIEW_MT103", "value": "MT103"},
    ];
      this.contextMenuListPdfDownload = [
      { "display_key": "LBL_DOWNLOAD", "value": "Download" },
    ];
    this.noRecordFoundInfoObj = {
      "msg": "LBL_RECENT_TRANSACTIONS",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getAccountDetailsInfo();
    this.contextMenuList = [
      { "displayName": "LBL_DOWNLOAD_ADVICE", "value": "DownloadAdvice" },
    ];
    // this.contextMenuListPdf = [
    //   { "display_key": "LBL_DOWNLOAD", "value": "Download" },
    // ];
  }
  ngAfterViewInit() {

  }
  triggerSearchFilter(event: any): void {
    let columnsToSearch = [ 
      {"name":"res_Txn_Dt", "fieldType":"string"},
      {"name":"res_Description", "fieldType":"string"}, 
      {"name":"res_DebitCreditAmt", "fieldType":"amount1"},
      {"name":"res_Debit_Amt", "fieldType":"amount1"},
      {"name":"res_Running_Bal", "fieldType":"amount2"},
      {"name":"res_TxnType", "fieldType":"string"},
      {"name":"res_Txn_CCY", "fieldType":"ccy1"},
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPassValue= new MatTableDataSource(tableData);
    // showFilteredRows('casaDetailsDefault', event.target.value);
  }

  actionOnMenuClick(event:any ,value :any) {
    let txnrefno = value.res_Txn_Ref_No;
    let txnleg = value.res_Txn_Leg;
    const swifturl = `${environment.restDownloadAPI}` + '?moduleId=EXPORTADVICE&exportFormat=TRANSPDF&uniqLegNo=' + txnleg + '&accountNumber=' + this.accNumber + '&unitId=' + this.unitId + '&cifNo=' + this.cifNumber + '&reqCountryCode=AE&adviseType=SWIFT&uniqTxnRef=' + txnrefno + '&simulate=Y';
    // console.log(swifturl);
    window.open(swifturl, '_self');
  }


  selectedRow(value: any) {
    let data = value
    this.isExpand = !this.isExpand;
    if (this.currentAct === data) {
      this.currentAct = "";
    }
    else {
      this.currentAct = value;
    }

  }

  getAccountDetailsInfo() {
    this.isLoadingCompelete = false;
    let params={
      period:this.advSearchPeriod,
      searchWithin:this.advSearchSearchWithin,
      fromDate : this.advSearchFromDate,
      toDate : this.advSearchToDate,
      fromAmount : this.advSearchFromAmount,
      toAmount : this.advSearchToAmount,
      fromRow:this.fromRow,
      toRow:this.toRow,
      recordId: this.recordId,
      transacttype: this.advSearchTransactType
    }
    this.accService.getAccDetails(this.accNumber,params).subscribe(
      (response: any) => {
        this.isLoadingCompelete = true;
        // this.previousRecordId = this.nextRecordID;
        
        if(response.DATA && response.DATA.ALL_RECORDS.length >= 1){
          let nextIDLength = (response.DATA.ALL_RECORDS.length) - 1
          this.recordId = response.DATA.ALL_RECORDS[nextIDLength].recordId;
          // this.dataSource = response.DATA.ALL_RECORDS;
          // this.dataSourceToPassValue = new MatTableDataSource(this.dataSource);
        }
        if(response.DATA && (response.DATA === null || response.DATA === undefined || response.DATA === "" || response.DATA.length===0 ||response.DATA.ALL_RECORDS.length === 0)){
          this.dataSource =[];
          this.norecordflag = true;
          this.setDownload=false
        }else{
          
          // if(!this.advSearchSortOrder){
            this.setDownload=true
            let dateArray
            for(let i = 0; response.DATA.ALL_RECORDS.length > i; i++) {
              if((response.DATA.ALL_RECORDS[i].res_Txn_Dt).includes("/")){
                dateArray= (response.DATA.ALL_RECORDS[i].res_Txn_Dt).split("/")
              }else{
                dateArray= (response.DATA.ALL_RECORDS[i].res_Txn_Dt).split("-")
              }
              let day=Number(dateArray[0])
              let month=Number(dateArray[1])
              let year=Number(dateArray[2])
              let date= (day>9?day :"0"+day)+"/"+(month>9?month:"0"+month)+"/"+(year)
              response.DATA.ALL_RECORDS[i].res_Txn_Dt = dateFormateChanger(date)
              
            }
            // this.dataSource = response.DATA.ALL_RECORDS;
            if(this.isRefreshFlag === false){
              this.dataSource = this.dataSource.concat(response.DATA.ALL_RECORDS);
            }else{
              this.dataSource = response.DATA.ALL_RECORDS;
              this.isRefreshFlag = false;
            }
          if(this.advSearchSortOrder){
            if(this.advSearchSortOrder === "ascending"){
              let ascendingSortedArray = this.dataSource.sort((a:any, b:any) => (a.res_Txn_Dt.getTime() < b.res_Txn_Dt.getTime() ? -1 : 1));
              this.dataSource = ascendingSortedArray;
            }else if(this.advSearchSortOrder === "descending"){
              let descendingSortedArray = this.dataSource.sort((a:any, b:any) => (a.res_Txn_Dt.getTime() > b.res_Txn_Dt.getTime() ? -1 : 1));
              this.dataSource = descendingSortedArray;
            }
          }
            this.enableProperty = true;
            this.norecordflag = false;
            this.dataSourceLength = this.dataSource.length;
            if(!this.advSearchSortOrder){
              let descendingSortedArray = this.dataSource.sort((a:any, b:any) => (a.res_Txn_Dt.getTime() > b.res_Txn_Dt.getTime() ? -1 : 1));
              this.dataSource = descendingSortedArray;
            }
            
            this.dataSourceToPassValue = new MatTableDataSource(this.dataSource);
            this.dataSourceToPassValue.sort = this.sort;
            this.dataSourceToPassValue.sortingDataAccessor= (item:any, property:any) => {
              switch (property) {
                case 'res_DebitCreditAmt': {
                  return Number(item[property]);
                }
                case 'res_Running_Bal':{
                  return Number(item[property]);
                }
                
                default: {
                  return item[property];
                }
              };
            }
            this.totalRecords = response.DATA.TOTAL_COUNT;
            if(response.DATA.TOTAL_COUNT > 5000){
              this.rootScopeData.validationErrorToast = true;
              this.rootScopeData.validationToastMessage = "LBL_GEN_OFFLINE_ERR";
            }
            this.dataSourceToPassValue.paginator = this.commonPagination.paginator;
            
        }
        if(response.status === 500){
          this.enableProperty = false;
          this.norecordflag = true;
          this.setDownload=false
        }
        if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined) {
          this.enableProperty = false;
          this.norecordflag = true;
          this.setDownload=false
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.enableProperty = false;
        this.norecordflag = true;
        this.setDownload=false
      }
    )
  }

  getNarrationAPICall(data:any){
    let params={
      accNumber : this.rootScopeData.accDetailsObject.res_Acc_No,
      recordId : data.recordId
    }
    this.isLoadingCompelete = false;
    this.accService.getNarrationAPI(params).subscribe(
      (response: any) => {
        this.isLoadingCompelete = true;
        Object.assign(data,{NARRATION:response.DATA.res_description})
       
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      
      }
    )

  }

  refreshSummary() {
    this.fromRow = "1";
    this.toRow = undefined;
    this.recordId = "";
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5; //set pagination selected size to 5
    this.totalRecords = this.totalRecords; // set length value again while refresh
    this.commonPagination.paginator.firstPage(); //set pagination to go to first page
    // this.refreshClickedFlag = true;
    // this.dataSource=''
    this.getAccountDetailsInfo();
  }

  advancedSearchApply(event:any){
    this.recordId = "";
    this.advSearchPeriod = '';
    this.advSearchSearchWithin= '';
    this.advSearchFromDate = '';
    this.advSearchToDate = '';
      this.advSearchPeriod = event.period;
      this.advSearchFromDate = event.fromDate;
      this.advSearchToDate = event.toDate;  
      // if(latest_fromdate) {   
      // let splitedFromDate = latest_fromdate.split("",10);
      // let fromoMMDDYYYYFormat = splitedFromDate[3]+ +splitedFromDate[4] +"/"+splitedFromDate[0]+ +splitedFromDate[1] +"/"+ splitedFromDate[6]+ +splitedFromDate[7] +splitedFromDate[8]+ +splitedFromDate[9]; 
      // this.advSearchFromDate =this.datepipe.transform(fromoMMDDYYYYFormat, 'dd-MM-yyyy');
      // }

      // let latest_toDate = event.toDate;
      // if(latest_toDate) {
      // let splitedDate = latest_toDate.split("",10);
      // let toMMDDYYYYFormat = splitedDate[3]+ +splitedDate[4] +"/"+splitedDate[0]+ +splitedDate[1] +"/"+ splitedDate[6]+ +splitedDate[7] +splitedDate[8]+ +splitedDate[9]; 
      // this.advSearchToDate =this.datepipe.transform(toMMDDYYYYFormat, 'dd-MM-yyyy');
      // }
      this.advSearchSearchWithin = event.searchwithin;
      this.advSearchTransactType = event.transactionType;
      this.advSearchSortOrder = event.sortOrder;
      this.advSearchFromAmount = event.fromAmt;
      this.advSearchToAmount = event.toAmnt;
      this.isRefreshFlag = true;
      this.fromRow = "1";
      this.toRow = undefined;
      this.dataSource=[];
      // this.mtFlag=false;
      this.getAccountDetailsInfo();
  }
  
  getNarrationAPIForPdfCall(data:any, value : any){
	// console.log(data);
  // console.log(this.rootScopeData.accDetailsObject.res_Acc_No);
    if(value == 'Download'){
      this.pdfData=data;
      let params={
        accNumber : this.rootScopeData.accDetailsObject.res_Acc_No,
        recordId : data.recordId
      }
      this.isLoadingCompelete = false;
      this.accService.getNarrationAPI(params).subscribe(
        (response: any) => {
          this.isLoadingCompelete = true;
          Object.assign(this.pdfData,{NARRATION:response.DATA.res_description})
          this.openPDF(this.pdfData)
        },
        (error: any) => {
          this.isLoadingCompelete = true; 
        }
      )
    }else if(value == 'MT103'){
      let params={
          reqType: 'MT103',
          accNo: this.accNumber,
          productCode: 'CORESVS',
          subProdCode: 'CASASVS',
          accId : this.accNumber,
          journalId: data.res_Txn_Ref_No,
          valDate: data.res_Val_Dt,
          functionCode : 'VSBLTY',
          userNo : this.rootScopeData && this.rootScopeData.userInfo && this.rootScopeData.userInfo.userNo ? this.rootScopeData.userInfo.userNo : "",
          gcif : this.rootScopeData && this.rootScopeData.userInfo && this.rootScopeData.userInfo.sCustNo ? this.rootScopeData.userInfo.sCustNo : "" ,
          fileType : '',
          action : 'downloadMT103'
        }
      this.isLoadingCompelete = false;
      this.accService.downloadMT103(params).subscribe(
        (response: any) => { 
          this.isLoadingCompelete = true;
          if(response && response.data && response.data.errorCode == '200'){
            if(response.data.fileContent){
              const navigationExtras : NavigationExtras = {
                state: {
                  file : response.data.fileContent
                }
              }
              this.router.navigate(['/accounts/viewMT103'], navigationExtras);
            } 
          }else{
            this.rootScopeData.showSystemError = true;
            // this.rootScopeData.toastMessage = response.data.fileContent;
            this.rootScopeData.toastMessage = "LBL_NO_TRANSACTION_PERIOD";
          }
               
         
        },
        (error: any) => {
          this.isLoadingCompelete = true;
        }
      )


    }
    else if(value == 'SwiftGPI'){
      this.rootScopeData.accDetailsObject.res_Val_Dt = data.res_Val_Dt;
      this.rootScopeData.accDetailsObject.res_Txn_Ref_No = data.res_Txn_Ref_No;

    }
  }

  openPDF(data:any): void {
    // var Arslanfont1 = Arslanfont;
    Object.assign(data,{branchName:this.rootScopeData.accountsSummaryObject.BRANCH_NAME});
    Object.assign(data,{accountName:this.rootScopeData.accDetailsObject.res_Account_Name});
    Object.assign(data,{accountType:this.rootScopeData.accountsSummaryObject.OD_ACC_TYPE_2});
     if(data){
       let amount;
       let formattedAmount;
       this.resFlagExport = data.res_Flag;
       if(data.res_Flag == 'CR'){
          amount = data.res_Credit_Amt;
       }else if(data.res_Flag == 'DR'){
        amount = data.res_Debit_Amt;
       }
       Object.assign(data,{amount:amount});

       if(data.res_Txn_CCY){
         let currencyPipe=new CurrencyFormatPipe();
         formattedAmount=currencyPipe.transform(data.amount,data.res_Txn_CCY);
       } 

       let datePipe=new DateFormatPipe();
       let txnDate =this.datepipe.transform(data.res_Txn_Dt, 'dd-MM-yyyy');
       Object.assign(data,{txnDate:txnDate});
       let processDate =this.datepipe.transform(data.res_Txn_Dt, 'dd-MM-yyyy');
       Object.assign(data,{processDate:processDate});

      // let PDF = new jsPDF('p', 'mm', 'a4');
      // const pdfWidth = PDF.internal.pageSize.getWidth();
      // //const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      // let img = new Image()
      // img.src = "assets/images/snb-logo-print.png";
      // PDF.addImage(img, 'png', 90, 3, 30, 20);

      // PDF.setFontSize(15);
      // // PDF.setFont("helvetica", "bold");
      // PDF.addFileToVFS(
      //   "(A) Arslan Wessam A (A) Arslan Wessam A-normal.ttf",
      //   Arslanfont
      // );
      // PDF.addFont(
      //   "(A) Arslan Wessam A (A) Arslan Wessam A-normal.ttf",
      //   "(A) Arslan Wessam A (A) Arslan Wessam A",
      //   "normal"
      // );
      // PDF.setFont("(A) Arslan Wessam A (A) Arslan Wessam A");
      // PDF.text("Account Transaction Details Receipt", 70, 35);

      // PDF.rect(10, 38, 190, 160);
      // PDF.rect(15, 60, 180, 130);

      // PDF.setFontSize(14);
      // // PDF.setFont("helvetica", "bold");
      // PDF.setFont("(A) Arslan Wessam A (A) Arslan Wessam A");
      // //PDF.text("Outgoing internal transfer", (pdfWidth/2 - 25), 45);

      // PDF.setDrawColor(128);
      // PDF.setFillColor(128, 128, 128);
      // PDF.rect(15, 51, 90, 6, "F");

      // PDF.setFontSize(14);
      // PDF.setTextColor(255,255,255);
      // // PDF.setFont("helvetica", "bold");
      // PDF.setFont("(A) Arslan Wessam A (A) Arslan Wessam A");
      // PDF.text("Transaction Details", (pdfWidth/2 - 85), 55);

      // //if(this.rootScopeData.userInfo.mLanguage == 'en_US'){
      // if(true){  
      //   PDF.setFontSize(13);
      //   PDF.setTextColor(0,0,0);
      //   // PDF.setFont("helvetica", "normal");
      //   PDF.addFileToVFS(
      //     "(A) Arslan Wessam A (A) Arslan Wessam A-normal.ttf",
      //     Arslanfont
      //   );
      //   PDF.addFont(
      //     "(A) Arslan Wessam A (A) Arslan Wessam A-normal.ttf",
      //     "(A) Arslan Wessam A (A) Arslan Wessam A",
      //     "normal"
      //   );
      //   PDF.setFont("(A) Arslan Wessam A (A) Arslan Wessam A");
      //   let accNo = this.translateService.instant('LBL_ACC_NUMBER');
      //   PDF.text(accNo, (pdfWidth/2 - 85), 65);
      //   PDF.text(this.translateService.instant('LBL_IBAN_VALUE'), (pdfWidth/2 - 85), 75);
      //   // PDF.text(this.translateService.instant('LBL_DATE'), (pdfWidth/2 - 85), 85);
      //   PDF.text(this.translateService.instant('LBL_DESCRIPTION'), (pdfWidth/2 - 85), 85);
      //   PDF.text(this.translateService.instant('LBL_AMOUNT'), (pdfWidth/2 - 85), 105);
      //   // PDF.text(this.translateService.instant('LBL_PROCESS_DATE'), (pdfWidth/2 - 85), 115);
      //   PDF.text(this.translateService.instant('LBL_BRANCH'), (pdfWidth/2 - 85), 115);
      //   PDF.text(this.translateService.instant('LBL_ACCOUNT_NAME'), (pdfWidth/2 - 85), 125);
      //   PDF.text(this.translateService.instant('LBL_ACCOUNT_TYPE'), (pdfWidth/2 - 85), 135);
      //   PDF.text(this.translateService.instant('LBL_TRAN_DESC'), (pdfWidth/2 - 85), 145);
      //   PDF.text(this.translateService.instant('LBL_BENEFICIARY_NAME'), (pdfWidth/2 - 85), 165);
      // }else{
      //   PDF.setFontSize(9);
      //   PDF.setTextColor(0,0,0);
      //   //PDF.addFont("assets/fonts/Amiri-Regular.ttf", 'Amiri', 'sans-serif');
      //   PDF.addFont('assets/fonts/Amiri-Regular.ttf', 'Amiri', 'normal');
      //   PDF.setFont('Amiri'); 
      //   let accNo = this.translateService.instant('LBL_ACC_NUMBER');
      //   PDF.text(accNo, (pdfWidth/2 - 85), 65);
      //   PDF.text(this.translateService.instant('LBL_IBAN_VALUE'), (pdfWidth/2 - 85), 75);
      //   PDF.text(this.translateService.instant('LBL_DATE'), (pdfWidth/2 - 85), 85);
      //   PDF.text(this.translateService.instant('LBL_DESCRIPTION'), (pdfWidth/2 - 85), 95);
      //   PDF.text(this.translateService.instant('LBL_AMOUNT'), (pdfWidth/2 - 85), 105);
      //   PDF.text(this.translateService.instant('LBL_PROCESS_DATE'), (pdfWidth/2 - 85), 115);
      //   PDF.text(this.translateService.instant('LBL_BRANCH'), (pdfWidth/2 - 85), 125);
      //   PDF.text(this.translateService.instant('LBL_ACCOUNT_NAME'), (pdfWidth/2 - 85), 135);
      //   PDF.text(this.translateService.instant('LBL_ACCOUNT_TYPE'), (pdfWidth/2 - 85), 145);
      //   PDF.text(this.translateService.instant('LBL_TRAN_DESC'), (pdfWidth/2 - 85), 155);
      //   PDF.text(this.translateService.instant('LBL_BENEFICIARY_NAME'), (pdfWidth/2 - 85), 165);
      // }
      // PDF.text(this.accNumber ? this.accNumber : '', (pdfWidth/2 - 33), 65);
      // PDF.text(this.rootScopeData &&  this.rootScopeData.accDetailsObject && this.rootScopeData.accDetailsObject.res_IBAN_VALUE ? this.rootScopeData.accDetailsObject.res_IBAN_VALUE : '', (pdfWidth/2 - 33), 75);
      // // PDF.text(txnDate ? txnDate : '', (pdfWidth/2 - 33), 85);
      // PDF.text(data.NARRATION ? data.NARRATION : '', (pdfWidth/2 - 33), 85, { maxWidth: 75 });
      // PDF.text(formattedAmount ? formattedAmount : '', (pdfWidth/2 - 33), 105);
      // // PDF.text(processDate ? processDate : '', (pdfWidth/2 - 33), 115);
      // PDF.text(data.res_branch ? data.res_branch : '', (pdfWidth/2 - 33), 115);
      // PDF.text(data.accountName ? data.accountName : '', (pdfWidth/2 - 33), 125);
      // PDF.text(data.accountType ? data.accountType : '', (pdfWidth/2 - 33), 135);
      // PDF.text(data.NARRATION ? data.NARRATION : '', (pdfWidth/2 - 33), 145, { maxWidth: 75});
      // PDF.text(data.res_beneName ? data.res_beneName : '', (pdfWidth/2 - 33), 165);

      // //PDF.table(15, 50, this.data, this.headers, {autoSize: true, margins:0});
      // PDF.setFontSize(6);
      // PDF.setTextColor(63, 153, 124);
      // PDF.text("The Saudi National Bank | A Saudi Joint Stock Company | Paid-up Capital SAR 44,780,000,000 | VAT Number 300002471110003 | C.R. 4030001588", 30,220);
      // PDF.text("Under the supervision and control of The Saudi Central Bank | Licensed pursuant to Royal Decree No. 3737 issued on 20/4/1373H (corresponding to 26/12/1953G",23,227)
      // PDF.text("Head Office The Saudi National Bank Tower King Abdullah Financial District | King Fahd Road | 3208 - Al Aqeeq District | Unit No. 778 | Riyadh 13519 – 6676 | 920001000 | www.alahli.com | Any reference ",10,234)
      // PDF.text("to the National Commercial Bank, NCB or the Bank shall mean the Saudi National Bank",60,237)
      // PDF.save('RecentTransaction.pdf');
     
      let params = {
        "accountNo":this.accNumber ? this.accNumber : '',
        "ibanNo" : this.rootScopeData &&  this.rootScopeData.accDetailsObject && this.rootScopeData.accDetailsObject.res_IBAN_VALUE ? this.rootScopeData.accDetailsObject.res_IBAN_VALUE : '',
        "description" : data.res_Description ? data.res_Description +" , "+data.res_ExtraDesc : '',
        "amount" : formattedAmount ? formattedAmount : '',
        "currency" : data.res_Txn_CCY ? data.res_Txn_CCY : '',
        "branch" : data.res_branch ? data.res_branch : '',
        "accountName" : data.accountName ? data.accountName : '',
        "accountType" : data.accountType ? data.accountType : '',
        "transactionDesc" : data.NARRATION ? data.NARRATION : '',
        "beneficiaryName" : data.res_beneName ? data.res_beneName : '',
        "processingDate" : processDate ? processDate : '',
       }

       this.accService.downloadRecentTransactionPDF(params).subscribe((response:any)=>{
        const src = 'data:application/'+response.dataValue.format+';base64,'+ response.dataValue.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = response.dataValue.fileName; //Dynamic FileName
        link.click();
        link.remove();
      }, error => {
      
      })
    }
     
  }
  paginationChangeClick(params: any) {
    // this.dataSource
    // // this.recordId = params.pageSize;
    // if(params.pageClick === "Next"){
    //   var cal = (params.pageSize * (params.pageIndex + 1)) + 1;
    //   if(cal > this.dataSource.length){
    //     this.toRow = "10";
    //     this.getAccountDetailsInfo();
    //   }else{

    //   }
    // }else{

    // }
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getAccountDetailsInfo();
  }

  callbackmt942()
  {
        let day=new Date().getDate();
        let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
        let year=new Date().getFullYear()
        let date=day+"/"+month+"/"+year
        this.advSearchFromDate = date;
        this.advSearchToDate = date;        
    this.getAccountDetailsInfo();
  }
 
}
