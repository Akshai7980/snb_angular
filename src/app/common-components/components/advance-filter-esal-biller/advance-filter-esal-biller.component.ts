import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberValidation_Omit_Char, omit_special_char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advance-filter-esal-biller',
  templateUrl: './advance-filter-esal-biller.component.html',
  styleUrls: ['./advance-filter-esal-biller.component.scss']
})
export class AdvanceFilterEsalBillerComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  @Input() sadadData:any;
  clearFlag:boolean = false;
  refNo: any;
  name: any;
  constructor() { }

  ngOnInit(): void {
  }

 

  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }

  onClickApply(){
  let params;
    if(this.refNo || this.name ){
      params={
        name: this.name,
        refNum: this.refNo,
        type: "field"
      }
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;    
    }
    else{
      this.showAdvancedSearchPopup = false;
    }
  
}
    

onClickClear(){
  this.refNo='';

  this.name='';
}
closeFilter(event:any){
  this.showAdvancedSearchPopup = false; 
}

charOly(event:any){
  return (event);
}
alphaNumeric(event:any){
  return omit_special_char(event)
}
}
