import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-reject-cheque-book-request',
  templateUrl: './reject-cheque-book-request.component.html',
  styleUrls: ['./reject-cheque-book-request.component.scss']
})
export class RejectChequeBookRequestComponent implements OnInit {
  rejectreason:any;
  isrejectreasonValid:boolean = true;
  rootScopeData:RootScopeDeclare=RootScopeData;
  @Output() rejectReasonValidationFlag= new EventEmitter();
  @Output() submitData=new EventEmitter();
  details: any;

  constructor() { }

  ngOnInit(): void {
    this.details = this.rootScopeData.chequeBookDetailsObject;
  }

  textArea_Click(){
    this.isrejectreasonValid = this.rejectreason ? true : false;
    this.rejectReasonValidationFlag.emit(this.isrejectreasonValid);
    let inputAction;
    if(this.details.OD_STATUS === "RR"){
      inputAction = "TXN_SEND"
    }else{
      inputAction = "AUTH_TXN"
    }
    // console.log(this.rootScopeData.pendingActivitiesServiceRequestObject.host_TXN_CODE)
    let params={
      inputAction:inputAction,
      remarks: this.rejectreason,
      refNumber:this.details.INPUT_REFERENCE_NO,
      productCode:this.details.INPUT_PRODUCT,
      subProductCode:this.details.INPUT_SUB_PRODUCT,
      action:this.details.INPUT_FUNCTION_CODE,
      hostCode:this.rootScopeData.pendingActivitiesServiceRequestObject.host_TXN_CODE
    }
    this.submitData.emit(params);
  }

}
