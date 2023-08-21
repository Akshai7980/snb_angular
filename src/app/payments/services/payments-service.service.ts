import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsServiceService {

  constructor(public http:HttpClient) { }

  getCountry(params:any){
    let getAllCountryData = {
      "headerValue": {
        "moduleId": params.moduleId,
        "simulate": `N`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": params.unitId,
        "beneType": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/IFTBeneCountry.json');
     }else{
     return this.http.post(`${environment.restAPI}`,getAllCountryData)
     }
    //return this.http.get('./assets/simulateAPI/TWBBeneCountry.json')
    // return this.http.get('./assets/simulateAPI/IFTBeneCountry.json')
    // return this.http.post(`${environment.restAPI}`,getAllCountryData);
  }

  validateAccountNumber(params:any){
   let reqData={
    "headerValue": {
      "moduleId": "VLDTEBENEACCNO",
      "simulate": "N"
    },
    "dataValue": {
      "userNo": "",
      "gcif": "",
      "sortColumn": "",
      "sortDirection": "",
      "fromRowNo": "0",
      "toRowNo": "45",
      "filterMap": [
        {
          "filterField": "",
          "filterConstraint": "contains",
          "filterValue": ""
        }
      ],
      "subPdt": "BENE",
      "funcCode": "CRBENE",
      "pdt": "PAYMNT",
      "beneType": "Account",
      "beneUnitId": params.unitId,
      "unitId": "IGTBSA",
      "beneId": "",//empty
      "acctCurr": params.currency,
      "beneAccNo": params.accNumber,
      "beneCnty": params.countryCode,
      "countryLkp":params.country,
      "ibanAcctNo": params.accNumber,
      "countryCode": params.countryCode,
      "country":params.country,
      "currency": params.currency,
      "unitDesc":params.country,
      "paymentMode": params.paymentMode,
      "domesticFlg": "Yes",
      "languageId": "en_US"
    },
    "footerValue": {}
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/validateAccNum.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }
  // return this.http.get(`http://localhost:4200/assets/simulateAPI/validateAccNum.json`);
  // return this.http.post(`${environment.restAPI}`, reqData)
  }

  validateShortName(params:any){
    let reqData={
      "headerValue": {
       "moduleId": "VALIDATEBENE",
       "simulate": "N"
      },
      "dataValue": {
       "userNo": "",
       "gcif": "",
       "sortColumn": "",
       "sortDirection": "",
       "fromRowNo": "0",
       "toRowNo": "45",
       "filterMap": [
        {
         "filterField": "",
         "filterConstraint": "contains",
         "filterValue": ""
        }
       ],
       "groupBy": "",
       "refNo": params.shortName,   //Nickname given by user
       "beneAccNo": params.accNumber,  //Account number given by user
       "beneBankName": "",
       "beneBankcd": "",
       "clrCode": "",
       "clrCodeDtl": "",
       "beneSwtAdd": "",
       "prodType": params.paymentValue,   //Constant Value to be sent for TWB
       "subProduct":params.paymentValue
      },
      "footerValue": {}
     }
     if(environment.localURL){
      return this.http.get('assets/simulateAPI/validateSortNameSuccess.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
     //return this.http.get(`http://localhost:4200/assets/simulateAPI/validateSortNameFailure.json`);
    // return this.http.get(`http://localhost:4200/assets/simulateAPI/validateSortNameSuccess.json`);
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  validateSwiftCode(swiftCode:any,countrycode:any,pageFlag:any){
    let reqData={
      headerValue: {
      moduleId: "PMNTSGETFLDDATA"
      },
      dataValue: {
      action: "SWIFT_VALIDATION",
      swiftCode: swiftCode,
      countryCode : countrycode,
      pageCall : pageFlag
      },
      footerValue: {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/validateSwiftCode.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get(`http://localhost:4200/assets/simulateAPI/validateSwiftCode.json`);
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getCurrency(params:any){
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "action": "GET_PAYMENT_CCY",
        "unitId": params.unitId,
        "paymentMode": params.paymentMode,
        "countryCode": params.countryCode,
        "cif": "",
        "pdt": "PAYMNT",
        "subPdt": params.paymentMode,
        "paymentType": ""
      },
      "footerValue": {}
    }
  	if(environment.localURL){
      return this.http.get('assets/simulateAPI/beneInternationalCurrency.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    //return this.http.get('/assets/simulateAPI/beneInternationalCurrency.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getsinglepymntsDtls(){
    return this.http.get('assets/simulateAPI/singlepayment.json')
  }

  submitPayment(params:any):Observable<any>{
    let reqData={
      "headerValue": {
        "moduleId": "BENESUBMIT",
        "simulate": `N`
      },
      "dataValue": {
    "INPUT_USER_NO": "",
    "INPUT_GCIF": "",
    "INPUT_ACTION": "LIB_CREATE",
    "PAGE_CODE_TYPE": "BENE_FORM",
    "PRODUCT_NAME": "PAYMNT",
    "INPUT_PRODUCT": "PAYMNT",
    "INPUT_SUB_PRODUCT": "BENE",
    "TYPE": "Confirm",
    "INPUT_FUNCTION_CODE": "CRBENE",
    "INPUT_CUST_TYPE": "C",
    "REFERENCE_NO": "",
    "INPUT_CONFIRMATION": "C",
    "INPUT_CHANNEL_ID": "3",
    "PAYMENT_VALUE": params.paymentValue,
    "BENE_COMBO": params.beneCombo,
    "BENE_ID": params.shortName,
    "BENE_NME": params.accName,
    "ADD_LINE_1": params.beneAddress,
    "ADD_LINE_2": params.beneCity,
    "ADD_LINE_11": "",
    "ADD_LINE_22": "",
    "ADD_LINE_3": params.beneState, //state
    "FX_NO": "",
    "PNE_NO": params.benePhoneNumber,
    "MAIL_ADD": "",
    "TAX_ID": "",
    "OD_REF_NO": "",
    "BANK_NAME1": params.bankName,
    "BANK_NAME3": params.bankName,
    "BRANCH_NAME2":  params.branchName,
    "BENE_ACCT_NO1": params.accNumber,
    "ACCOUNT_NO": params.accNumber,
    "ACCT_CURRENCY1": params.currency, //Change cxo
    "BENE_ACCT_NO": params.accNumber,
    "SWIFT_ADDR": params.swiftCode,
    "LOOKUPCUR1": params.currency, //Change cxo
    "BRANCH_NAME3":  params.branchName,
    "BENE_CNTY": params.country,
    "BANK_NAME2": params.bankName,
    "BRANCH_NAME": params.branchName,
    "LOOKUPCUR": params.currency, //Change cxo
    "BANK_NAME3_GEN": params.bankName,
    "BANK_NAME3_SPEC": params.bankName,
    "CITY_NAME_SPEC": "",
    "CITY_NAME_GEN": "",
    "COUNTRY_NAME": "",
    "CLEAR_CODE_DET2": params.clearingCode,
    "CLEAR_CODE_DET1": params.clearingCode,
    "IBAN_ACCT_NUMBER": params.accNumber,
    "SWIFT_ADDR1": params.swiftCode,
    "GENERIC_RADIO": "",
    "ADDITIONAL_INFO": "",
    "BRANCH_NAMEDD": "",
    "SWIFT_ADDRDD": params.swiftCode,
    "BANK_NAMEDD": "",
    "BENE_ACCT_NODD": "",
    "BENE_CNTYDD": "",
    "LOOKUPCURDD": "",
    "BRANCH_NAMEMC": "",
    "BENE_CNTYMC": "",
    "SWIFT_ADDRMC": params.swiftCode,
    "LOOKUPCURMC": "",
    "BANK_NAMEMC": "",
    "BENE_ACCT_NOMC": "",
    "ALIAS_NAME": params.shortName,
    "confFlag": "Y",
    "BENE_ACC_NO": "",
    "BENECY_BANK_NAME": "",
    "BENE_BRANCH_CITY": "",
    "BENECY_BRCH_NAME": "",
    "BENE_ACC_TYPE": "",
    "IFSC_CODE": "",
    "MAKER_ACTION": "",
    "COUNTRY_LKP": "",
    "COUNTRY_IFT_LKP": "",
    "UNIT_DESC": "",
    "UNIT_ID": "",
    "IBAN_ACCT_NO": params.accNumber,
    "BENE_CITY": params.beneCity,
    "BENE_COUNTRY": params.beneCountry,
    "CUST_SELECT": "",
    "CIF_FLAG": "",
    "CIF_VALUES_TEXT": "",
    "BENE_TYPE": "",
    "CARD_NUMBER": "",
    "CARD_NICK_NAME": "",
    "CARD_NAME": "",
    "CIF_VALUES": "",
    "BENE_UNIT_ID": "",
    "COUNTRY": params.beneCountry,
    "ACC_VALID_FLG": "Y",
    "PAYMENT_MODE": "",
    "COUNTRY_CODE": params.beneCountryCode,
    "FORM_NAME": "FORM_PYMNT_BENE_CRTTT",
    "CURRENCY": params.currency, //Change cxo
    "NEW_STATUS": "",
    "INPUT_TXN_STATUS": "",
    "INPUT_STATUS": "",

    "BANK_NAME2_PLA": "",
    "Address1": "",
    "BENE_ID_PLA": "",
    "BENE_NME_PLA": "",
    "BENE_TYPE_PL": "",
    "BRANCH_CODE": "",
    "EMAIL_ID_PLA": "",
    "IBAN_ACCT_NO_PLA": "",
    "SWIFT_HIDD": params.swiftCode,

    "ADD_LINE_1_SF": "",
    "ADD_LINE_3_SF": "",
    "BANK_CODE": "",
    "BANK_NAME": params.bankName,
    "BENE_BANK_CODE": "",
    "BENE_BANK_NAME": "",
    "BENE_NME_SF": "",
    "BENE_ID_SF": "",
    "CARD_NAME_SF": "",
    "COUNTRY_LKP_PLA": "",
    "COUNTRY_LKP_PLC": "",
    "COUNTRY_LKP_PLM": "",
    "COUNTRY_LKP_SF": "",
    "FORM_TYPE": "",
    "IBAN_ACCT_NO_SF": "",
    "SACCO_NAME": "",
    "SWIFT_CODE": params.swiftCode,

    "SELF_AUTH_ACTION": "",
    "accountFormdata":"",
    "beneficiaryFormData":"",
    "PARAM1": params.otp,
    "PARAM2": params.otpRef,
    "CIF_NO":params.cif_no,
    "INPUT_DEBIT_ACC_NO":params.inp_debit_acc_no,
    "INPUT_DEBIT_AMOUNT":params.inp_debit_amt,
    "INPUT_DEBIT_ORG_ACC_NO":params.inp_deb_org_acc_no,
    "INPUT_MODE":params.inp_mode,
    "OD_SUBPROD_CODE":params.od_subPrdt_code,
    "payAmt":params.pay_amt,
    "REQ_COUNTRY_CODE":params.req_cntry_code,
    "TRANSACTION_FLAG":params.trans_flag,
    "INPUT_VALUE_DATE":params.inp_value_date,
    },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/sadadPayment-submit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    //return this.http.get(`http://localhost:4200/assets/simulateAPI/beneSubmit.json`);
    // return this.http.post(`${environment.restAPI}`, reqData)
    // return this.http.get('/assets/simulateAPI/sadadPayment-submit.json')
  }

  getBeneficiaryInquiry(params:any,filterArray :any){

    let reqData = {
      "headerValue": {
          "moduleId": "CONTACTGALLARY",
          "simulate": "N",
      },
      "dataValue": {
          "userNo": "",
          "gcif": "",
          "sortColumn": params.sortcolumn,
          "sortDirection": params.sortDirection,
          "fromRowNo": params.fromRow,
          "toRowNo": params.toRow,
          "filterList": filterArray,
          "unitId": "",
          "groupBy": "",
          "languageId": "en_US",
          "filterFlag": params.flag,
          "subPdt":params.subProdCode
      },
      "footerValue": {}
  }
  //debugger;
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/beneficiaryInquiry.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }
  // return this.http.get(`http://localhost:4200/assets/simulateAPI/beneficiaryInquiry.json`);
  // return this.http.get('/assets/simulateAPI/error_500.json');
  // return this.http.post(`${environment.restAPI}`, reqData)
}

getSingleBeneficiaryDetails(beneId:any,subproduct:any){
  let reqData =
  {
    "headerValue": {
      "moduleId": "CONTACTGALLDET",
      "simulate": `${environment.isSimulate}`
    },
    "dataValue": {
      "userNo": "",
      "gcif": "",
      "sortColumn": "",
      "sortDirection": "",
      "fromRowNo": "0",
      "toRowNo": "45",
      "groupBy": "",
      "filterMap": [
        {
          "filterField": "",
          "filterConstraint": "contains",
          "filterValue": ""
        }
      ],
      "unitId": "",
      "beneId": beneId,
      "subPdtCode":subproduct
    },
    "footerValue": {}
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/singleBeneficiaryDetails.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }
  // return this.http.post(`${environment.restAPI}`,reqData)
  // return this.http.get('http://localhost:4200/assets/simulateAPI/singleBeneficiaryDetails.json');
}

deleteBeneficiaryAPiCall(data:any){
  let reqData = {
    "headerValue": {
      "moduleId": "BENEDELETE",
      "simulate": `${environment.isSimulate}`
    },
    "dataValue":{
      "INPUT_USER_NO": "",
      "INPUT_GCIF": "",
      "INPUT_ACTION": "LIB_DELETE",
      "INPUT_TXN_STATUS": "AO",
      "STATUS": "AO",
      "mode": "detail",
      "MAKER_ACTION": "DELETE",
      "__APPLICATION_VALIDATOR_VALIDATION_STYLE": "2",
       "__APPLICATION_VALIDATOR_VALIDATIONS_TO_SKIP": "1",
      "PAGE_CODE_TYPE": "BENE_FORM",
      "PRODUCT_NAME": "PAYMNT",
      "INPUT_PRODUCT": "PAYMNT",
      "INPUT_SUB_PRODUCT": "BENE",
      "REJECT_REASON": "",
      "TYPE": "Edit",
      "INPUT_FUNCTION_CODE": "CRBENE",
      "REQUEST_TYPE": "REAUTH_VALIDATE",
      "PARAM1": data.otp,
      "PARAM2": data.otpRef,
      "INPUT_CUST_TYPE": "C",
      "BENE_ACC_NO": data.accountNo,
      "REFERENCE_NO": data.refNo,
      "INPUT_CHANNEL_ID": "3",
      "PAYMENT_VALUE": data.subProductCode,
      "BENE_ID": data.beneId,
      "BENE_NME": data.beneName,
      "OD_REF_NO": data.refNo,
      "ALIAS_NAME": data.beneAliasName,
      "confFlag": "Y",
      "INPUT_CONFIRMATION": "C",
      "CIF_FLAG": "N",
      "PAYMENT_MODE": data.subProductCode,
      "IS_REAUTH_VALIDATED": "YES",
      "subPdtCode": data.subProductCode
    },
    "footerValue": {}
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/delete-record.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }
  //return this.http.get(`http://localhost:4200/assets/simulateAPI/delete-record.json`);
  // return this.http.post(`${environment.restAPI}`, reqData)
}

  /*Fund Transfer Starts*/
  getTransferTypeApiCall(){
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA"
      },
      "dataValue": {
        "action": "GET_USRENT_SUBPDT_PAY"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_TransactionType.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_TransactionType.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  //Unused
  getPaymentPurposeApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA"
      },
      "dataValue": {
        "action": "GET_PURP_TO_TRANSFER",
        "unitId": reqObj.debitUnitId,
        "paymentMode": "CRRNTS",
        "countryCode": "",
        "cif": "",
        "pdt": "PAYMNT",
        "subProduct": reqObj.subProduct,
        "paymentType": "",
        "bankName": "",

      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_PurposeofTransfer.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_PurposeofTransfer.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getPaymentDebitAccountApiCall(reqObj: any){
    let reqData = {
      "MODULE_ID": reqObj.moduleId,
      //"PREFERRED_CCY": "AED",
      //"OD_USER_NO": "",
      //"OD_GCIF": "",
      "BALANCE_REQUIRED": "N"
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_DebitLookup.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_DebitLookup.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getPaymentOwnBeneAccountApiCall(reqObj: any){
    let reqData = {
      "MODULE_ID": "OWNBENEACCLKP",
      //"PREFERRED_CCY": "AED",
      //"OD_USER_NO": "",
      //"OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "OD_ACC_NO": reqObj.debitCifNo,
      "cif": reqObj.debitCifNo
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_OwnBeneLookup.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_OwnBeneLookup.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getPaymentBeneAccountApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "BENEACCLKP"
      },
      "dataValue": {
        /*"userNo": "",
        "gcif": "",
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "groupBy": "",*/
        "productName": "PAYMNT",
        "subProductName": reqObj.subProduct,
        "functionCode": reqObj.functionCode,
        "unitId": reqObj.debitUnitId,
        "cif": reqObj.debitCifNo,
        "beneType": "Account",
        "accCcy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_BeneLookup.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_BeneLookup.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getDailyLimitApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "DAILYLIMIT"
      },
      "dataValue": {
        "availBal": reqObj.debitAvailableBalance,
        "reqCountry": reqObj.debitCountryCode,
        "unitId": reqObj.debitUnitId,
        "cif": reqObj.debitCifNo,
        "accCcy": reqObj.debitCurrencyCode,
        "valueDate": reqObj.valueDate,
        "accNo": reqObj.debitPortalAccNo,
        "portalAccNo": "",
        "productName": "PAYMNT",
        "subProductName": reqObj.subProduct,
        "functionCode": reqObj.functionCode
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_DailyLimit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_DailyLimit.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getCurrencyApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA"
      },
      "dataValue": {
        "action": "GET_PAYMENT_CCY",
        "unitId": reqObj.debitUnitId,
        "paymentMode": reqObj.subProduct,
        "countryCode": reqObj.debitCountryCode,
        "cif": reqObj.debitCifNo,
        "pdt": "PAYMNT",
        "subPdt": reqObj.subProduct,
        "paymentType": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_Currency.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_Currency.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getPurposeOfTransferApiCall(params:any){
    let reqData ={
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA"
      },
      "dataValue": {
        "action": "GET_PURP_TO_TRANSFER",
        "unitId": "IGTBSA",
        "languageId": "en_US",
        "paymentMode": params.functionCode,
        "countryCode": "SA",
        "cif": "3114",
        "pdt": "PAYMNT",
        "subProduct": params.subProduct,
        "paymentType": "",
        "bankName": ""
      },
        "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/purpose_payment.json').pipe(
        map((response: any) => ({
          headerValue: response?.headerValue,
          data: this.getGroupedCategories(response?.data)
         }))
      );
     }else{
      return this.http.post(`${environment.restAPI}`,reqData).pipe(
        map((response: any) => ({
          headerValue: response?.headerValue,
          data: this.getGroupedCategories(response?.data)
         }))
      );
     }
    // return this.http.get('/assets/simulateAPI/Payment_purpose.json'); // old
    // return this.http.get('/assets/simulateAPI/purpose_payment.json'); // new 3 levels
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getRelationshipApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "RELATIONSHIP"
      },
      "dataValue": {
        "unitId": reqObj.debitUnitId,
        "purposeCode": reqObj.purposeCode,
        "subPurposeCode": reqObj.subPurposeCode,
        "categoryCode": reqObj.categoryCode,
        "cif": "",
        "languageId": "en_US"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_Relationship.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_Relationship.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getRecipientBankApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "DFTBANKLOOKUP"
      },
      "dataValue": {
        "unitId": reqObj.debitUnitId,
        "countryCode":reqObj.debitCountryCode,
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_RecipientBank.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_RecipientBank.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getExchangeRateApiCall(reqObj: any){
//debugger;
    let reqData = {
      "headerValue": {
        "moduleId": "EXCHANGERATE"
      },
      "dataValue": {
        "accNo": reqObj.debitAccNo,
        "productCode": "PAYMNT",
        "subProdCode": reqObj.subProduct,
        "funcCode": reqObj.functionCode,
        "amount": reqObj.paymentAmount,
        "cmp": reqObj.transactionInputType,
        "action": "GETRATE",
        "cifNo": reqObj.debitCifNo,
        "unitID": reqObj.debitUnitId,
        "countryCode": reqObj.debitCountryCode,
        "dealRefNo": "",
        "product_processor": "default",
        "baseCurrency": "",
        "debitCurrency": reqObj.debitCurrencyCode,
        "debitorcredit": reqObj.transactionType,
        "pymntCurrency": reqObj.paymentCurrency
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_ExchangeRate.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_ExchangeRate.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  selfAuthCheck(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "SELFAUTHCHECK"
      },
      "dataValue": {
        //"userNo": "",
        //"gcif": "",
        "unitId": reqObj.debitUnitId,
        "cif": reqObj.debitCifNo,
        "productCode": "PAYMNT",
        "subProdCode": reqObj.subProduct,
        "funcCode": reqObj.functionCode,
        "amount": reqObj.paymentAmount,
        "accNo": reqObj.debitPortalAccNo,
        "pymntCurrency": reqObj.paymentCurrency,
        "debitCurrency":reqObj.debitCurrencyCode
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/secFactAuth.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/secFactAuth.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getChargesApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "GETFLDDATA"
      },
      "dataValue": {
        "action": "CHARGES_INFO",
        "amount": reqObj.paymentAmount,
        "unitId": reqObj.debitUnitId,
        "accCcy": reqObj.paymentCurrency,
        "debAccNo": reqObj.debitPortalAccNo,
        "cif": reqObj.debitCifNo,
        "productName": "PAYMNT",
        "subProductName": reqObj.subProduct,
        "functionCode": reqObj.functionCode,
        "chargeAccNo":reqObj.debitPortalAccNo
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-charges.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('assets/simulateAPI/cb-charges.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  siSubmitTransfer(reqObj: any) {
      let reqData = {
          "headerValue": {
            "moduleId": reqObj.moduleId
           },
          "dataValue": {
            "TRANSACTION_FLAG": "Y",
            "IS_FILE_IMPORT_TXN": "Y",
            "DEAL_FLAG": "",// empty for si unitary
            "UNIT_ID": reqObj.debitUnitId,
            "PREV_BALANCE": "",
            "OD_FUNCTION_ID": reqObj.functionCode, 
            "CAN_REF_NO": "",
            "INPUT_CREDIT_CURR_FX": "",
            "CORP_NAME": "",
            "CUT_OFF_TIME": "",
            "INPUT_DEBIT_AMT_FX": "",
            "PAYMENT_INVOICE_DETAILS": "",
            "COUNTRY_LKP": "",
            "CHQ_OPTION": "",
            "MAKER_NAME": "",
            "ODTXNTYPE": "",
            "RATE_REF_NO": reqObj.rateRefNo,
            "OD_VERSION_NO": "1",
            "INPUT_DEBIT_ACC_NO": reqObj.debitPortalAccNo, //DebitPortal Acc
            "AUTH_NAME": "",
            "INPUT_FROZEN_AMT": "",
            "deb_alias_name": "",
            "CARD_NICK_NAME1": "",
            "INPUT_CUST_TYPE": "C",
            "BENE_BANK_NAME_TEXT": reqObj.beneBank, //Beneficiary Bank
            "BENE_ACC_TYPE_DESC": reqObj.beneAccType, //Beneficiary Acc Type
            "AMT_CAP": "",
            "INPUT_DEBIT_BANK": "",
            "BENE_BANK_COUNTRY": reqObj.beneCountry,
            "payBranch": "",
            "EXCHANGE_RATE_FX": "",
            "INPUT_MODE": "CONFORM_SUBMIT",
            "CUST_REF": reqObj.narration,//Narration
            "icNo": "",
            "INPUT_VALUE_DATE": reqObj.valueDate, //ValueDate
            "PYMNT_AMT_RADIO": reqObj.transactionType === 'CREDIT' ? reqObj.transactionType :'', //DEBIT or CREDIT
            "INPUT_TXN_STATUS": reqObj.inputTransactStatus, //TEMPLATE or DRAFT
            "ERROR_CALLBACKS": "",
            "OD_MAX_INDIV_TXN_LIMIT": reqObj.maxIndTxnLimit, //Max Transact Limit
            "SI_OPTION": reqObj.siOption ? reqObj.siOption :"",//data.vStandingInstruction, //SI Option --> NA
            "DEAL_REF_NO": "",//data.vdealRefNumber, //Deal Refernce Number --> NA
            "INPUT_DEBIT_CURRENCY": reqObj.debitCurrencyCode, //Debit Currency
            "PAYMENT_MODE": reqObj.paymentType, //SubProduct Code
            "collecBranch": "",
            "payRef": "",//data.vpaymentdetails, // --> NA
            "OD_AUTH_NAME": "",
            "hostRefNo": "",
            "cutoffDate": "",
            "BENE_ACC_NO": reqObj.beneAccNo, //Beneficiary Account Number
            "createdDate": "",
            "OD_SUBPROD_CODE": reqObj.subProduct, //data.vsiSubprdtCode, //SI SubProduct Code --> NA
            "CHARGE_ACC_NUMBER": reqObj.debitPortalAccNo, // Debit Portal Acc Number
            "UNCOLLECT_BAL": "",
            "REMARKS3": reqObj.purposeCode? reqObj.purposeCode : "",
            "CHQ": "",
            "OD_REF_NO": "",//data.vTempRefernceId, //Template or Draft Txn refer number --> NA
            "PRINT_LANG": "",
            "INPUT_CHANNEL_ID": "3",
            "OD_REJECT_REASON": "",
            "COUNTRY": "",
            "BENE_UNIT_DESC": "",
            "invoiceType": "",
            "REQUEST_TYPE": "VALIDATE",
            "BRANCH_CODE": "",
            "INPUT_CREDIT_AMOUNT_CURR": reqObj.beneCurrencyCode, //Credit Currency Type
            "PAYMENT_GATEWAY": "",
            "payDetails2": "",
            "ERROR_DESC": "",
            "BENE_ACC_NAME": reqObj.beneAccName, //Beneficiary Acc Name
            "BENE_AC_NO":reqObj.beneAccNo, //Beneficiary Acc Number
            "PAYMENT_TYPE_BENE": reqObj.paymentName, //Payment Type
            "payAmt": parseFloat(amountUnFormat(reqObj.paymentAmount))+"", //Transaction Amount
            "INPUT_CREDIT_AMOUNT":parseFloat(amountUnFormat(reqObj.paymentAmount))+"", //Transaction Amount
            "INPUT_CREDIT_AMT_FX": "",
            "BENE_BANK": reqObj.beneBank, //Beneficiary Bank
            "CARD_NUMBER1": "",
            "Delivery_Pin": "",
            "ACC_TYPE_DESC": "",
            "INPUT_DEBIT_ACC_NAME": reqObj.debitAccName, //Debit Acc Name
            "SELECT_INTER_BANK": "",
            "BALANCE_FIELD": "",
            "INPUT_AVAILABLE_BAL": "",
            "OD_MAKER_ID": "",
            "BROKER_NAME": "",
            "EXT_CROSS_RATE": "",
            "IS_CONFORM_PAGE_REQD": "",
            "CHARGE_FLAG": "",
            "AVAIL_PAY_LIMIT": "",
            "INPUT_DEBIT_BRANCH": "",
            "beneCountry": reqObj.beneCountry, //Beneficiary Country
            "Delivery_City": "",
            "ACCEPT_NAME": "",
            "REMARKS2": reqObj.categoryCode,
            "INPUT_DEBIT_AMOUNT_CURR":reqObj.debitCurrencyCode, //Debit Currency
            "REMARKS1": reqObj.relationshipCode,//Relationshipcode
            "OD_HOST_STATUS": "",
            "PAGE_CODE_TYPE": "PMNT_TRNFR",
            "IsValidateToken": "",
            "CUST_REMARKS": "",//data.vcustomerref, //Customer Reference Text --> NA
            "CUSTOMER_REFERENCE": reqObj.approverNote,//Add Note for Authorizer
            "OD_AUTH_ID": "",
            "DEPOSIT_FIELD": "",
            "odTxnType": "",
            "BATCH_MODE": "",
            "DEBIT_COUNTRY_DESC": "",
            "BENE_CURRENCY": reqObj.beneCurrencyCode, //Credit Currency type
            "AUTH_TYPE_O": reqObj.AUTH_TYPE_O,
            "OD_ACC_NO": reqObj.debitPortalAccNo, //Debit Portal Acc
            "INPUT_DEBIT_ORG_ACC_NO": reqObj.debitAccNo, //Debit Acc Number
            "payType": "",
            "OD_PRODUCT_CODE": "PAYMNT",
            "EXT_SELL_RATE": "",
            "OD_PROCESS_DATE": "",
            "OD_STATUS": "",
            "debitValDate": "",
            "RECALL_TYPE": "",//data.vRecallType, --> NA
            "TXN_REF_NO": reqObj && reqObj.txnNo ? reqObj.txnNo : '',
            "AUTHENTICATION_TYPE": "",//data.vchargetypeId, //Charge Type --> NA
            "AMOUNT_TYPE": "",
            "pay_reg_flag": "",//data.vADHOCFlag, //ADHOC Flag --> NA
            "USED_PAY_LIMIT": reqObj.usedPayLimit, //Used Pay Limit
            "EXT_BUY_RATE": "",
            "TOTAL_FIELD": "",
            "RATE_CONV_12": "",
            "BENE_UNIT_ID": "",
            "INPUT_VER_NO": reqObj.inputVersionNum,//Normal transaction and Edit Mode transaction version
            "RATE_CONV_11": "",
            "BENE_BNK_BRNH": "",
            "COUNTRY_CODE": reqObj.beneCountry, //Beneficiary Country
            "OD_ACCEPT_NAME": "",
            "INPUT_USER_NO": "",
            "OD_AUTH_DATE": "",
            "RECALL_AMEND_REASON": "",//data.vRecallReason, //Recall Amend reason --> NA
            "Bene_City": "",
            "phoneNo": "",
            "OD_STATUS_DESC": "",
            "_delMethod": "",
            "ATTACH_DOC_REF": "",//data.supportFileref, --> NA
            "PARAM2": reqObj.otpRef,
            "PARAM1": reqObj.otp,
            "PURPOSE":reqObj.subPurposeCode,//purposeCode
            "REINIT_REASON": "",
            "EXT_BASE_CURRENCY": "",
            "SI_NO_PAY": reqObj.siNoPay? reqObj.siNoPay: "",//data.vnoofPayments, //SI No of Payments --> NA
            "CARD_NAME": "",
            "ATTACH_DOC_REF_NAME": "",//data.supportFileToRename, --> NA
            "INPUT_OVERDRAFT_LIMIT": "",
            "CITY": "",
            "INPUT_ACTION": reqObj.inputAction, //SAVE_TEMP or DRAFT_TXN
            "enrichDetails": "",
            "BENE_TYPE": reqObj.beneAccType, //Beneficiary Acc Type
            "emailId": "",
            "INPUT_SUB_PRODUCT": reqObj.subProduct, //SubProductCode
            "delAddress1": "",
            "delAddress2": "",
            "INPUT_PRODUCT": "PAYMNT",
            "drawBranch": "",
            "INPUT_DEBIT_ACC_TYPE": "",
            "BENE_BANK_CODE": "",
            "INPUT_FUNCTION_CODE": reqObj.functionCode, //Function Code
            "OD_ACCEPT_DATE": "",
            "FIELD_AUTHPERSON2": "",
            "EXT_PAYMENT_AMOUNT": "",
            "PRODUCT_NAME": "PAYMNT",
            "PRINT_LANG_DSC": "",
            "PAYMENT_TYPE": "",
            "BANK_NAMEE": "",
            "DEAL_RATE": "",
            "INPUT_DEBIT_AMOUNT":parseFloat(amountUnFormat(reqObj.paymentAmount))+"", //Debit Avail Balnce //Debit Amount
            "BENE_BRANCH": reqObj.beneBranch, //Bene Branch Name
            "CIF_NO": reqObj.summaryCifNo, //CIF Number
            "INPUT_GCIF": reqObj.debitCifNo, //CIF Number
            "OD_GCIF": reqObj.debitCifNo, //CIF Number
            "BENE_COUNTRY": reqObj.beneCountry, //Bene Country
            "INPUT_CONFIRMATION": "",
            "payee_type": reqObj.payeeType, //PayType - Existing / New
            "ERROR_CODE": "",
            "OD_MAKER_DATE": "",
            "VALIDATE_STATUS": "",
            "Address4": "",
            "ADD_REF": "",//data.vEditRefernceId, //Recall Reference Nmber --> NA
            "INPUT_DEBIT_CURR_FX": "",
            "HOST_REF_NO": "",
            "FIELD_IDNO2": "",
            "REQ_COUNTRY_CODE": reqObj.debitCountryCode, //Debit Req Country
            "CARD_CIF_NO": "",
            "Address3": "",
            "Delivery_Country": "",
            "CREDIT_DESC": "",
            "DEB_AMT_RADIO": reqObj.transactionType === 'DEBIT' ? reqObj.transactionType :'',
            "authPerson": "",
            "PAY_LOCATION": "",
            "beneBname": "",
            "debitDesc": "",
            "CARD_ADD_FLAG": "",
            "BANK_NAME": "",
            "CHARGES_TO": "",//data.vchargetypeId, //ChargeType --> NA
            "Address2": "",//data.vAddress2, //Address 2 --> New Bene
            "BENE_BNK_BIC": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift Code --> Empty for OAT
            "BENE_BANK_BIC": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift code --> Empty for OAT
            "BENE_BANK_SWIFT_CODE": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift code --> Empty for OAT
            "BENE_BRANCH_CITY": "",//data.vbeneBankCity, //Beneficiary Branch City --> Empty for OAT
            "Address1": "",//data.vbeneAddress1, //Address 1 --> Empty for OAT
            "alias_name": "",//data.vbeneId, //BeneId or Alias --> Empty for OAT
            "beneId": "",//data.vbeneId, //Beneficiary Id or Alias
            "SI_FIRST_PAY_DATE":reqObj.siPaymentStartDate? reqObj.siPaymentStartDate: "", //data.vpaymentStartDate, //SI - Payment Start Date
            "EXEC_FREQ":reqObj.frequency? reqObj.frequency: "", //data.vfrequencyType, //SI - Frequency Type
            "SI_LAST_PAY_DATE":reqObj.siPaymentEndDate? reqObj.siPaymentEndDate: "", //data.vpaymentEndDate, //SI - Payment End Date
            "FREQ_UNIT": reqObj.frequencyUnit? reqObj.frequencyUnit: "",
            "INPUT_TMPLT_NAME":"", //data.vTemplateName, //Template - Template Name
            "INPUT_TMPLT_DESC":"", //data.vTemplateDesc, //Template - Template Desc
            "TEMP":"", //data.vTemplateStatus, //Template - Template Status
            "MAINTAIN_TYPE":"", //data.vMaintainType, //Template - Private or Not
            "CHANGE_PAYEE":"", //data.vADHOCFlag, //New Bene - ADHOC Flag
            "PAYMENT_MODE_TYPE":"", //data.vPaymentModeType, //Payment Mode Type
            "Mode_Obj": reqObj.editmode,
            "SELECTION_FLAG": reqObj.selectionFlag,
            "SEL_PARSED_RULE_ID": reqObj.authRuleId,
            "USER_NUMBER_LIST": reqObj.userNoList,
            "CHARGE_AMOUNT": reqObj.chargeAmount,
            "VAT_AMOUNT":reqObj.vatAmount,
            "PAYMENT_PURPOSE_CODE":reqObj.subPurposeCode,
            "OD_HOST_REF_NO" : reqObj && reqObj.hostRefNo ? reqObj.hostRefNo : ''
          },
          "footerValue": {}
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/Payment_Submit.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
      // return this.http.get('/assets/simulateAPI/Payment_Submit.json');
      //return this.http.get('/assets/simulateAPI/invalidOTP.json');
      // return this.http.post(`${environment.restAPI}`, reqData)
  }

  submitMakePaymentApiCall(reqObj: any){
    let reqData = {
        "headerValue": {
          "moduleId": reqObj.moduleId
         },
        "dataValue": {
          "TRANSACTION_FLAG": "Y",
          "IS_FILE_IMPORT_TXN": "Y",
          "DEAL_FLAG": "",//data.vDealFlag, //deal flag
          "UNIT_ID": reqObj.debitUnitId,
          "PREV_BALANCE": "",
         "OD_FUNCTION_ID": reqObj.functionCode, //SI Function code
          "CAN_REF_NO": "",
          "INPUT_CREDIT_CURR_FX": "",
          "CORP_NAME": "",
          "CUT_OFF_TIME": "",
          "INPUT_DEBIT_AMT_FX": "",
          "PAYMENT_INVOICE_DETAILS": "",//data.vpaymentdetails, //Payment Details Text --> NA
          "COUNTRY_LKP": "",
          "CHQ_OPTION": "",
          "MAKER_NAME": "",
          "ODTXNTYPE": "",//data.vDraftTransactType, //Draft Transaction Type --> NA
          "RATE_REF_NO": reqObj.rateRefNo,
          "OD_VERSION_NO": "1",
          "INPUT_DEBIT_ACC_NO": reqObj.debitPortalAccNo, //DebitPortal Acc
          "AUTH_NAME": "",
          "INPUT_FROZEN_AMT": "",
          "deb_alias_name": "",
          "CARD_NICK_NAME1": "",
          "INPUT_CUST_TYPE": "C",
         "BENE_BANK_NAME_TEXT": reqObj.beneBank, //Beneficiary Bank
          "BENE_ACC_TYPE_DESC": reqObj.beneAccType, //Beneficiary Acc Type
          "AMT_CAP": "",
          "INPUT_DEBIT_BANK": "",
         "BENE_BANK_COUNTRY": reqObj.beneCountry,
          "payBranch": "",
          "EXCHANGE_RATE_FX": "",
          "INPUT_MODE": reqObj.INPUT_MODE,
          "CUST_REF": reqObj.narration,//Narration
          "icNo": "",
          "INPUT_VALUE_DATE": reqObj.valueDate, //ValueDate
          "PYMNT_AMT_RADIO": reqObj.transactionType === 'CREDIT' ? reqObj.transactionType :'', //DEBIT or CREDIT
          "INPUT_TXN_STATUS": reqObj.inputTransactStatus, //TEMPLATE or DRAFT
          "ERROR_CALLBACKS": "",
          "OD_MAX_INDIV_TXN_LIMIT": reqObj.maxIndTxnLimit, //Max Transact Limit
          "SI_OPTION": "",//data.vStandingInstruction, //SI Option --> NA
          "DEAL_REF_NO": "",//data.vdealRefNumber, //Deal Refernce Number --> NA
          "INPUT_DEBIT_CURRENCY": reqObj.debitCurrencyCode, //Debit Currency
          "PAYMENT_MODE": reqObj.subProduct, //SubProduct Code
          "collecBranch": "",
          "payRef": "",//data.vpaymentdetails, // --> NA
          "OD_AUTH_NAME": "",
          "hostRefNo": "",
          "cutoffDate": "",
          "INPUT_LANGUAGE_ID": "en_US",
          "BENE_ACC_NO": reqObj.beneAccNo, //Beneficiary Account Number
          "createdDate": "",
          "OD_SUBPROD_CODE": "",//data.vsiSubprdtCode, //SI SubProduct Code --> NA
          "CHARGE_ACC_NUMBER": reqObj.debitPortalAccNo, // Debit Portal Acc Number
          "UNCOLLECT_BAL": "",
          "CHQ": "",
          "OD_REF_NO": "",//data.vTempRefernceId, //Template or Draft Txn refer number --> NA
          "PRINT_LANG": "",
          "INPUT_CHANNEL_ID": "3",
          "OD_REJECT_REASON": "",
          "COUNTRY": "",
          "BENE_UNIT_DESC": "",
          "invoiceType": reqObj.exeType,
          "REQUEST_TYPE": "CONFIRM",
          "BRANCH_CODE": "",
         "INPUT_CREDIT_AMOUNT_CURR": reqObj.beneCurrencyCode, //Credit Currency Type
          "PAYMENT_GATEWAY": "",
          "payDetails2": "",
          "ERROR_DESC": "",
         "BENE_ACC_NAME": reqObj.beneAccName, //Beneficiary Acc Name
         "BENE_AC_NO":reqObj.beneAccNo, //Beneficiary Acc Number
         "PAYMENT_TYPE_BENE": reqObj.paymentName, //Payment Type
         "payAmt": reqObj.paymentAmount, //Transaction Amount
         "INPUT_CREDIT_AMOUNT":reqObj.paymentAmount, //Transaction Amount
          "INPUT_CREDIT_AMT_FX": "",
          "BENE_BANK": reqObj.beneBank, //Beneficiary Bank
          "CARD_NUMBER1": "",
          "Delivery_Pin": "",
          "ACC_TYPE_DESC": "",
         "INPUT_DEBIT_ACC_NAME": reqObj.debitAccName, //Debit Acc Name
          "SELECT_INTER_BANK": "",
          "BALANCE_FIELD": "",
          "INPUT_AVAILABLE_BAL": "",
          "OD_MAKER_ID": "",
          "BROKER_NAME": "",
          "EXT_CROSS_RATE": "",
          "IS_CONFORM_PAGE_REQD": "",
          "CHARGE_FLAG": "",
          "AVAIL_PAY_LIMIT": "",
          "INPUT_DEBIT_BRANCH": "",
          "beneCountry": reqObj.beneCountry, //Beneficiary Country
          "Delivery_City": "",
          "ACCEPT_NAME": "",
          "INPUT_DEBIT_AMOUNT_CURR":reqObj.debitCurrencyCode, //Debit Currency
          "REMARKS1": reqObj.relationshipCode,//Relationshipcode
          "OD_HOST_STATUS": "",
          "PAGE_CODE_TYPE": "PMNT_TRNFR",
          "IsValidateToken": "",
          "CUST_REMARKS": "",//data.vcustomerref, //Customer Reference Text --> NA
          "CUSTOMER_REFERENCE": reqObj.approverNote,//Add Note for Authorizer
          "OD_AUTH_ID": "",
          "DEPOSIT_FIELD": "",
          "odTxnType": "",
          "BATCH_MODE": "",
          "DEBIT_COUNTRY_DESC": "",
          "BENE_CURRENCY": reqObj.beneCurrencyCode, //Credit Currency type
          "AUTH_TYPE_O": reqObj.AUTH_TYPE_O,
          "OD_ACC_NO": reqObj.debitPortalAccNo, //Debit Portal Acc
          "INPUT_DEBIT_ORG_ACC_NO": reqObj.debitAccNo, //Debit Acc Number
          "payType": "",
          "OD_PRODUCT_CODE": "PAYMNT",
          "EXT_SELL_RATE": "",
          "OD_PROCESS_DATE": "",
          "OD_STATUS": "",
          "debitValDate": "",
          "RECALL_TYPE": "",//data.vRecallType, --> NA
          "TXN_REF_NO": "",
          "AUTHENTICATION_TYPE": "",//data.vchargetypeId, //Charge Type --> NA
          "AMOUNT_TYPE": "",
          "pay_reg_flag": "",//data.vADHOCFlag, //ADHOC Flag --> NA
          "USED_PAY_LIMIT": reqObj.usedPayLimit, //Used Pay Limit
          "EXT_BUY_RATE": "",
          "TOTAL_FIELD": "",
          "RATE_CONV_12": "",
          "BENE_UNIT_ID": "",
          "INPUT_VER_NO": reqObj.inputVersionNum,//Normal transaction and Edit Mode transaction version
          "RATE_CONV_11": "",
          "BENE_BNK_BRNH": "",
          "COUNTRY_CODE": reqObj.beneCountry, //Beneficiary Country
          "OD_ACCEPT_NAME": "",
          "INPUT_USER_NO": "",
          "OD_AUTH_DATE": "",
          "RECALL_AMEND_REASON": "",//data.vRecallReason, //Recall Amend reason --> NA
          "Bene_City": "",
          "phoneNo": reqObj.phoneNo? reqObj.phoneNo : "",
          "OD_STATUS_DESC": "",
          "_delMethod": "",
          "ATTACH_DOC_REF": "",//data.supportFileref, --> NA
          "PARAM2": reqObj.otpRef,
          "PARAM1": reqObj.otp,
          "PURPOSE":reqObj.subPurposeCode,//subpurposeCode
          "PAYMENT_PURPOSE_CODE":reqObj.subPurposeCode,
          "REINIT_REASON": "",
          "EXT_BASE_CURRENCY": "",
          "SI_NO_PAY": "",//data.vnoofPayments, //SI No of Payments --> NA
          "CARD_NAME": "",
          "ATTACH_DOC_REF_NAME": "",//data.supportFileToRename, --> NA
          "INPUT_OVERDRAFT_LIMIT": "",
          "CITY": "",
          "INPUT_ACTION": reqObj.inputAction, //SAVE_TEMP or DRAFT_TXN
         "enrichDetails": "",
          "BENE_TYPE": reqObj.beneAccType, //Beneficiary Acc Type
         "emailId": reqObj.emailId? reqObj.emailId : "",
          "INPUT_SUB_PRODUCT": reqObj.subProduct, //SubProductCode
          "delAddress1": reqObj.instructions1,
          "delAddress2": reqObj.instructions2,
          "INPUT_PRODUCT": "PAYMNT",
        "INPUT_REFERENCE_NO": reqObj.INPUT_REFERENCE_NO ? reqObj.INPUT_REFERENCE_NO: undefined, //Edit Mode reference Number
          "drawBranch": "",
          "INPUT_DEBIT_ACC_TYPE": "",
          "BENE_BANK_CODE": reqObj.beneBankCode,
          "BENE_BANK_NAME": reqObj.beneBankCode,
          "INPUT_FUNCTION_CODE": reqObj.functionCode, //Function Code
          "OD_ACCEPT_DATE": "",
          "FIELD_AUTHPERSON2": "",
          "EXT_PAYMENT_AMOUNT": "",
          "PRODUCT_NAME": "PAYMNT",
          "PRINT_LANG_DSC": "",
          "PAYMENT_TYPE": reqObj.proxyType? reqObj.proxyType : "",
          "BANK_NAMEE": "",
          "DEAL_RATE": "",
          "INPUT_DEBIT_AMOUNT": reqObj.paymentAmount, //Debit Avail Balnce //Debit Amount
          "BENE_BRANCH": reqObj.beneBranch, //Bene Branch Name
          "CIF_NO": reqObj.debitCifNo, //CIF Number
          "INPUT_GCIF": reqObj.debitCifNo, //CIF Number
          "OD_GCIF": reqObj.debitCifNo, //CIF Number
          "BENE_COUNTRY": reqObj.beneCountry, //Bene Country
          "INPUT_CONFIRMATION": "",
          "payee_type": reqObj.payeeType, //PayType - Existing / New
          "ERROR_CODE": "",
          "OD_MAKER_DATE": "",
          "VALIDATE_STATUS": "",
          "Address4": "",
          "ADD_REF": "",//data.vEditRefernceId, //Recall Reference Nmber --> NA
          "INPUT_DEBIT_CURR_FX": "",
          "HOST_REF_NO": "",
          "FIELD_IDNO2": reqObj.nationalId? reqObj.nationalId : "",
          "REQ_COUNTRY_CODE": reqObj.debitCountryCode, //Debit Req Country
          "CARD_CIF_NO": "",
          "Address3": "",
          "Delivery_Country": "",
          "CREDIT_DESC": "",
          "DEB_AMT_RADIO": reqObj.transactionType === 'DEBIT' ? reqObj.transactionType :'',
          "authPerson": "",
          "PAY_LOCATION": "",
          "beneBname": "",
          "debitDesc": "",
          "CARD_ADD_FLAG": "",
          "BANK_NAME": "",
          "CHARGES_TO": "",//data.vchargetypeId, //ChargeType --> NA
          "Address2": reqObj.beneCity,//data.vAddress2, //Address 2 --> New Bene
          "BENE_BNK_BIC": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift Code --> Empty for OAT
          "BENE_BANK_BIC": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift code --> Empty for OAT
          "BENE_BANK_SWIFT_CODE": reqObj.beneSwiftCode,//data.vbeneSwiftCode, //Beneficiary Swift code --> Empty for OAT
          "BENE_BRANCH_CITY": reqObj.bankCity,//data.vbeneBankCity, //Beneficiary Branch City --> Empty for OAT
          "Address1": reqObj.beneAddress,//data.vbeneAddress1, //Address 1 --> Empty for OAT
          "alias_name": "",//data.vbeneId, //BeneId or Alias --> Empty for OAT
          "beneId": reqObj.beneId,//data.vbeneId, //Beneficiary Id or Alias
          "SI_FIRST_PAY_DATE":"", //data.vpaymentStartDate, //SI - Payment Start Date
          "EXEC_FREQ":"", //data.vfrequencyType, //SI - Frequency Type
          "SI_LAST_PAY_DATE":"", //data.vpaymentEndDate, //SI - Payment End Date
          "FREQ_UNIT": "", //data.vFrequencyUnit, //SI - Frequency Unit
          "INPUT_TMPLT_NAME":"", //data.vTemplateName, //Template - Template Name
          "INPUT_TMPLT_DESC":"", //data.vTemplateDesc, //Template - Template Desc
          "TEMP":"", //data.vTemplateStatus, //Template - Template Status
          "MAINTAIN_TYPE":"", //data.vMaintainType, //Template - Private or Not
          "CHANGE_PAYEE":"", //data.vADHOCFlag, //New Bene - ADHOC Flag
          "PAYMENT_MODE_TYPE":"", //data.vPaymentModeType, //Payment Mode Type
          "Mode_Obj": reqObj.editmode,
          "SELECTION_FLAG": reqObj.selectionFlag,
          "SEL_PARSED_RULE_ID": reqObj.authRuleId,
          "USER_NUMBER_LIST": reqObj.userNoList,
          "CHARGE_AMOUNT": reqObj.chargeAmount,
          "VAT_AMOUNT":reqObj.vatAmount,
          "REMARKS2": reqObj.categoryCode,
          "REMARKS3": reqObj.purposeCode,
          "INPUT_INSTRUCTIONS_1":reqObj.instructions1,
          "INPUT_INSTRUCTIONS_2":reqObj.instructions2
        },
        "footerValue": {}
    }
    //debugger;
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_Submit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/Payment_Submit.json');
    // return this.http.get('/assets/simulateAPI/invalidOTP.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  /*Fund Transfer Ends*/
  verifyQuickTransfer(reqObj:any){
    let reqData={
      "headerValue": {
        "moduleId": reqObj.moduleId,
        "simulate": "N",
      },
      "dataValue": {
        "unitId": "IGTBSA",
        "cif": reqObj.cifNo,
        "productName": reqObj.prdName,
        "subProductName": reqObj.subPrdName,
        "functionCode": reqObj.funCode
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/Payment_Domestic_refund_QuickTransLimit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
    //return this.http.get('/assets/simulateAPI/Payment_Domestic_refund_QuickTransLimit.json');
  }

  getProxyIdentifierDetailsData(params: any): Observable<any>{
    let reqData = {
      "headerValue": {
        "moduleId": "IPSREGIBANPROXY",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {

        "proxyType": params.proxyId,
        "proxyValue": params.proxyValue,
        "unitId": "",
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/IPSproxyValueDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
    // return this.http.get('/assets/simulateAPI/IPSproxyValueDetails.json')
  }
  // business date api
  getBusinessDates(param:any){
    let reqData={
      "headerValue": {
        "moduleId": param.moduleId,
        "simulate": "N",
      },
      "dataValue": {
        "transactionType": param.transactionType,
        "unitId": "IGTBKSA"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/businessDate.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('assets/simulateAPI/businessDate.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  getExeCharges(reqData:any){
    let reqObj={
      "headerValue": {
          "moduleId": reqData.moduleId,
      },
      "dataValue": {
          "action": "CHARGES_INFO",
          "amount": reqData?.amount ? reqData?.amount+"" : "0",
          "unitId": reqData.unitId,
          "accCcy": reqData.accCcy,
          "debAccNo": reqData.debAccNo,
          "cif": reqData.cif,
          "productName": "PAYMNT",
          "subProductName": reqData.subProd,
          "functionCode": (reqData.checkIpsFlag === "Y" && reqData.conditionalAmount < 20000) ? "IPSTXN" : reqData.funCode,
          "txnType":reqData.txnType,
          "chargeAccNo":reqData.debAccNo
      },
      "footerValue": {}
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/executionCharges.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqObj)
   }

    // return this.http.get('assets/simulateAPI/executionCharges.json');
    // return this.http.post(`${environment.restAPI}`, reqObj)
  }

  // --------------- Ben Upload Service Start-----------------

  //—-------------Template Name—----------------------

  getTemplateName(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "action": "BENETEMP_LOAD",
        "unitId": params.unitId,
        "pdt": "PAYMNT",
        "subPdt": "BENEUP",
        "function": "BULKUP"
      },
      "footerValue": {}
    }


    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadTemplateName.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //—-----------------Template Guideline—--------------------------------

  getTemplateGuideline(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.currentColumn,
        "sortOrder": params.sortOrder
      },
      "dataValue": {
        "action": "BENE_TEMP_FIELD_INFO",
        "pdt": "PAYMNT",
        "subPdt": "BENEUP",
        "function": "BULKUP",
        "templateId": params.templateId,
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadTemplateGuideline.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

  }
  //--------------------Proceed Api---------------------------------------------
  benProceed(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BENEUPPROCEED",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "REQUEST_ID": "ONLINE_DUPLICATE",
        "PAYMENT_TYPE": "BENEUP",
        "FUNCTION_CODE": "BULKUP",
        "FILE_NAME": params.FILE_NAME,
        "MAKER_DATE": params.MAKER_DATE,
        "TEMPLATE_ID": params.TEMPLATE_ID,
        "FILE_SIZE": params.FILE_SIZE,
        "ACTUAL_FILE_NAME": params.ACTUAL_FILE_NAME,
        "CRC_SUM": params.CRC_SUM,
        "INPUT_SUB_PRODUCT": "BENEUP"
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadProceed.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

  }

  //--------------------File Details---------------------------------------------
  getFieldDetails(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BENEUPFILEDETAILS",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "REFERENCE_NUM": params.refNo, // alameen have to confirm with nifil
        "subProductName": "BENEUP",
        "unitId": params.unitId,

      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadFileDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  //--------------------------Authorization -------------------------------------
  getAuthorizationData(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BENAUTHCHECK",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "unitId": params.unitId,
        "productCode": params.pdroductCode,
        "subProdCode": params.subPrdCode,
        "funcCode": "BULKUP",
        "amount": params.amt,
        "accNo": params.accNo,
        "pymntCurrency": "",
        "debitCurrency": ""
      }
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadAuthorization.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }



  //--------------------------Record Summary -------------------------------------
  getBeneficiaryLists(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BENEUPTXNSUMY",
        "sortColumn": "violatorId",
        "sortOrder": "asc"
      },
      "dataValue": {
        "BeneReferenceNo": params.refNo,
        "sortColumn": params.sortColumn,
        "sortDirection": params.sortOrder,
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "groupBy": "",
        "filterList": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": params.unitId,
        "accCcy": ""
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadBeneficiaryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //--------------------------Submit Api -------------------------------------
  benSubmit(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BENEUPSUBMIT",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "REQUEST_ID": "SUBMIT",
        "REFERENCE_NUM": params.REFERENCE_NUM,
        "PAYMENT_TYPE": "BENEUP",
        "FUNCTION_CODE": "BULKUP",
        "FILE_NAME": params.FILE_NAME,
        "MAKER_DATE": params.MAKER_DATE,
        "TEMPLATE_ID": params.TEMPLATE_ID,
        "FILE_SIZE": params.FILE_SIZE,
        "ACTUAL_FILE_NAME": params.ACTUAL_FILE_NAME,
        "CRC_SUM": params.CRC_SUM,
        "INPUT_TXN_STATUS": "RA",
        "IsValidateToken": "",
        "AUTH_TYPE_O": params.AUTH_TYPE_O,
        "PARAM2": params.PARAM2,
        "PARAM1": params.PARAM1,
        "SEL_PARSED_RULE_ID": params.SEL_PARSED_RULE_ID,
        "SELECTION_FLAG": params.SELECTION_FLAG,
        "USER_NUMBER_LIST": params.USER_NUMBER_LIST,
        "sefAuthFlag": params.sefAuthFlag,
        "INPUT_SUB_PRODUCT": "BENEUP"
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // --------------- Ben Upload Service End-----------------

  bankVerify(params: any): Observable<any> {
    let reqData = {
      "headerValue": {
          "moduleId": "BENEBANKDETAILS",
          "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
          "userNo": "",
          "gcif": "",
          "ibanAccount": params.ibanAccount,
          "countryCode": params.countryCode ? params.countryCode : "SA",
          "unitId": "IGTB",
          "languageId": "en_US"
      },
      "footerValue": {
      }
  }


    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/verifyBankInQuickTransfer.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAccountDetails(accountDetailsData :any){
    var reqData = {
     "MODULE_ID": "CASADETAIL",
     "REQ_ACCOUNT_NUMBER": accountDetailsData.OD_ACC_NO,
     "CIF_NO": accountDetailsData.COD_CORECIF,
     "REQ_COUNTRY_CODE": accountDetailsData.REQ_COUNTRY_CODE,
     "UNIT_ID": accountDetailsData.UNIT_ID,
     "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountSummaryDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.get('/assets/simulateAPI/accountSummaryDetails.json')
      // return this.http.post(`${environment.restAPI}`, this.reqData)
  }


  // grouping category and purpose
  private getGroupedCategories(resData: any[]): any[] {
    const groupedCategory = [...resData]?.reduce((acc, curr) => {
      const sameCategory = acc?.filter((eachValue: any) => (curr?.categoryCode === eachValue?.categoryCode))?.length > 0;
      if(sameCategory) {
        acc?.map((eachAcc: any) => {
          if(curr?.categoryCode === eachAcc?.categoryCode) {
            return eachAcc?.purpose?.push(...curr?.purpose);
          }
          return eachAcc;
        });
      }else {
        acc = [...acc, curr];
      }
      return acc;
    }, []);
    return this.getGroupedPurpose(groupedCategory);
  }

  private getGroupedPurpose(groupedCategory: any[]) {
    return[...groupedCategory].map((eachCategory) =>
        ({ ...eachCategory, purpose: this.groupPurpose(eachCategory?.purpose)})
    );
  };

  private groupPurpose(purpose: any[]) {
    return [...purpose]?.reduce((acc, curr) => {
      const samePurpose = acc?.filter((eachValue: any) => (curr?.purposeCode === eachValue?.purposeCode))?.length > 0;
      if(samePurpose) {
        acc?.map((eachAcc: any) => {
          if(curr?.purposeCode === eachAcc?.purposeCode) {
            return eachAcc?.subPurpose?.push(...curr?.subPurpose);
          }
          return eachAcc;
        });
      }else {
        acc = [...acc, curr];
      }
      return acc;
    }, []);
  }

  // getIFTIBANvalidationApiCall(countryCode :any){
  //   let reqData =
  //     {
  //       "countryCode" : countryCode,
  //       "unitId" : "IGTBSA"
  //   }
  //   if(!environment.localURL){
  //     return this.http.get('/assets/simulateAPI/Payment_TransactionType.json');
  //    }else{
  //    return this.http.post(`${environment.payments}`,reqData)
  //    }
  //   // return this.http.get('/assets/simulateAPI/Payment_TransactionType.json');
  //   // return this.http.post(`${environment.restAPI}`, reqData)
  // }

}
