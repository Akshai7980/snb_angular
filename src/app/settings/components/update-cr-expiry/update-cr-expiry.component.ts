import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CommonService } from 'src/app/common-components/services/common.service';
@Component({
  selector: 'app-update-cr-expiry',
  templateUrl: './update-cr-expiry.component.html',
  styleUrls: ['./update-cr-expiry.component.scss']
})
export class UpdateCrExpiryComponent implements OnInit {
  isLoadingCompelete = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  showAuthorization: boolean = false;
  autherizationDetailsObj: any;
  secAuthRef: any;
  otpError: string = '';
  userOtpValue: any;
  showAuthentication: boolean = false;
  authListArray: any;
  authError = "";
  initReqParam = {
    accNo: "",
    amt: "",
    pdroductCode: "",
    subPrdCode: "",
    cif: "",
    unitId: "",
    ccy: ""
  }
  url:string='';
  showReceipt:boolean = false;
  receiptData: any;
  crList: any;
  pdfData:any;
  refNo:any;
  cifNo : any;
  authType: any;
 checkFlexiAuth : boolean = false;
  constructor(private settingService: SettingsService,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf,private commonService:CommonService) { }

  ngOnInit(): void {
    this.crExpiryComponent();
  }
  crExpiryComponent(){
    this.isLoadingCompelete=false
    this.settingService.crExpiryDetails().subscribe((response:any)=>{
      this.isLoadingCompelete=true
      if(response && response.data){
        this.crList=response.data;
    }
  },error=>{
    this.isLoadingCompelete=true;
    this.rootScopeData.showSystemError = true;
 })
  }
  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onClickSubmit();
    } else {
      this.userOtpValue = "";
    }
  }
  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount: "0",
      debitUnitId : this.rootScopeData.userInfo.UNIT_ID,
      debitCifNo: this.cifNo && this.cifNo.cifNo ? this.cifNo.cifNo : "",
      debitPortalAccNo: this.cifNo && this.cifNo.cifNo ? this.cifNo.cifNo : "",
      debitCurrencyCode: "",
      beneCurrencyCode: "",
      paymentCurrency: "SAR",
      subProduct: "UPDCREX",
      functionCode: "UPCRFNC",
      productCode:"CUSER"
    }

    this.commonService.selfAuthCheck(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        if (response.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        else{
          this.showAuthentication = false;
        }

        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.checkFlexiAuth = true;
          this.authListArray = response.data.authList;
        }
        else{
         this.checkFlexiAuth =  this.showAuthorization = false;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }
  onClickProceed() {
     this.checkFlexiAuth =  this.showAuthorization = true;
      this.checkSecfactorAuth();
  }
  onClickCancel(){
  this.checkFlexiAuth =  this.showAuthentication =  this.showAuthorization=false;
  }
  onClickSubmit() {
    let isOtpValid = true;
    if (this.showAuthentication) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        isOtpValid = false;
        return;
      }
    }
    if (isOtpValid) {
      this.isLoadingCompelete = false;
      let day=new Date().getDate();
      let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
      let year=new Date().getFullYear()
      let date=day+"/"+month+"/"+year
      let param={
        PARAM1: this.userOtpValue ? this.userOtpValue : "",
        PARAM2: this.secAuthRef ? this.secAuthRef : "",
        PARSED_RULE_ID: this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                    ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID
                    : '',
    	  SELECTION_FLAG: this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover ? 'Y' : '',
        INPUT_VALUE_DATE : date,
        CIF_NO: this.cifNo && this.cifNo.cifNo ? this.cifNo.cifNo : "",
        CIF_NAME: this.cifNo && this.cifNo.cfName ? this.cifNo.cfName : "",
        CR_NUM: this.cifNo && this.cifNo.crNo ? this.cifNo.crNo : "",
        EXP_DATE: this.cifNo && this.cifNo.expiryDate ? this.cifNo.expiryDate : "",
        AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      };
      // this.showAuthorization = false;
      // this.showAuthentication = false;
      this.settingService.submitCrExpiryApi(param).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response) {
          if (response.dataValue && response.dataValue.OD_STATUS_DESC === "Failed") {
            this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          } else {
            this.showAuthorization = false;
            this.showAuthentication = false;
            this.rootScopeData.changeHeading = "";
            this.refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.constructReceiptData(this.refNo);
            this.clearAuthData();
            this.showReceipt = true;
          }
        } else {
          this.isLoadingCompelete = true;
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      })
    }
  }
  clearAuthData() {
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }
  constructReceiptData(refNo: any) {
    let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": approver
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": approverNote
        }
      ]
    }
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_NATIONAL_ADDRESS_MSG",
      "referenceNumber": refNo,
      "receiptDetails": [
        {
          "title": "LBL_CIF_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_CIF",
              "dataKey": this.cifNo.cifNo
            },
            {
              "dispKey": "LBL_CIF_NAME",
              "dataKey": this.cifNo.cfName
            },
            {
              "dispKey": "LBL_CR_NUMBER",
              "dataKey": this.cifNo.crNo
            }
          ]
        },
        {
          "title": "",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_EXPIRATION_DATE",
              "dataKey": this.cifNo.expiryDate
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
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };
    this.showReceipt = true;

    if (approver && this.checkFlexiAuth) {
      this.receiptData.receiptDetails.push(flexiAuth);
    }
  }
  downloadPdf()
      { 
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_UPDATE_CR_EXPIRY_RECEIPT_PDF_TITLE'), x:75, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type: 'heading', value:this.translateService.instant('LBL_CIF_DETAILS'), y:65},
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_CIF'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_CIF_NAME'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_CR_NUMBER'), y:95},
        { type: 'heading', value:this.translateService.instant('LBL_EXPIRATION_DATE'), y:105},
        { type: 'text', value:this.cifNo.cifNo ? this.cifNo.cifNo : '', y:75},
        { type: 'text', value:this.cifNo.cfName ? this.cifNo.cfName : '', y:85},
        { type: 'text', value:this.cifNo.crNo ? this.cifNo.crNo : '', y:95},
        { type: 'text', value: this.cifNo.expiryDate ? this.cifNo.expiryDate : '', y:105},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.refNo ? this.refNo : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ADDRESS_MSG'), y:125},

      ]
      
        this.pdfData.push(
          { type: 'save', value:'UpdateCRExpiryDate.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);

  }
  checkCifValidate(event: any){
    if(this.cifNo &&  this.cifNo.expiryFlag == 'Y'){
      this.showAuthorization = false;
      this.showAuthentication = false;
    }
    if(this.cifNo.crNo) {
      this.getExpiryDateWithCRNum();
    }
  }

  getExpiryDateWithCRNum(){
    let param = {
      crNo : this.cifNo.crNo,
      UNIT_ID : this.rootScopeData.userInfo.UNIT_ID
    }
    this.settingService.getExpiryDateCRExpiry(param).subscribe((res : any) => {
      if(res && res.data && res.data.CrInformation){
          let obj = res.data.CrInformation;
          this.cifNo.expiryDate = obj.expiredDate;
      }
    });
  }
  getAuthType(val: any) {
    this.authType = val
  }
}


