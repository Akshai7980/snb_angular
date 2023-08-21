import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { getPdf } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { Router } from '@angular/router';
@Component({
  selector: 'app-esal-biller-details-layout',
  templateUrl: './esal-biller-details-layout.component.html',
  styleUrls: ['./esal-biller-details-layout.component.scss']
})
export class EsalBillerDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  printSection:string="";
  pdfData: any;
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  pdfType:string="save";
  constructor(private translateService: TranslateService , private downloadAsPdf:downloadAsPdf, private router:Router) { 
    
  }

  ngOnInit(): void {
     this.printSection="esalBillerDetailsPrintSection";
     this.workFlowHistoryParams={
      refNum:this.rootScopeData.esalBillerSummaryObject.referenceNumber,
      productCode:"PAYMNT",
      subProductCode:"PAYRMAIN",
      functionCode:"PAYCRET",
    }
  }

  
  toPdf(id:any) {
    getPdf(id,this.translateService,'esalBillerDetails.pdf')
  }

  selectDetailsPagePrint(){
    this.downloadPdf('print');
  }

  downloadPdf(printType:any){
    { 
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:"Esal Biller Details", x:85, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_ESAL_BILLER_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_ID'), y:65},
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_SHORT_NAME'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_FULL_NAME'), y:85},
        { type: 'text', value:this.rootScopeData.esalBillerSummaryObject.payerId ? this.rootScopeData.esalBillerSummaryObject.payerId : '--', y:65},
        { type: 'text', value:this.rootScopeData.esalBillerSummaryObject.payerShortName ? this.rootScopeData.esalBillerSummaryObject.payerShortName : '--', y:75},
        { type: 'text', value:this.rootScopeData.esalBillerSummaryObject.payerFullName ? this.rootScopeData.esalBillerSummaryObject.payerFullName : '--', y:85},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_REF_NUM'), y:105},
        { type: 'text', value:this.rootScopeData.esalBillerSummaryObject.referenceNumber ? this.rootScopeData.esalBillerSummaryObject.referenceNumber : '--', y:105},
      ]

        this.pdfData.push(
          { type: printType, value:'esalBillerDetails.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);
    }
  }
  onClickBack() {
    this.router.navigate(['/sadad/billsInquiry/sadadBillerInquiry'])
  }
}
