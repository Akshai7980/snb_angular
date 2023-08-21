import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { AramcoService } from '../../services/aramco.service';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from 'src/app/common-components/services/common.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-aramco-invoice-inquiry',
  templateUrl: './aramco-invoice-inquiry.component.html',
  styleUrls: ['./aramco-invoice-inquiry.component.scss']
})
export class AramcoInvoiceInquiryComponent implements OnInit {

  displayedColumns: string[] = ['number', 'date', 'amount', 'hideamount' , 'equivalentCcy', 'dueDate', 'statusDetail'];
  dataSource: any = [];
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceToPass: any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  @ViewChild(MatSort) sort !: MatSort;
  isLoadingCompelete = true;
  noRecordFoundInfoObj: any;
  norecordflag: boolean = false;
  responseHeader: any;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;
  dataSourceLength: any;
  totalRecords: any;
  filterArray: any = [];
  filterflag: string = "";
  fromRow: any;
  toRow: any;
  currentColumn: string = '';
  sortDirection: string = '';

  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAramcoId: any;
  advancedSearchCurrency: any;
  advancedSearchToAmnt: any;
  advancedSearchFromAmnt: any;
  advancedSearchInvoiceNumber: any;
 fromAmnt : any;
  toAmnt :any;
  ccyCode : any;
  toDateValue: any;
  fromDateValue: any;
  aramcoId = "";
  currency = "";
  status = "";
  invoiceNumber = "";
  fromDate: any;
  toDate:any;
  aramcoInvoice: any = [];
  showTable : boolean = false;
  clearFlag:boolean = false;
  printSection:string="";
  showAramcoValErr: boolean = false;
  showFromDateValErr: boolean = false;
  showToDateValErr: boolean = false;
  aramcoInqData: any;
  getDateEvent: any;
  currentDate:any;
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor(private aramcoService: AramcoService, private commonService: CommonService) {
    this.rootScopeData.advSearchCurrentPage = 'aramcoInvoice';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.fromRow = 1;
  }


  ngOnInit(): void {
    this.aramcoInvoiceDetails();
    this.printSection="aramcoInvoiceInquiryPrintSection";
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: '',
      btnLink: '',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.currentDate = new Date();
  }

  aramcoInvoiceDetails() {
    this.isLoadingCompelete = false;
    let params = {
      COD_CORECIF:'',
      UNIT_ID:'',
      OD_ACC_NO:''
    }
    this.aramcoService.getCreditLookUp(params).subscribe((resp:any)=>{
      this.isLoadingCompelete = true;
      if(resp && resp.data){
        this.aramcoInvoice=resp.data
        // this.aramcoInvoice.unshift( {
        //   "remitterId": "All"
        // })
      }

    },err=>{
      this.isLoadingCompelete = true;
    })
   
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { "name": "number", "fieldType": "string" },
      { "name": "date", "fieldType": "date" },
      { "name": "amount", "fieldType": "amount" },
      { "name": "invoiceCurrency", "fieldType": "ccy1" },
      { "name": "dueDate", "fieldType": "date" },
      { "name": "statusDetail", "fieldType": "date" }

    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value);
    this.dataSourceToPass = new MatTableDataSource(tableData);
    // this.dataSourceToPass.paginator = this.commonPagination.paginator;
    // showFilteredRows('sadadbillersDefaultCntr', event.target.value); 
  }

 

  refreshSummary() {
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    // this.commonPagination.paginator.pageSize = 5;
    // this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.aramcoInvoiceDetails();
  }
  getFromDate(event:any){
    this.getDateEvent = event;
    this.showFromDateValErr  = false;
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.fromDate=day+"/"+month+"/"+year
    this.clearFlag=false
        // this.fromDateValue = event
      }
  getToDate(event:any){
    this.showToDateValErr = false;
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.toDate=day+"/"+month+"/"+year;
    this.clearFlag=false
      // this.toDateValue = event
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.aramcoInvoiceDetails();
  }
  
  onfromCurrencyConvert(amount:any)
  {
    let getamount = amount.target.value;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    if(getamount){
      this.fromAmnt = currencyFormatPipeFilter.transform(getamount.trim(),this.ccyCode);
    }
  }
 
  ontoCurrencyConvert(amount:any){
   
    let getamount = amount.target.value;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    if(getamount){
      this.toAmnt = currencyFormatPipeFilter.transform(getamount.trim(),this.ccyCode);
    }
  }
  omitSplCharacters(val:any){
    return NumberValidation_Omit_Char(val);
  }
  onClickApply(){
    if(this.aramcoId!==''){
      this.showAramcoValErr = false;     
    }else{
      this.showAramcoValErr = true;
      return;
    }
    if(this.fromDate || this.toDate){
      if(this.fromDate && this.toDate){
        this.showFromDateValErr = false;
        this.showToDateValErr = false;
      }else{
        if(this.fromDate){
          this.showToDateValErr = true;
          this.showFromDateValErr = false;
          return;
        }else if(this.toDate){
          this.showFromDateValErr = true;
          this.showToDateValErr = false;
          return;
        }
      }
    }
    let params={
      aramcoId :this.aramcoId==='All'? "":this.aramcoId,
      invoiceNumber:this.invoiceNumber?this.invoiceNumber:'',
      currency:this.currency?this.currency:'',
      fromDate:this.fromDate?this.fromDate:'',
      toDate:this.toDate?this.toDate:'',
      status:this.status?this.status:'',
      amountFrom:this.fromAmnt?parseFloat(amountUnFormat( this.fromAmnt))+"":'',
      amountTo:this.toAmnt?parseFloat(amountUnFormat( this.toAmnt ))+"":''
    }

    this.aramcoInqData = params;
    if(this.aramcoId || this.invoiceNumber || this.currency || this.fromDate ||this.toDate || this.status||this.fromAmnt||this.toAmnt){
      
      this.isLoadingCompelete = false;
      this.aramcoService.getAramcoInvoice(params).subscribe((resp:any)=>{
        this.isLoadingCompelete = true;
        this.showTable=true;
        if(resp && resp.data && resp.data.invoice && resp.data.invoice.length>0){
          
          
          this.dataSource = [];
          if(this.currency)
          {    
            for(let i=0; i < resp.data.invoice.length; i++)
            {
              if(resp.data.invoice[i].invoiceCurrency===this.currency){
                let objdata ={};
                  objdata = resp.data.invoice[i]
                 this.dataSource.push(objdata) ;
              }
              else{
                delete resp.data.invoice[i];
              }
            }
            
          }
          else{
            this.dataSource = resp.data.invoice;            
          }
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.sort = this.sort;
          this.dataSourceLength = this.dataSource.length;
          
          // this.showTable=true;
          this.norecordflag=false;
        // this.dataSourceToPass.paginator = this.commonPagination.paginator;
        }else{
          this.norecordflag=true;
          this.dataSourceToPass =''
          this.dataSource = ''
        }
      },err=>{
        this.isLoadingCompelete = true;
      })
    }
   
  }
  onClear(){
    this.showTable= false;
    this.fromAmnt ='';
    this.toAmnt = '';
    this.fromDate='';
    this.toDate='';
    this.aramcoId="";
    this.currency="";
    this.status="";
    this.invoiceNumber="";
    this.dataSource = '';
    this.clearFlag=!this.clearFlag
  }

  selectedRemitterId(){
    this.showAramcoValErr = false;
  }
}
