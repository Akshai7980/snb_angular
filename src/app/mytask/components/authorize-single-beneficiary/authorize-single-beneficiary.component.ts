import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-single-beneficiary',
  templateUrl: './authorize-single-beneficiary.component.html',
  styleUrls: ['./authorize-single-beneficiary.component.scss']
})
export class AuthorizeSingleBeneficiaryComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  contactDetails:any;
  authDataObj: any;
  showAuthorization: boolean = false;
  sefAuthFlag: any;
  authOptions: any;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private myTaskService:MyTaskService,private location: Location,private route: Router,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.singleBeneficiaryDetailsObject;
    this.checkAuthorization();
  }
  onClickSubmit(){
    let selectedRecords = [{
      "TXN_REF_NUM": this.details.parentValues.odRefNo,
      "PRODUCT": "PAYMNT",
      "SUB_PRODUCT": "BENE",
      "ACTION": "CRBENE",
      "INPUT_HOST_CODE": "BENPRO",
      "INPUT_VER_NO": "1"
    }]  // Phani

    let params={
      accNumber:this.details.childValues.accountNo,
      refNumber:this.details.parentValues.odRefNo,
      subProductCode:this.details.childValues.subProduct,
      beneId:this.details.parentValues.beneId,
      beneName:this.details.parentValues.beneNme,
      aliasName:this.details.parentValues.alliasName,
      authRef: "",
      otp: "",
      selectedRec : selectedRecords,
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.OD_RULE_PARSE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      USER_NUMBER_LIST: this.authDataObj && this.authDataObj.selectedAprover
      ? this.authDataObj.selectedAprover.OD_USER_NO
      : '',
      remarks: !this.authDataObj ? '' : !this.authDataObj.aproveNote ? '':this.authDataObj.aproveNote
    }
    // if(!this.userOtpValue || this.userOtpValue.length !== 4){
    //   this.isOtpValid = "LBL_PLS_ENTER_OTP";
    //   return;
    // }else {
    //   // params.authRef = this.secAuthRef;
    //   // params.otp = this.userOtpValue;
    //   //sending empty value for otp and auth reference num
    //   params.authRef = '';
    //   params.otp = '';
    // }
      this.isLoadingCompelete = false;
      this.myTaskService.authorizeBeneficiaryAPICall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;
          let vdata:any = [];
          vdata = response;          
          if(vdata.dataValue.STATUS === "Success"){
            this.constructReceiptData(params.refNumber);
            this.refNo = params.refNumber;
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }
  constructReceiptData(refNumber: any) {
    let beneficiaryDetails={
     nickName:this.details.parentValues.beneId,
     accNumber:this.details.childValues.accountNo,
     transferType : this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_product
    }
    this.contactDetails={
      "title": "LBL_CONTACT_DETAILS",
      "isTable": "false",
      "data": this.details,
      "fieldDetails":
      [
      {
        "dispKey": "LBL_COUNTRY",
        "dataKey": this.details.parentValues.beneCountry
      },
      {
        "dispKey": "LBL_CITY",
        "dataKey": this.details.parentValues.beneCity
      },
      {
        "dispKey": "LBL_STATE",
        "dataKey": this.details.parentValues.addLine3
      },
      {
        "dispKey": "LBL_ADDRESS",
        "dataKey": this.details.parentValues.addLine1
      },
      {
        "dispKey": "LBL_POSTAL_CODE",
        "dataKey": this.details.parentValues.mailAdd
      },
      {
        "dispKey": "LBL_PHONE",
        "dataKey": this.details.parentValues.pneNo
      }
    ]
  }

  
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_BENEFICIARY_APPROVED",
      "referenceNumber":refNumber,
      "authorizeButtonRouterPath":"/mytask/serviceRequest",
      "finishButtonRouterPath":"/dashboard",
      "receiptDetails": [
        {
            "title": "LBL_BENEFICIARY_DETAILS",
            "isTable": "false",
            "data": beneficiaryDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_NICKNAME",
                "dataKey": beneficiaryDetails.nickName
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": beneficiaryDetails.accNumber
              },
              {
                  "dispKey": "LBL_TRANSFER_TYPE",
                  "dataKey": beneficiaryDetails.transferType
              }
            ]
        },
        {
          "title": 'LBL_AUTHORIZATION',
          "isTable": 'false',
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_Next_Approver",
              "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.authDataObj.selectedAprover.AUTH_NAME
            },
            {
              "dispKey": "LBL_ADD_NEXT_APROVER",
              "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.aproveNote ? 'Not Provided':this.authDataObj.aproveNote
            },
          ],
        },
      ],
        "printButton":{
              "buttonLabel":"LBL_PRINT_RECEIPT",
              "buttonIcon":"./assets/images/PrinterIcon.png"
          },
        "saveButton":{
              "buttonLabel":"LBL_SAVE_RECEIPT",
              "buttonIcon":"./assets/images/saveReceipt.svg"
          },
        "initiateButton":{
              "buttonLabel":"LBL_MAKE_ANOTHER_AUTHORIZATION"
          },
        "finishButton":{
              "buttonLabel":"LBL_FINISH",
              "buttonPath":"/dashboard"
    }
    };
    if(this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.showContactDetailsFlag){
      this.receiptData.receiptDetails.push(this.contactDetails)
    }

    if(this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.showContactDetailsFlag){
      this.saveReceiptObject = {
        "pageheading": this.translateService.instant("LBL_AUTHORIZE_SINGLE_BENEFICIARY"),
        "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
        "Description": this.translateService.instant("LBL_BENEFICIARY_APPROVED"),
        "keyValues": [
          {
            "subHead": "Beneficiary Details",
            "subValue": ""
          },
          {
            "subHead": "Account Number",
            "subValue": beneficiaryDetails.accNumber ? beneficiaryDetails.accNumber : "--"
          },
          {
            "subHead": "Short Name",
            "subValue": beneficiaryDetails.nickName ? beneficiaryDetails.nickName : "--"
          },
          {
            "subHead": "Currency",
            "subValue": beneficiaryDetails.transferType ? beneficiaryDetails.transferType : "--"
          },
          {
            "subHead": "Contact Details",
            "subValue": ""
          },
          {
            "subHead": "Country",
            "subValue": this.details.parentValues.beneCountry ? this.details.parentValues.beneCountry : "--"
          },
          {
            "subHead": "City",
            "subValue": this.details.parentValues.beneCity ? this.details.parentValues.beneCity : "--"
          },
          {
            "subHead": "State",
            "subValue": this.details.parentValues.addLine3 ? this.details.parentValues.addLine3 : "--"
          },
          {
            "subHead": "Address",
            "subValue": this.details.parentValues.addLine1 ? this.details.parentValues.addLine1 : "--"
          },
          {
            "subHead": "Postal Code",
            "subValue": this.details.parentValues.mailAdd ? this.details.parentValues.mailAdd : "--"
          },
          {
            "subHead": "Phone",
            "subValue": this.details.parentValues.pneNo ? this.details.parentValues.pneNo : "--"
          }
        ],
        "pagecall":"beneficiary",
        "refNo":refNumber
      }
    }else{
      this.saveReceiptObject = {
        "pageheading": this.translateService.instant("LBL_AUTHORIZE_SINGLE_BENEFICIARY"),
        "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
        "Description": this.translateService.instant("LBL_BENEFICIARY_APPROVED"),
        "keyValues": [
          {
            "subHead": "Beneficiary Details",
            "subValue": ""
          },
          {
            "subHead": "Account Number",
            "subValue": beneficiaryDetails.accNumber ? beneficiaryDetails.accNumber : "--"
          },
          {
            "subHead": "Short Name",
            "subValue": beneficiaryDetails.nickName ? beneficiaryDetails.nickName : "--"
          },
          {
            "subHead": "Currency",
            "subValue": beneficiaryDetails.transferType ? beneficiaryDetails.transferType : "--"
          }
        ],
        "pagecall":"beneficiary",
        "refNo":refNumber
      }
    }
  }
  
  onBackArrowClick(){
    this.location.back();
  }
  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    this.userOtpValue = otpValue;
  }

  initiateAnotherRequest(){
    this.route.navigate(['/mytask/beneficiary/singlefile'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    var BeneData = this.rootScopeData.singleBeneficiaryDetailsObject.childValues
    let data = {
      gcif: "",  //
      cif: BeneData.cifValues,
      productCode: BeneData.product,
      subProdCode: BeneData.subProduct,
      funcCode: this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.functionCode,
      amount: 0,  //
      accNo: BeneData.accountNo,
      pymntCurrency: "",  //
      debitCurrency: "",  //
      referenceNo:this.rootScopeData.singleBeneficiaryDetailsObject.parentValues.odRefNo
    }
    this.myTaskService.checkAuthorizationData(data).subscribe((res)=>{

      if (res) {
        this.sefAuthFlag = res.data.selfAuth
        if (res.data.flexiAuth === "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        // this.isLoadingCompelete = true;
      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
  }


  downloadPdf(values:any)
      { 
      let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_SINGLE_BENEFICIARY"), x:80, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSFER_TYPE'), y:95},
        { type: 'text', value:this.details.parentValues.beneId ? this.details.parentValues.beneId : '', y:75},
        { type: 'text', value:this.details.childValues.accountNo? this.details.childValues.accountNo : '', y:85},
        { type: 'text', value:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_product? this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_product : '', y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.refNo? this.refNo : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_APPROVED'), y:125},
        
      ]
      

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'Authorize-SingleBeneficiary.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'Authorize-SingleBeneficiary.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  cancel(){
    this.route.navigate(['/mytask/beneficiary/singlefile'])
  }
}

