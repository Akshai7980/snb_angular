import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-beneficiaries-single',
  templateUrl: './advanced-filter-beneficiaries-single.component.html',
  styleUrls: ['./advanced-filter-beneficiaries-single.component.scss']
})
export class AdvancedFilterBeneficiariesSingleComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  showDateErrorMessage: boolean = false;
  dateFrom: any;
  dateTo: any;
  name: any;
  bankName: any;
  clearFlag: boolean = false;
  paymentType: any;
  fromDateErrorMessage:boolean = false; 
  toDateErrorMessage:boolean = false;
  maxFromDate = new Date();
  maxToDate = new Date();
  minFromDate :any;
  minToDate :any;
  constructor() { }

  ngOnInit(): void {
  }
  
  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }

  getFromDate(event: any) {
    this.dateFrom = event;
    // this.dateTo ='';
    this.minToDate = this.dateFrom
  }
  getToDate(event: any) {
    this.dateTo = event;
    this.maxFromDate = this.dateTo
  }

  onClickApply() {
    let params;
    if(this.dateFrom || this.dateTo){
      if(this.dateFrom && this.dateTo){
        // this.showDateErrorMessage = false
        this.fromDateErrorMessage=false;
        this.toDateErrorMessage=false;
      }else{
        // this.showDateErrorMessage = true
        this.fromDateErrorMessage = this.dateFrom ? false : true;
      this.toDateErrorMessage = this.dateTo ? false : true;
      }
    }
      if ((this.dateFrom && this.dateTo) || this.name || this.bankName) {
        params = {
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          name: this.name,
          bankName: this.bankName
        };
        this.advancedSearchParams.emit(params);

        this.showAdvancedSearchPopup = false;
        // this.dateFrom = '';
        // this.dateTo = '';
        // this.name = '';
        // this.bankName = '';
        // this.clearFlag = !this.clearFlag;
        this.clearFlag = false;
      } 
      if(!this.fromDateErrorMessage && !this.toDateErrorMessage){
        this.showAdvancedSearchPopup = false;
      }else{
        this.showAdvancedSearchPopup = true;
      }
  }

  onClickClear() {
    this.dateFrom = '';
    this.dateTo = '';
    this.name = '';
    this.bankName = '';
    this.showDateErrorMessage = false;
    this.clearFlag = !this.clearFlag;
    this.fromDateErrorMessage=false;
    this.toDateErrorMessage=false;
    this.maxFromDate = new Date();
    this.maxToDate = new Date();
    this.minFromDate = '';
    this.minToDate = '';
  }
    closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
  getFormattedDate(date:any){
    let day=date.getDate()>9?date.getDate():"0"+date.getDate()
    let month=(date.getMonth() + 1)>9?(date.getMonth() + 1):"0"+(date.getMonth() + 1)
    let year=date.getFullYear()
   return day+"/"+month+"/"+year
  }
}
