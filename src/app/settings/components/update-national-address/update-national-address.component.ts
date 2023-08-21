import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { omit_special_char } from 'src/app/utility/common-utility';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CommonService } from 'src/app/common-components/services/common.service';
@Component({
  selector: 'app-update-national-address',
  templateUrl: './update-national-address.component.html',
  styleUrls: ['./update-national-address.component.scss']
})
export class UpdateNationalAddressComponent implements OnInit {
  isLoadingCompelete=false;
  cifList:any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  cifObj:any;
  cifErr:any;
  cifNextFlag:boolean=false;
  clearFlag=false;
  cifData=''
  showAuthorization:boolean=false;
  autherizationDetailsObj: any;
  secAuthRef: any;
  otpError: string='';
  userOtpValue: any;
  showAuthentication: boolean=true;
  showStreetErr: boolean=false;
  authListArray: any;
  newAddress:any;
  cif:any;
  pdfData:any;
  refNo:any;
  authError = "";
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    ccy:""
  } 
  url:string='';
  showReceipt=false
  receiptData: any;
  streetErr:any;
  streetEnterValidAddressErr:boolean = false;
  streetAlreadyAddressExistErr:boolean = false;
  street:any
  detailsObj:any;
  review : boolean =false
  oldStreetAddress:any
  districtErr : boolean = false;
  nationalAddressStreet:any;
  updateBtnAction = true;
  businessAdrObj : any;
  authType: any;
  selectedUpdateBtn: any;
  disabledDistrict: boolean=false;
  disabledStreet: boolean=false;
  constructor(private settingService:SettingsService,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf,private commonService:CommonService) { }

  ngOnInit(): void {
    this.nationalAddressDetails();
  }
  nationalAddressDetails(){
    this.isLoadingCompelete=false
    this.settingService.nationalAddressApi().subscribe((response:any)=>{
      this.isLoadingCompelete=true
      if(response && response.dataValue && response.dataValue.length >0){
          this.cifList=response.dataValue
      }
    },error=>{
      this.isLoadingCompelete=true;
      this.rootScopeData.showSystemError = true;
    })
  }
  updatedNationalAddressDetails(){
    this.isLoadingCompelete=false;
    let reqObj = {
      cifId : this.cifObj && this.cifObj.cifNo ? this.cifObj.cifNo : "",
      unitId : this.cifObj && this.cifObj.unitId ? this.cifObj.unitId : ""
    }
    this.settingService.getNationalAddressDetails(reqObj).subscribe((response:any)=>{
      this.isLoadingCompelete = true;   
      if(response && response.dataValue){
        this.detailsObj=response.dataValue;
        this.updateBtnAction = false;
        this.nationalAddressStreet = this.detailsObj ? this.detailsObj.street : '';
        this.disabledDistrict =  this.detailsObj.district ? true : false;
        this.disabledStreet = this.detailsObj.street ? true : false;
      }
      else{
        this.updateBtnAction = true;
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
    })
  }
  setData(value:any){
    this.cifObj=value;
    
    this.updatedNationalAddressDetails();
    this.getBusinessAddress();
    this.streetAlreadyAddressExistErr=false;
    this.streetEnterValidAddressErr=false;
  }
  engOly(event:any){
    return (omit_special_char(event))
  }
  onClickCancel(){
    //this.cifObj.streetName = this.street;
    this.cifObj="";
    this.detailsObj="";
    this.cifData='';
    this.nationalAddressStreet='';
    this.showAuthorization=false;
    this.review=false;
    this.businessAdrObj =''
  }
  onClickUpdate(data:any){
    this.selectedUpdateBtn = data;
    // if(!this.detailsObj.district){
    //   this.districtErr = true;
    //   return;
    // }
    // else {
    //   this.districtErr = false;
    // }
    // debugger;
    if(!this.nationalAddressStreet || this.nationalAddressStreet.length > 20){
      this.showStreetErr=true;
      this.streetEnterValidAddressErr=true;
      return;
    }
    else{
      this.showStreetErr=false;
      this.streetEnterValidAddressErr=false;
    }

    if(!this.detailsObj.district){
      this.districtErr=true;
      return;
    }
    else{
      this.districtErr=false;
    }

    // if(!this.streetErr && (this.detailsObj.street).trim() !== (this.cifObj.streetName).trim() && !this.showStreetErr ){
    if(!this.streetEnterValidAddressErr && !this.districtErr){
      // this.showAuthorization=true;
      // this.showAuthentication=true;
      this.review=true;
      this.rootScopeData.changeHeading = "Review";
      this.updateBtnAction = false;
      this.checkSecfactorAuth()
    }
    // else if(this.detailsObj.street === this.nationalAddressStreet){
    //   this.showStreetErr=true;
    //   this.streetEnterValidAddressErr=false;
    //   this.streetAlreadyAddressExistErr=true;
    //   this.updateBtnAction = true;
    // }
    else{
      this.showStreetErr=true;
      this.streetAlreadyAddressExistErr=false;
      this.streetEnterValidAddressErr=true;
    }
  }
  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onClickSubmit();
    }else{
      this.userOtpValue = "";
    }
  }
  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount:"0",
      debitUnitId : this.cifObj && this.cifObj.unitId ? this.cifObj.unitId : "",
      debitCifNo: this.cifObj && this.cifObj.cifNo ? this.cifObj.cifNo : "", 
      debitPortalAccNo:"",
      debitCurrencyCode:"",
      beneCurrencyCode:"",
      paymentCurrency:"SAR",
      subProduct:"UPNATAD",
      functionCode:"UPNTFNC",
      productCode:"CUSER"
    }
    this.commonService.selfAuthCheck(reqObj).subscribe((response: any) => {
        if(response){
          this.isLoadingCompelete = true;
          if (response.data.selfAuth == "true") {
            this.showAuthentication = true;
          }
          if (response.data.flexiAuth == "true") {
            this.showAuthorization = true;
            this.authListArray = response.data.authList;
          }
        }
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  validatedistrict(event:any){
let distName = event.target.value;

if(distName.trim()){
  this.districtErr=false;
 }
 else{
  this.districtErr=true;
 }
  }


  validate(event:any){
   let streetName = event.target.value;

   if(streetName.trim()){
    this.showStreetErr=false;
    this.streetEnterValidAddressErr = false
   }
   else{
    this.showStreetErr=true;
    this.streetEnterValidAddressErr = true
   }
   

      // if(this.detailsObj.street === streetName.trim()){
      //   this.showStreetErr=true;
      //   this.streetAlreadyAddressExistErr=true; 
      //   this.streetEnterValidAddressErr=false;   
      //   this.updateBtnAction = true;  
      // }else if(!this.detailsObj.street){
      //   this.showStreetErr=true;
      //   this.streetAlreadyAddressExistErr=false;
      //   this.cif = this.cifObj.cifNo;
      //   this.streetEnterValidAddressErr=true;
      //   this.updateBtnAction = false;
      // }
      // else{
      //   this.streetAlreadyAddressExistErr=false;
      //   this.streetEnterValidAddressErr=false;
      //   this.showStreetErr=false;
      //   this.updateBtnAction = false;
        
      // }    
    
  }
  onClickSubmit(){
    let isOtpValid = true;
    if (this.showAuthentication ) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        isOtpValid = false;
        return;
      }
    }
     if(isOtpValid){
      this.isLoadingCompelete=false;
      let day=new Date().getDate();
      let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
      let year=new Date().getFullYear()
      let date=day+"/"+month+"/"+year
      let param = {
        PARAM1 : this.userOtpValue ? this.userOtpValue : "",
        PARAM2 : this.secAuthRef ? this.secAuthRef : "",
        UNIT_ID : this.cifObj && this.cifObj.unitId ? this.cifObj.unitId : "",
        INPUT_CIF_NO : this.cifObj && this.cifObj.cifNo ? this.cifObj.cifNo : "",
        BUILDNO : this.detailsObj && this.detailsObj.basicNumber ? this.detailsObj.basicNumber : "",
        STREET_NAME : this.nationalAddressStreet ? this.nationalAddressStreet : "",
        DIST_NAME : this.detailsObj && this.detailsObj.district ? this.detailsObj.district : "",
        CITY : this.detailsObj && this.detailsObj.cityNameEnglish ? this.detailsObj.cityNameEnglish : "",
        ZIP_CODE : this.detailsObj && this.detailsObj.postCode ? this.detailsObj.postCode : "",
        COUNTRY : this.cifObj && this.cifObj.country ? this.cifObj.country : "",
        COUNTRY_NAME : this.detailsObj && this.detailsObj.countryOfBirth ? this.detailsObj.countryOfBirth : "",
        PARSED_RULE_ID:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                    ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID
                    : '',
    	  SELECTION_FLAG:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover ? 'Y' : '',
        INPUT_VALUE_DATE : date,
        AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': '',
        pageType:this.selectedUpdateBtn === "saveAllCif" ? "A" : "S"
      }
      // this.showAuthorization = false;
      // this.showAuthentication = false;
      this.settingService.submiNationalApi(param).subscribe((response:any)=>{
        this.isLoadingCompelete = true;    
        if(response){
          if(response.dataValue && response.dataValue.OD_STATUS_DESC === "Failed"){
            this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          }else {
            this.showAuthorization = false;
            this.showAuthentication = false;
            this.rootScopeData.changeHeading = "";
            this.refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.constructReceiptData(this.refNo);
            this.clearAuthData();
            this.showReceipt= true;
          }
        }else{
          this.isLoadingCompelete = true;    
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
          this.review = true;
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
        this.review = true;
      })
    }
  }
  clearAuthData() {
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
    
  }
    constructReceiptData(refNo:any){
      
      let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
      let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
      this.newAddress = this.detailsObj.basicNumber +", "+ this.detailsObj.street +", "+ this.detailsObj.district+", "+ this.detailsObj.cityNameEnglish;
      let address =[];
      address.push({address:this.newAddress})
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
        "msg1": "LBL_REQUEST_SUCCSFL",
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
                "dataKey": this.cifObj.cifNo
              },
              {
                "dispKey": "LBL_OLD_STREET",
                "dataKey": this.cifObj.streetName
              },
              {
                "dispKey": "LBL_NEW_STREET",
                "dataKey": this.detailsObj.street
              }
            ]
          },
          {
            "title": "",
            "isTable": "true",
            "data": address,
            "fieldDetails": [
              {
                "dispKey": "LBL_NEW_NAT_ADDRESS",
                "dataKey": "address"
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
      if (approver && this.review) {
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
        { type: 'title', value:this.translateService.instant('LBL_NATIONAL_ADDRESS_RECEIPT_PDF_TITLE'), x:75, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_OLD_STREET'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_NEW_STREET'), y:95},
        { type: 'heading', value:this.translateService.instant('LBL_NEW_NAT_ADDRESS'), y:105},
        { type: 'text', value:this.cifObj.cifNo ? this.cifObj.cifNo : '', y:75},
        { type: 'text', value:this.cifObj.streetName ? this.cifObj.streetName : '', y:85},
        { type: 'text', value:this.detailsObj.street ? this.detailsObj.street : '', y:95},
        { type: 'text', value: this.newAddress ? this.newAddress : '', y:105},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.refNo ? this.refNo : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ADDRESS_MSG'), y:125},

      ]
      
        this.pdfData.push(
          { type: 'save', value:'UpdateNationalAddress.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);

  }

  getBusinessAddress(){
    this.isLoadingCompelete = false;
    let param = {
      cifNo : this.cifObj && this.cifObj.cifNo ? this.cifObj.cifNo : "",
      UNIT_ID : this.cifObj && this.cifObj.unitId ? this.cifObj.unitId : ""
    }

    this.settingService.getNatBusinessAddr(param).subscribe((res : any) => {
      this.isLoadingCompelete = true;
      if(res && res.dataValue) {
        this.businessAdrObj = res.dataValue;
      }
      else{
        this.businessAdrObj = '';
      }
    },error => {
        this.isLoadingCompelete = true;
      //  this.rootScopeData.showSystemError = true;
       // this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
       // console.log("err", error);
        this.businessAdrObj = '';
      });
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
