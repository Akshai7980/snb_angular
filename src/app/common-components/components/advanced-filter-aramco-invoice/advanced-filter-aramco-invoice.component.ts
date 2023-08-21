import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-aramco-invoice',
  templateUrl: './advanced-filter-aramco-invoice.component.html',
  styleUrls: ['./advanced-filter-aramco-invoice.component.scss']
})
export class AdvancedFilterAramcoInvoiceComponent implements OnInit {

  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromDate: any;
  clearFlag:boolean = false;
  toDate:any;
  fromAmnt : any;
  toAmnt :any;
  maxDate=new Date();
  showDateErrorMessage: boolean = false;
toDateValue: any;
fromDateValue: any;
minDate : any;
  constructor() { }

  ngOnInit(): void {
  }


  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }

  onClickApply(){
    let params;
    debugger;
  if((this.fromDate && this.toDate) || (this.fromAmnt && this.toAmnt)){
    params = 
    {
    fromDate : this.fromDate,
    toDate : this.toDate,
    fromAmt : this.fromAmnt,
    toAmnt : this.toAmnt
    }
    this.advancedSearchParams.emit(params);
     this.showAdvancedSearchPopup = false;
      // this.fromDate = this.fromDateValue;
      // this.toDate = this.toDateValue;
      // this.fromAmnt ='';
      // this.toAmnt = '';
    //  this.clearFlag = !this.clearFlag;
    this.clearFlag = false;
  }
}

omitSplCharacters(val:any){
  return NumberValidation_Omit_Char(val);
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


  onClickClear(){
    this.fromDate = "";
    this.toDate = "";
    this.fromAmnt ='';
    this.toAmnt = '';
    this.fromDateValue='';
    this.toDateValue='';
    this.clearFlag = !this.clearFlag;
  }


}
