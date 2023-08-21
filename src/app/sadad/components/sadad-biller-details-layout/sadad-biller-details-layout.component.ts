import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { getPdf } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sadad-biller-details-layout',
  templateUrl: './sadad-biller-details-layout.component.html',
  styleUrls: ['./sadad-biller-details-layout.component.scss']
})
export class SadadBillerDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  printSection:string="";
  pdfData: any;
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  pdfType:string="save";
  saveReceiptObject: any;
  printEnabled:boolean=true;
  constructor(private translateService: TranslateService, private downloadAsPdf:downloadAsPdf, private route:Router) { 
    
  }

  ngOnInit(): void {
     this.printSection="sadadBillerDetailsPrintSection"; 
  }

 
  
  // toPdf(id:any) {
  //   getPdf(id,this.translateService,'sadadBillerDetails.pdf')
  // }


  onDetailsget(event:any){
    // debugger;
    this.printEnabled = event === "false" ? true : false;
      if(this.printEnabled){
        // debugger
        this.saveReceiptObject = {
          "pageheading": this.translateService.instant("LBL_BILLER_DETAILS"),
          "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
          "Description": "",
          "keyValues": [
            {
              "subHead": "Sadad Biller Details",
              "subValue": ""
            },
            {
              "subHead": "Biller Name",
              "subValue": this.rootScopeData.sadadBillerDetailsObj.billerName ? this.rootScopeData.sadadBillerDetailsObj.billerName : '--'
            },
            {
              "subHead": "Subscriber ID",
              "subValue": this.rootScopeData.sadadBillerDetailsObj.subscriberId ? this.rootScopeData.sadadBillerDetailsObj.subscriberId : '--'
            },
            {
              "subHead": "Biller Group",
              "subValue": this.rootScopeData.sadadBillerDetailsObj.billerGroupName ? this.rootScopeData.sadadBillerDetailsObj.billerGroupName : '--'
            },
            {
              "subHead": "Short Name",
              "subValue": this.rootScopeData.sadadBillerSummaryObject.nickName ? this.rootScopeData.sadadBillerSummaryObject.nickName : '--'
            },
            {
              "subHead": "Customer Id",
              "subValue": this.rootScopeData.sadadBillerDetailsObj.CustomerId ? this.rootScopeData.sadadBillerDetailsObj.CustomerId : '--'
            },
            {
              "subHead": "Status",
              "subValue": this.rootScopeData.sadadBillerDetailsObj.status ? this.rootScopeData.sadadBillerDetailsObj.status : '--'
            }
          ],
          "pagecall":"sadadbillerdetails",
          "refNo":this.rootScopeData.sadadBillerSummaryObject.refNo
        }
       //console.log(this.saveReceiptObject)
      }
      
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
        { type: 'title', value:"Sadad Biller Details", x:85, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_BILLER_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_CUSTOMER_ID'), y:65},
        { type: 'heading', value:this.translateService.instant('LBL_SUBSCRIBER_ID'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_STATUS'), y:95},
        { type: 'heading', value:this.translateService.instant('LBL_BILLER_NAME'), y:105},
        { type: 'heading', value:this.translateService.instant('LBL_SERVICE_NAME'), y:115},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.CustomerId ? this.rootScopeData.sadadBillerDetailsObj.CustomerId : '--', y:65},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.subscriberId ? this.rootScopeData.sadadBillerDetailsObj.subscriberId : '--', y:75},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.nickName ? this.rootScopeData.sadadBillerDetailsObj.nickName : '--', y:85},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.status ? this.rootScopeData.sadadBillerDetailsObj.status : '--', y:95},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.billerName ? this.rootScopeData.sadadBillerDetailsObj.billerName : '--', y:105},
        { type: 'text', value:this.rootScopeData.sadadBillerDetailsObj.billerGroupName ? this.rootScopeData.sadadBillerDetailsObj.billerGroupName : '--', y:115},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_REF_NUM'), y:125},
        { type: 'text', value:this.rootScopeData.sadadBillerSummaryObject.refNo ? this.rootScopeData.sadadBillerSummaryObject.refNo : '--', y:125},
      ]

        this.pdfData.push(
          { type: printType, value:'sadadBillerDetails.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);
    }
  }

  onClickBack() {
    this.route.navigate(['/sadad/billsInquiry/sadadBillerInquiry'])
  }
  
}
