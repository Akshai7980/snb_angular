import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
// import { getPdf } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-transferinqurirysummary',
  templateUrl: './transferinqurirysummary.component.html',
  styleUrls: ['./transferinqurirysummary.component.scss']
})
export class TransferinqurirysummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  PayTrackerParams = {};
  printSection: string = '';
  pdfData:any;
  // logo ="assets/images/snb-logo-print.png";
  logo :string ="";
  transferSummary: any;
  transferDetails: any;
  debitDetails: any;
  isLoadingCompelete = true;
  transfersummaryDetails: any;
  constructor(private location: Location,private translateService:TranslateService,
     private downloadAsPdf:downloadAsPdf, private transactionservice: TransactionInquiryService) {
    this.logo = logoprint();
    this.getSwiftGPIDetails();
    // this.getPayTrackerDetails()
    // this.transferSummary = this.rootScopeData.transactionInquiry.summary;
  }

  ngOnInit(): void {
    this.printSection="singleTransferInquiryPrinSection";
    if (!this.rootScopeData.transactionInquiry) {
      this.location.back();
    }
    // this.transferDetails = this.rootScopeData.transactionInquiry.details;
    // this.debitDetails = this.rootScopeData.transactionInquiry.paymentDetails;
  }


  back(): void {
    this.location.back();
  }

  getSwiftGPIDetails(){
    let param ={
      requestFrom : 'Summary',
      transRefNo : this.rootScopeData.accDetailsObject.ref_NO,
      unitID : this.rootScopeData.userInfo.UNIT_ID,
    }
    this.isLoadingCompelete = false;
    this.transactionservice.getSwiftGpiDetails(param).subscribe(
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


