import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-cheque-book-details',
  templateUrl: './cheque-book-details.component.html',
  styleUrls: ['./cheque-book-details.component.scss']
})
export class ChequeBookDetailsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  chequeBookDetailsData: any;
  logo :string ="";
  printSection:string="";
  chargeAmt: any;
  taxAmt: any;
  @Output()getCharges = new EventEmitter();
  constructor(private commonService:CommonService) {this.logo = logoprint(); }

  ngOnInit(): void {
    this.printSection="chequeBookDetailsPrintSection";
    this.getChequeBookDetails();
  }

  getChequeBookDetails(){
    this.isLoadingCompelete = false;
    this.commonService.chequeBookDetailsApiCall(this.rootScopeData.pendingActivitiesServiceRequestObject.requestRefNo).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if(res.dataValue) {
        this.chequeBookDetailsData = res.dataValue.DETAILS;
        Object.assign(this.chequeBookDetailsData, { hostTxnCode: this.rootScopeData.pendingActivitiesServiceRequestObject.host_TXN_CODE?this.rootScopeData.pendingActivitiesServiceRequestObject.host_TXN_CODE : ""});
        this.rootScopeData.chequeBookDetailsObject = this.chequeBookDetailsData;
        if((this.chequeBookDetailsData.CHARGE_FLAG === "N") || (this.chequeBookDetailsData.CHARGE_FLAG === " ")){
          this.chargeAmt = "0.00"
        }
        else{
          this.chargeAmt = this.chequeBookDetailsData.CHARGE_AMOUNT;
        }
    
        if(this.chequeBookDetailsData.VAT_AMOUNT == null){
          this.taxAmt = "0.00";
        }
        else{
          this.taxAmt = this.chequeBookDetailsData.VAT_AMOUNT;
        }
        let amtData : any;
        amtData = {
          chargeAmt : this.chargeAmt,
          taxAmt : this.taxAmt
        }
        this.getCharges.emit(amtData);
      }
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

}
