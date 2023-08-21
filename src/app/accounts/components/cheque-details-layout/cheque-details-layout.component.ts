import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { getPdf } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cheque-details-layout',
  templateUrl: './cheque-details-layout.component.html',
  styleUrls: ['./cheque-details-layout.component.scss']
})
export class ChequeDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  printSection:string="";
  saveReceiptObject:any;
  amtChargesDetails: any;
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  constructor(private translateService: TranslateService) { 
    
  }

  ngOnInit(): void {
    this.rootScopeData.chequeBookDetailsObject
     this.printSection="chequeBookDetailsPrintSection";
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesServiceRequestObject.requestRefNo,
      productCode:this.rootScopeData.pendingActivitiesServiceRequestObject.productCode,
      subProductCode:this.rootScopeData.pendingActivitiesServiceRequestObject.subProductCode,
      functionCode:this.rootScopeData.pendingActivitiesServiceRequestObject.functionCode,
    }

    this.saveReceiptDataForPrint();
  }

  getCharges(eve: any){
    this.amtChargesDetails = eve;
    this.saveReceiptDataForPrint();
  }

  saveReceiptDataForPrint(){
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_CHEQUE_BOOK_DETAILS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": "",
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NAME ? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO ? this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME ? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME : "--"
        },
        {
          "subHead": "Cheque Book Details",
          "subValue": ""
        },
        {
          "subHead": "Number of books",
          "subValue": this.rootScopeData.chequeBookDetailsObject.NO_BK ? this.rootScopeData.chequeBookDetailsObject.NO_BK : "--"
        },
        {
          "subHead": "Cheque Book Type",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE ? this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE : "--"
        },
        {
          "subHead": "Delivery",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CHE_DEL ? (this.rootScopeData.chequeBookDetailsObject.CHE_DEL +' '+ this.rootScopeData.chequeBookDetailsObject.COL) : "--"
        },
        {
          "subHead": "Charge Details",
          "subValue": ""
        },
        {
          "subHead": "Charge Amount",
          "subValue": this.amtChargesDetails?.chargeAmt
        },
        {
          "subHead": "Tax Amount",
          "subValue": this.amtChargesDetails?.taxAmt
        },
      ],
      "pagecall":"checkbookdetails",
      "refNo":this.rootScopeData.chequeBookDetailsObject.INPUT_REFERENCE_NO
    }
  }
  
  toPdf(id:any) {
    getPdf(id,this.translateService,'ChequeBookDetails.pdf')
  }

}
