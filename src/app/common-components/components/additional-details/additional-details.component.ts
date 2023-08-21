import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss']
})
export class AdditionalDetailsComponent implements OnInit {
@Input() displayReadOnly=true
@Input() showEdit=false
@Input() additionalDetailsObj={date:null,paymentDetails:'',customerRef:''}
@Output() additionalObj=new EventEmitter()
rootScopeData: RootScopeDeclare = RootScopeData;
  date:any;

  constructor() {}

  ngOnInit(): void {
    let currentDate= new Date();
    const dt = currentDate.getDate() > 9?currentDate.getDate():'0'+currentDate.getDate();
    const mnth = (currentDate.getMonth()+1) > 9?(currentDate.getMonth()+1):'0'+(currentDate.getMonth()+1);
    this.date = dt+ '/' +  mnth +'/'+currentDate.getFullYear();
    this.additionalDetailsObj.date=this.date
  }
  editData(){
    this.displayReadOnly=true;
    this.showEdit=false
    this.rootScopeData.sadadMoreTransactionBtn=true
  }
  emitData(){
    this.additionalObj.emit(this.additionalDetailsObj)
  }
}


