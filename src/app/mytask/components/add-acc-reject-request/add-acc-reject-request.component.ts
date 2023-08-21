import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-add-acc-reject-request',
  templateUrl: './add-acc-reject-request.component.html',
  styleUrls: ['./add-acc-reject-request.component.scss'],
})
export class AddAccRejectRequestComponent implements OnInit {
  rejectreason: any;
  isrejectreasonValid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  receiptData: any;
  receiptForm: boolean = false;
  isLoadingCompelete: boolean = true;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(
    private location: Location,
    private router: Router,
    private myTaskService: MyTaskService,
    private translateService: TranslateService,private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {}
  onBackArrowClick() {
    this.location.back();
  }

  submit() {
    if (this.rejectreason) {
      let params = {
        INPUT_REFERENCE_NO:
          this.rootScopeData.pendingActivitiesServiceRequestObject.refNo,
        INPUT_VER_NO:
          this.rootScopeData.pendingActivitiesServiceRequestObject.versionNo,
        UNIT_ID: this.rootScopeData.userInfo.UNIT_ID,
        VALUE_DATE:
          this.rootScopeData.pendingActivitiesServiceRequestObject.valueDate,
        REJECT_REASON: this.rejectreason,
      };
      this.isLoadingCompelete = false;

      this.myTaskService.additionalAccountReject(params).subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;

          let vdata: any = [];
          vdata = res;
          if (vdata.dataValue.STATUS === 'Success') {
            this.constructReceiptData(vdata.dataValue.SELECTED_RECORDS);
            this.refNo = vdata.dataValue.SELECTED_RECORDS;
            this.receiptForm = true;
          } else {
            this.isLoadingCompelete = false;
          }
        },
        (error: any) => {
          this.isLoadingCompelete = false;
        }
      );
    } else {
      this.textArea_Click();
    }
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  textArea_Click() {
    this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_ADDITIONAL_ACCOUNT_REJECTED',
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.rootScopeData.pendingActivitiesServiceRequestObject,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.rootScopeData.pendingActivitiesServiceRequestObject
                .linkAccount
                ? this.rootScopeData.pendingActivitiesServiceRequestObject
                    .linkAccount
                : '--',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: this.rootScopeData.pendingActivitiesServiceRequestObject
                .makerId
                ? this.rootScopeData.pendingActivitiesServiceRequestObject
                    .makerId
                : '--',
            },
          ],
        },
        {
          title: 'LBL_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_CURRENCY',
              dataKey: this.rootScopeData.pendingActivitiesServiceRequestObject
                .currency
                ? this.rootScopeData.pendingActivitiesServiceRequestObject
                    .currency
                : '--',
            },
            {
              dispKey: 'LBL_REASON',
              dataKey: this.rootScopeData.pendingActivitiesServiceRequestObject
                .reason
                ? this.rootScopeData.pendingActivitiesServiceRequestObject
                    .reason
                : '--',
            },
            {
              dispKey: 'LBL_LINK_ACCOUNT',
              dataKey: this.rootScopeData.pendingActivitiesServiceRequestObject
                .linkAccount
                ? this.rootScopeData.pendingActivitiesServiceRequestObject
                    .linkAccount
                : '--',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_INITIATE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_ADDITIONAL_ACCOUNT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ADDITIONAL_ACCOUNT_AUTHORIZED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.rootScopeData.userInfo.loginID
          ? this.rootScopeData.userInfo.loginID
          : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount
          ? this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount: '--'
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.pendingActivitiesServiceRequestObject.makerId
          ? this.rootScopeData.pendingActivitiesServiceRequestObject.makerId: '--'
        },
        {
          "subHead": "Details",
          "subValue": ""
        },
        {
          "subHead": "Currency",
          "subValue": this.rootScopeData.pendingActivitiesServiceRequestObject.currency
          ? this.rootScopeData.pendingActivitiesServiceRequestObject.currency: '--'
        },
        {
          "subHead": "Reason",
          "subValue": this.rootScopeData.pendingActivitiesServiceRequestObject.reason
          ? this.rootScopeData.pendingActivitiesServiceRequestObject.reason: '--'
        },
        {
          "subHead": "Link Account",
          "subValue": this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount
          ? this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount: '--'
        }
      ],
      "pagecall":"addaccauthorized",
      "refNo":refNumber
    }
  }

  initiateAnotherRequest() {
    this.router.navigate(['/mytask/serviceRequest/additionalAccount']);
  }

  downloadPdf(values:any)
  { 
  let SelectedType = values;
  // let currencyFormatPipeFilter = new CurrencyFormatPipe();
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_REJECT_ADDITIONAL_ACCOUNT"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_DETAILS'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_CURRENCY'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_REASON'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_LINK_ACCOUNT'), y:135},
    { type: 'text', value:this.rootScopeData.userInfo.loginID? this.rootScopeData.userInfo.loginID : '', y:75},
    { type: 'text', value:this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount ? this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount : '--' , y:85},
    { type: 'text', value:this.rootScopeData.pendingActivitiesServiceRequestObject.makerId ? this.rootScopeData.pendingActivitiesServiceRequestObject.makerId : '--' , y:95},
    { type: 'text', value:this.rootScopeData.pendingActivitiesServiceRequestObject.currency ? this.rootScopeData.pendingActivitiesServiceRequestObject.currency : '--' , y:115},
    { type: 'text', value:this.rootScopeData.pendingActivitiesServiceRequestObject.reason ? this.rootScopeData.pendingActivitiesServiceRequestObject.reason : '--' , y:125},
    { type: 'text', value:this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount ? this.rootScopeData.pendingActivitiesServiceRequestObject.linkAccount : '--' , y:135},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_ADDITIONAL_ACCOUNT_REJECTED'), y:155},
    
  ]

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-AdditionalAccount.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-AdditionalAccount.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.router.navigate(['/mytask/serviceRequest/additionalAccount'])
}
}
