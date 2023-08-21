import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit,OnChanges {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Output() dateValue = new EventEmitter();
  @Input() clearFlag:any;
  @Input() showDateErrorMessage:any;
  @Input() maxDate:any;
  @Input() minDate:any;
  @Input() newDate:any;
  @Input() filterArray:any;
  @Input() startDate?: any;
   constructor(private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string) { }
  ngOnInit(): void {
  }
valueDate(){
  this.showDateErrorMessage = this.newDate ? false:true;
  this.dateValue.emit(this.newDate);
}
ngOnChanges(){ 
  if(this.clearFlag)
  {
    this.newDate = undefined;
  } 
}
checkLang(){
  if(this.rootScopeData.userInfo.mLanguage==='ar_SA'){
    this._locale = 'ar';
    this._adapter.setLocale(this._locale);
  }else{
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }
}
myFilter = (d:Date | null): boolean => {
  if(this.filterArray){
    if(d){
      const time=d.getTime()
      if(!this.filterArray.find((x:any)=>x==time)){
        return false
      }
    }
  }

  return true 

}
}
