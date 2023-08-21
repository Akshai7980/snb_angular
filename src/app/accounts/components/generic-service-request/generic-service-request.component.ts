import { Component, OnInit } from '@angular/core';
//import { AnyForUntypedForms } from '@angular/forms';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-generic-service-request',
  templateUrl: './generic-service-request.component.html',
  styleUrls: ['./generic-service-request.component.scss']
})
export class GenericServiceRequestComponent implements OnInit {
  cifNumberError=false;
  serviceTypeError=false;
  corporateName="";
  modifyError=false;
  modify:any;
  country:any;
  termsAccept=""
  cifNumberisSelected=false;
  dataSource:any=[];
  serviceType:any;
  cifNumber:any;
  rootScopeData:RootScopeDeclare=RootScopeData
  constructor(private accountService:AccountDetailsService) {this.rootScopeData.lhsActiveComp = 'genericServicerequest' }

  ngOnInit(): void {
    this.getCifInfo()
  }
  getCifInfo(){
    this.accountService.getGenericServiceRequestData().subscribe((res:any)=>{
      this.dataSource=res.dataValue.DETAILS
    })
  }
  cifNumberSelected(){
    this.country=this.cifNumber.COUNTRY;
    this.corporateName=this.cifNumber.CUSTOMER_NAME;
    this.cifNumberisSelected = this.cifNumber ? true : false;
  }
  submit(){
this.cifNumberError = this.cifNumber ? false : true;
if(this.cifNumberisSelected){
  this.serviceTypeError = this.serviceType ? false : true;
  this.modifyError=this.modify? false : true;
}
  }
}
