import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-simple-additional-details-payments',
  templateUrl: './simple-additional-details-payments.component.html',
  styleUrls: ['./simple-additional-details-payments.component.scss']
})
export class SimpleAdditionalDetailsPaymentsComponent implements OnInit {

  @Output() additionalDetailsEmit = new EventEmitter<string>();
  @Input() additionalDetailsErrorObj:any={};
  @Input() showAddDetInitiateScreen = true;
  @Input() rootScopeObject:any;
  @Input() setNarrationVal:any;
  // @Input() relationshipArrayDataSource:any={};
  // @Input() purposeOfTransferArrayDataSource:any={};
  // @Output() purposeCode = new EventEmitter();
  // @Output() relationshipCode = new EventEmitter();
  
  @Input() maxDate:any;
  @Input() minDate:any;

  vDate:any;

  additionalDetailsObj:any={
    purpose:"",
    relationship:"",
    valueDate:"",
    narration:"",
    purposeCode:"",
    relationShipCode:""
  };
  @Input() narrationDisabled = false;
  constructor() { }

  ngOnInit(): void {
    if (this.rootScopeObject) {
      this.additionalDetailsObj.narration = this.rootScopeObject.transactionCustRef;
      var selectedDate = new Date();
      this.vDate = selectedDate;
      let vDateEmit = "" + selectedDate.getDate().toString().padStart(2, "0") + "/" + (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "/" + selectedDate.getFullYear();
      this.additionalDetailsObj.valueDate = vDateEmit;
      this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    }else{
    var selectedDate = new Date();
    this.vDate = selectedDate;
    let vDateEmit = "" + selectedDate.getDate().toString().padStart(2, "0") + "/" + (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "/" + selectedDate.getFullYear();
    this.additionalDetailsObj.valueDate = vDateEmit;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
   }
  }

  // purposeChanged(event: any) {
  //   if(this.additionalDetailsObj.purpose != undefined && this.additionalDetailsObj.purpose != "" && this.additionalDetailsObj.purpose != null){
  //     this.additionalDetailsErrorObj.purposeError = "";
  //   }
  //   if(this.additionalDetailsObj.purpose){
  //     for(let i=0;i<this.purposeOfTransferArrayDataSource.length;i++){
  //       if(this.additionalDetailsObj.purpose === this.purposeOfTransferArrayDataSource[i].purposeCodeDesc){
  //         this.additionalDetailsObj.purposeCode = this.purposeOfTransferArrayDataSource[i].purposeCode;
  //       }
  //     }
  //   }
  //   this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  //   this.purposeCode.emit(this.additionalDetailsObj.purposeCode);
  // }

  // relationshipChanged(event: any) {
  //   if(this.additionalDetailsObj.relationship != undefined && this.additionalDetailsObj.relationship != "" && this.additionalDetailsObj.relationship != null){
  //     this.additionalDetailsErrorObj.relationshipError = "";
  //   }
  //   if(this.additionalDetailsObj.relationship){
  //     for(let i=0;i<this.relationshipArrayDataSource.length;i++){
  //       if(this.additionalDetailsObj.relationship === this.relationshipArrayDataSource[i].REL_CODE_DESC){
  //         this.additionalDetailsObj.relationShipCode = this.relationshipArrayDataSource[i].REL_CODE;
  //       }
  //     }
  //   }
  //   this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  //   this.relationshipCode.emit(this.additionalDetailsObj.relationShipCode);
  // }

  tovalue() {
    var selectedDate = new Date(this.vDate);
    let vDate = "" + selectedDate.getDate().toString().padStart(2, "0") + "/" + (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "/" + selectedDate.getFullYear();
    if(vDate){
      this.additionalDetailsErrorObj.valueDateError = "";
    }
    this.additionalDetailsObj.valueDate = vDate;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }  

  narrationOnBlur(event:any){
    let narration = event.target.value
    this.additionalDetailsObj.narration= narration;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }  


  ngOnChanges() {
    
    //debugger
    if(this.setNarrationVal){      
      this.additionalDetailsObj.narration = this.setNarrationVal;
    }
    
  }
}
