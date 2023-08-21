import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-advanced-filter-accounts',
  templateUrl: './advanced-filter-accounts.component.html',
  styleUrls: ['./advanced-filter-accounts.component.scss']
})
export class AdvancedFilterAccountsComponent implements OnInit {
searchwithin="all";
datetime="descending";
period='currentDay';
leftToggle=true;
rightToggle=false;
fromDate: any;
clearFlag:boolean = false;
toDate:any;
fromAmnt : any;
toAmnt :any;
ccyCode : any;
maxDate=new Date();
@Input() showAdvancedSearchPopup:any;
rootScopeData: RootScopeDeclare = RootScopeData;
@Output() advancedSearchParams =new EventEmitter();
showDateErrorMessage: boolean = false;
toDateValue: any;
fromDateValue: any;
minDate : any;
transactTypeData :any;
transactType:any;
amtErr : any;
entrAmtErr : any;
constructor(private commonService:CommonService) { 
  this.ccyCode = this.rootScopeData.accountsSummaryObject.OD_CCY_CODE
}

  ngOnInit(): void {
    this.getTransactType_click();
  }




  leftToggleCntl(){
    if(this.leftToggle=true){
      document.getElementById('leftToggle')?.classList.add('active');
      document.getElementById('rightToggle')?.classList.remove('active');
      this.rightToggle = false;

      this.period='currentDay'; 

    }
  }
  rightToggleCntl(){
    if(this.rightToggle=true){
      document.getElementById('rightToggle')?.classList.add('active');
      document.getElementById('leftToggle')?.classList.remove('active');
      this.leftToggle=false;

      this.clearFlag = true;
    }
  }
  stopAdvancedSearchClose(event:any){

    event.stopImmediatePropagation();
  }
  onClickApply(){
    let params;

    if(this.leftToggle){      
        params = 
        {
        period : "Custom Dates",
        sortOrder : this.datetime,
        searchwithin : this.searchwithin,
        transactionType : this.transactType,
        fromDate : this.fromDate,
        toDate : this.toDate,
        fromAmt : this.fromAmnt,
        toAmnt : this.toAmnt
        }
        if(this.fromAmnt || this.toAmnt){
          if(this.fromAmnt && this.toAmnt){
            let frm= Number(amountUnFormat(this.fromAmnt)) 
            let to = Number(amountUnFormat(this.toAmnt))
            if(frm>to){
              this.amtErr = "LBL_AMT_ERR";
              this.entrAmtErr = "";
            }else{
              this.amtErr = "";
              this.entrAmtErr = "";
            }
          }else{
            this.entrAmtErr = "LBL_PLEASE_ENTER_AMOUNT";
            this.amtErr = "";
          }
        }else{
          this.amtErr = "";
          this.entrAmtErr = "";
        }
        if(!this.amtErr && !this.entrAmtErr){
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.showDateErrorMessage = false;
        this.period='currentDay';
        this.leftToggle=true;
        this.rightToggle=false;
          // this.fromDate = this.fromDateValue;
          // this.toDate = this.toDateValue;
        // this.fromAmnt ='';
        // this.toAmnt = '';
         this.leftToggleCntl();
        //  this.clearFlag = !this.clearFlag;
        this.clearFlag = false;
        }    
    }else if(this.rightToggle){
      if(this.period){
        params = 
      {
        period : this.period,
        sortOrder : this.datetime,
        searchwithin : this.searchwithin,
        fromDate : "",
        toDate : "",
        fromAmt : this.fromAmnt,
        toAmnt : this.toAmnt,
        transactionType : this.transactType,
      }
      if(this.fromAmnt || this.toAmnt){
        if(this.fromAmnt && this.toAmnt){
          let frm= Number(amountUnFormat(this.fromAmnt)) 
          let to = Number(amountUnFormat(this.toAmnt))
          if(frm>to){
            this.amtErr = "LBL_AMT_ERR";
            this.entrAmtErr = "";
          }else{
            this.amtErr = "";
            this.entrAmtErr = "";
          }
        }else{
          this.entrAmtErr = "LBL_PLEASE_ENTER_AMOUNT";
          this.amtErr = "";
        }

      }else{
        this.amtErr = "";
        this.entrAmtErr = "";
      }
      if(!this.amtErr && !this.entrAmtErr){
        this.advancedSearchParams.emit(params);
          this.showAdvancedSearchPopup = false;
          this.showDateErrorMessage = false;
          // this.period='currentDay';
          this.leftToggle=false;
          this.rightToggle=true;
            // this.fromDate = "";
            // this.toDate = "";
          //  this.fromAmnt ='';
          //  this.toAmnt = '';
           this.rightToggleCntl();
           this.clearFlag = false;
          // this.clearFlag = !this.clearFlag;
      }
      }
    }
  }

  onClickClear(){
    this.searchwithin="all";
    this.datetime="descending";
    this.period='currentDay';
    this.fromDate = "";
    this.toDate = "";
    this.fromAmnt ='';
    this.toAmnt = '';
    this.fromDateValue='';
    this.toDateValue='';
    this.leftToggle=true;
    this.rightToggle=false;
    this.transactType='';
    this.clearFlag = !this.clearFlag;
    this.amtErr='';
    this.entrAmtErr = "";
    this.leftToggleCntl();
  }

  getFromDate(event:any){
    // this.fromDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
    // this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.fromDate=day+"/"+month+"/"+year
      // if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
      //   this.fromDateValue = event       
      // }
      this.fromDateValue = event      
      this.toDate ='';
      this.toDateValue = '';
  }
  getToDate(event:any){
    // this.toDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
    // this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.toDate=day+"/"+month+"/"+year
      this.toDateValue = event
  }


  omitSplCharacters(val:any){
    return NumberValidation_Omit_Char(val);
  }

  onfromCurrencyConvert(amount:any)
  {
    let getamount = amount.target.value;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    if(getamount){

      this.fromAmnt = currencyFormatPipeFilter.transform(getamount.trim(),this.ccyCode);
    }
  }

  ontoCurrencyConvert(amount:any)
  {
    let getamount = amount.target.value;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    if(getamount){
    this.toAmnt = currencyFormatPipeFilter.transform(getamount.trim(),this.ccyCode);
    }
  }

  getTransactType_click() {
    this.commonService.getTransactionTypeAPICall().subscribe(
      (response:any) => {        
        this.transactTypeData = response.data.ALL_RECORDS;
      }, error => {

      }

    )
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
