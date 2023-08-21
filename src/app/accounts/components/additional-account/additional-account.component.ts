import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-additional-account',
  templateUrl: './additional-account.component.html',
  styleUrls: ['./additional-account.component.scss'],
})
export class AdditionalAccountComponent implements OnInit {
  sectionTitle: string = '';
  receiptData: any = {};
  isLoadingCompelete: boolean = true;
  showReviewSection: boolean = false;
  showReceipt: boolean = false;
  additionalAccountData: any = {};
  isUpload: boolean = true;
  authName: any;
  authNote: any;
  hideInitiateButton: boolean = true;
  otpError: string = '';
  authData: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  ChannelId:any;
  saveReceiptObject: any;
  pdfData: any;
  refNo: any;

  constructor(public accountService: AccountDetailsService,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) {}

  ngOnInit(): void {
    this.sectionTitle = 'LBL_ADDITIONAL_ACCOUNT';
    this.ChannelId = "web";
  }

  getAccountDataEmit(event: any) {
    this.sectionTitle = 'LBL_REVIEW';

    this.additionalAccountData = event;
    this.showReviewSection = event.canProceed;
    this.isUpload = !event.canProceed;
  }

  backToform(event: any) {
    this.showReviewSection = !event;
    this.isUpload = event;
  }

  getClickEmit(event: any) {
    this.authData = event;

    this.submitfn();
  }

  submitfn() {
    const params = {
      PARAM2: this.authData.param2,
      PARAM1: this.authData.param1,
      SEL_PARSED_RULE_ID: this.authData.PARSED_RULE_ID,
      SELECTION_FLAG: this.authData.SELECTION_FLAG,
      USER_NUMBER_LIST: `${this.rootScopeData?.userInfo.userNo}%${this.rootScopeData?.userInfo.USER_TYPE}`,
      sefAuthFlag: this.authData.sefAuthFlag,
      currency: this.additionalAccountData.currency,
      reason: this.additionalAccountData.reason,
      linkAccount: this.additionalAccountData.account.OD_ACC_NO,
      CIF_NUM: this.additionalAccountData.CIF_NUM,
      currencyDesc : this.additionalAccountData.currency_DESC,
      reasonId : this.additionalAccountData.reasonId,
      authType : this.authData.authType
    };
    this.isLoadingCompelete = false;
    this.accountService.addAccSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        if (
          res &&
          res.dataValue &&
          res.dataValue.OD_STATUS_DESC === 'Success'
        ) {
          this.showReceipt = true;
          this.showReviewSection = false;
          this.otpError ='';
          this.refNo = res.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO, res.dataValue);
        } else {
          this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          this.isLoadingCompelete = true;
        }
        // else if(res && res.dataValue && res.dataValue.OD_STATUS_DESC === "Failure"){
        //   this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        // }else{
        //   this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        // }
      },
      error => {
        this.isLoadingCompelete = true;
        this.showReceipt = false;
      }
    );
  }

  constructReceiptData(referenceNo: string, data: any) {
    let flexiAuth = 
    {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey: this.authData.authName,
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey: this.authData.authNote,
        },
      ],
    }
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_ADDITIONAL_ACCOUNT_REQ_IS_INT_SUCCESS',   
      showCallBackComponent: false,
      referenceNumber: referenceNo,
      receiptDetails: [
        {
          title: 'LBL_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_CURRENCY',
              dataKey: this.additionalAccountData.currency_DESC,
            },
            {
              dispKey: 'LBL_REASON',
              dataKey: this.additionalAccountData.reason,
            },
            {
              dispKey: 'LBL_LINK_ACCOUNT',
              dataKey: this.additionalAccountData.account.OD_ACC_NO,
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

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if(this.authData.showAuthField){
      this.receiptData.receiptDetails.push(flexiAuth)
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REQ_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ADDITIONAL_ACCOUNT_REQ_IS_INT_SUCCESS"),
      "keyValues": [
        {
          "subHead": "Details",
          "subValue": ""
        },
        {
          "subHead": "Currency",
          "subValue": this.additionalAccountData.currency_DESC ? this.additionalAccountData.currency_DESC : "--"
        },
        {
          "subHead": "Reason",
          "subValue": this.additionalAccountData.reason ? this.additionalAccountData.reason : "--"
        },
        {
          "subHead": "Link Account",
          "subValue": this.additionalAccountData.account.OD_ACC_NO ? this.additionalAccountData.account.OD_ACC_NO : "--"
        }
      ],
      "pagecall":"additionalaccount",
      "refNo":referenceNo
    }
  }

  downloadPdf(values:any)
      { 
        let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_ADDITIONAL_ACCOUNT_RECEIPT'), x:80, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_CURRENCY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_REASON'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_LINK_ACCOUNT'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'text', value:this.additionalAccountData.currency_DESC ? this.additionalAccountData.currency_DESC : '', y:75},
        { type: 'text', value:this.additionalAccountData.reason ? this.additionalAccountData.reason : '', y:85},
        { type: 'text', value:this.additionalAccountData.account ? this.additionalAccountData.account : '', y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value:this.refNo ? this.refNo : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_ADDITIONAL_ACCOUNT_REQ_IS_INT_SUCCESS'), y:125},
        
      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'additionalAccount.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'additionalAccount.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
     
  
  }
}
