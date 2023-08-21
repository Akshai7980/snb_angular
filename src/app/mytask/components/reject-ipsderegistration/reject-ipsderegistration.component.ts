import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-reject-ipsderegistration',
  templateUrl: './reject-ipsderegistration.component.html',
  styleUrls: ['./reject-ipsderegistration.component.scss']
})
export class RejectIPSDeregistrationComponent implements OnInit {
  rejectreason: string = '';
  isrejectreasonValid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  pdfData: any;
  refNumber:any;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(private myTaskService: MyTaskService, private location: Location, private route: Router, private downloadAsPdf:downloadAsPdf,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  textArea_Click() {
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit() {
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    if (!this.isrejectreasonValid) {
      let params = {
        refNumber: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REF_NO,
        productCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_PRODUCT_CODE,
        subProductCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_SUBPROD_CODE,
        action: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_FUNCTION_ID,
        versionNumber: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_VERSION_NO,
        hostCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACTION,
      }
      this.isLoadingCompelete = false;
      this.myTaskService.ipsRegDeRegAndQTLRejectAPICall(params, this.rejectreason).subscribe(
        (response: any) => {
          this.isLoadingCompelete = true;
          if (response.dataValue.STATUS === "Success") {
            this.refNumber = response.dataValue.INTERNAL_REFERENCE_NO;
            this.constructReceiptData(response.dataValue.INTERNAL_REFERENCE_NO);
            this.receiptForm = true;
          }

        },
        error => {
          this.isLoadingCompelete = true;

        }
      )
    }
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_IPS_DEREG_REJECTED",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "false",
          "data": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACCOUNT_NAME",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
            }
          ]
        }
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "initiateButton": {
        "buttonLabel": "LBL_MAKE_ANOTHER_AUTHORIZATION"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REJECT_INSTANT_TRANSFER_DEREGISTRATION_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_IPS_DEREG_REJECTED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME : "--"
        }
      ],
      "pagecall":"IPSRegAuth",
      "refNo":refNumber
    }
  }

  onBackArrowClick() {
    this.location.back();
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/instantTransferManagement'])
  }

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_IPS_DEREGISTRATION_RECEIPT"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:'IPS Details', y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACCOUNT_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},    
    { type: 'text', value:  this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME : '--', y:75},
    { type: 'text', value:  this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO : '--', y:85},
    { type: 'text', value: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME ?this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME : '--', y:95},
    
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
    { type: 'text', value: this.refNumber ? this.refNumber : '', y:105},
    { type: 'heading', value:this.translateService.instant('LBL_IPS_DEREG_APPROVED'), y:115},
    
  ]


  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'RejectIPSDeRegisteration.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'RejectIPSDeRegisteration.pdf'}
   )
  }
  //   this.pdfData.push(
  //     { type: 'save', value:'AuthorizePayrollFileUpload.pdf'}
  //  )

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

}
