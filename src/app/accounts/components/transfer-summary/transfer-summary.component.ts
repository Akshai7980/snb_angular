import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
// import { getPdf } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-transfer-summary',
  templateUrl: './transfer-summary.component.html',
  styleUrls: ['./transfer-summary.component.scss']
})
export class TransferSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  PayTrackerParams = {};
  printSection: string = '';
  pdfData:any;
  // logo ="assets/images/snb-logo-print.png";
  logo :string ="";
  transferDetails: any;
  debitDetails: any;
  isLoadingCompelete: boolean = true;
  transfersummaryDetails: any;
  currentRecord:any
  constructor(private location: Location,private translateService:TranslateService, private downloadAsPdf:downloadAsPdf,private accService : AccountDetailsService) {
    this.getSwiftGPIDetails();
    this.logo = logoprint();
    this.currentRecord=this.rootScopeData.dataFromContextMenu
    // this.getPayTrackerDetails();
    // this.transferSummary = this.rootScopeData.transactionInquiry.summary;
  }



  ngOnInit(): void {
    
  }
  back(): void {
    this.location.back();
  }
 

  getSwiftGPIDetails(){
    let param ={
      requestFrom : 'Recent',
      transRefNo : '',
      unitID : this.rootScopeData.userInfo.UNIT_ID,
      accId : this.rootScopeData.accDetailsObject.res_Acc_No,
      postingDate :this.rootScopeData.accDetailsObject.res_Val_Dt,
      journalId :this.rootScopeData.accDetailsObject.res_Txn_Ref_No
    }
    this.isLoadingCompelete = false;
    this.accService.getSwiftGpiDetails(param).subscribe(
      (data: any) => {
        if(data){
          this.isLoadingCompelete = true;
           this.transfersummaryDetails = data.dataValue.TrackSwiftGPIPaymentResponse.success;
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        // this.norecordflag = true;
      }
    )
  }



  

}



