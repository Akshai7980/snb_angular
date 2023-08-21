import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AramcoService {

  constructor(private http:HttpClient) { }

  getDebitLookUp(){
    let reqData = {
        "MODULE_ID": "ARAMCOLKP",
        "OD_USER_NO": "",
        "OD_GCIF": "",
        "DEBIT_UNIT_ID": "IGTBBH",
        "BALANCE_REQUIRED": "Y",
        "simulate": `${environment.isSimulate}`,
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoDebitLookUp.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

    // return this.http.get('/assets/simulateAPI/aramcoDebitLookUp.json');
    // return this.http.get('/assets/simulateAPI/debitlookup.json')
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getCreditLookUp(params?: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "ARCOREMI",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "cod_corecif": params.COD_CORECIF,
        "unitId": params.UNIT_ID,
        "cif": params.COD_CORECIF,
        "accountNo": params.OD_ACC_NO,
      },
      "footerValue": {}
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoCreditLookUp.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

    // return this.http.get('/assets/simulateAPI/aramcoCreditLookUp.json');
        // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getCashLookUp(invoiceNumber?: any,remitterId?:any,params?:any) {
  let reqData =   {
      "headerValue": {
        "moduleId": "ARMCOINV",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
            "accountNo": remitterId,
            "invoiceNumber": invoiceNumber,
        "unitId": "",
        "filterList": params.filterArray
      },
      "footerValue": {}
    };
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoCashLookUp.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

    // return this.http.get('/assets/simulateAPI/aramcoCashLookUp.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getInvoiceData(remitterId?: any,params?:any,fromAmnt?:any,toAmnt?:any,fromDate?:any,toDate?:any) {
    let reqData = {
      "headerValue": {
        "moduleId": "ARCOREMINV",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "cod_corecif": "",
        "remitter_id": remitterId,
        "unitId": "",
        "filterList": params.filterArray,
        "fromAmount":fromAmnt,
        "toAmount":toAmnt,
        "fromDate":fromDate,
        "toDate":toDate
      },
      "footerValue": {}
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoInvoiceData.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

    // return this.http.get('/assets/simulateAPI/aramcoInvoiceData.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getAuthData(params: any, totalAmt: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SELFAUTHCHECK",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "unitId": "IGTBSA",
        "cif": params.COD_CORECIF,
        "productCode": "PAYMNT",
        "subProdCode":params.subCode,
        "funcCode": params.funCode,
        "amount": totalAmt,
        "accNo": params.OD_PORTAL_ACC_NO,
        "pymntCurrency": params.OD_CCY_CODE,
        "debitCurrency": params.debitCurrency
      }
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoAuthCheck.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
      }

    // return this.http.get('/assets/simulateAPI/aramcoAuthCheck.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  // getAramcoData(){
  //   let reqData = {

  //   };

  //   if(environment.localURL){
  //     return this.http.get('assets/simulateAPI/aramcoDetails.json');
  //    }else{
  //    return this.http.post(`${environment.restAPI}`,reqData)
  //    }
    
  //   // return this.http.get('/assets/simulateAPI/aramcoDetails.json');
  //   // return this.http.post(`${environment.restAPI}`, reqData);
  // }

  submitAramcoPayment(reqObj: any) {
    let reqData = 
    {
      "headerValue": {
        "moduleId": "ARMCOPAYSBMT",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "TRANSACTION_FLAG": "Y",
        "UNIT_ID": "IGTBSA",
        "OD_FUNCTION_ID": reqObj.functionId,
        "RATE_REF_NO": "",
            "AUTH_TYPE":"",
        "OD_VERSION_NO": "1",
        "INPUT_DEBIT_ACC_NO": reqObj.debitDetails?.OD_PORTAL_ACC_NO,
        "INPUT_FROZEN_AMT": "",
        "deb_alias_name": reqObj.debitDetails?.ALIAS_NAME,
        "INPUT_CUST_TYPE": "C",
        "INPUT_DEBIT_BANK": reqObj.debitDetails?.BANKNAME,
        "INPUT_MODE": "CONFORM_SUBMIT",
        "INPUT_VALUE_DATE": reqObj.debitDetails?.DATE_TIME,
        "PYMNT_AMT_RADIO": "INPUT_CREDIT_AMOUNT",
        "INPUT_TXN_STATUS": "RA",
        "OD_MAX_INDIV_TXN_LIMIT": reqObj.dailyLimit.maxIndTxnLimit,
        "INPUT_DEBIT_CURRENCY": reqObj.debitDetails?.OD_CCY_CODE,
        "PAYMENT_MODE": reqObj.subProdcode,
        "OD_SUBPROD_CODE": reqObj.subProdcode,
        "UNCOLLECT_BAL": "",
        "OD_REF_NO": "",
        "INPUT_CHANNEL_ID": "3",
        "OD_REJECT_REASON": "",
        "REQUEST_TYPE": "CONFIRM",
        "INPUT_CREDIT_AMOUNT_CURR": reqObj.debitDetails?.EQU_AMT_CUR,
        "INPUT_CREDIT_AMOUNT": reqObj.debitDetails?.EQU_AMT,
        "ACC_TYPE_DESC": reqObj.debitDetails?.OD_ACC_TYPE_2,
        "INPUT_DEBIT_ACC_NAME": "",
        "INPUT_AVAILABLE_BAL": parseFloat(amountUnFormat(reqObj.debitDetails?.CURR_AVAIL_BAL_AMT))+'' ,
        "IS_CONFORM_PAGE_REQD": "",
        "AVAIL_PAY_LIMIT": "",
        "INPUT_DEBIT_BRANCH": reqObj.debitDetails?.BRANCH_NAME,
        "INPUT_DEBIT_AMOUNT_CURR": reqObj.debitDetails?.OD_CCY_CODE,
        "PAGE_CODE_TYPE": "PMNT_TRNFR",
        "CUST_REMARKS": "",
        "CUSTOMER_REFERENCE": "",
        "AUTH_TYPE_O": reqObj.AUTH_TYPE_O,
        "OD_ACC_NO": reqObj.debitDetails?.OD_PORTAL_ACC_NO,
        "INPUT_DEBIT_ORG_ACC_NO": reqObj.debitDetails?.OD_ACC_NO,
        "OD_PRODUCT_CODE": "PAYMNT",
        "OD_STATUS": "",
        "INPUT_GCIF": "",
        "TXN_REF_NO": "",
        "AUTHENTICATION_TYPE": "",
        "AMOUNT_TYPE": "",
        "USED_PAY_LIMIT": reqObj.usedPayLimit,
        "INPUT_VER_NO": "1",
        "RATE_CONV_11": "",
        "INPUT_USER_NO": "",
        "OD_AUTH_DATE": "",
        "PARAM1": reqObj?.otp,
        "PARAM2": reqObj?.otpRef,
        "INPUT_OVERDRAFT_LIMIT": "",
        "CITY": "",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_SUB_PRODUCT": reqObj.subProdcode,
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_REFERENCE_NO": "",
        "INPUT_DEBIT_ACC_TYPE": "",
        "BENE_BANK_CODE": "",
        "INPUT_FUNCTION_CODE": reqObj.functionId,
        "PRODUCT_NAME": "PAYMNT",
        "INPUT_DEBIT_AMOUNT": reqObj.amountDetails.debitAmount + '',
        "BENE_BRANCH": "",
        "CIF_NO": reqObj.debitDetails?.COD_CORECIF,
        "INPUT_CONFIRMATION": "",
        "OD_MAKER_DATE": "",
        "REQ_COUNTRY_CODE": reqObj.debitDetails?.REQ_COUNTRY_CODE,
        "DEB_AMT_RADIO": "",
        "PAYMENT_TYPE": reqObj.paymentType,
        "REMITTER_ID": reqObj.remitterId,
        "PAYMENT_AMT": reqObj.totalAmount + '',
        "NARRATION": "",
        "CUST_REF": "",
        "INVOICE_DETAILS": reqObj.invoiceDetails,
        "BENE_COUNTRY": reqObj.debitDetails?.REQ_COUNTRY_DESC,
        "BENE_CURRENCY": "SAR",
        "INPUT_PAYMENT_AMOUNT": reqObj.amountDetails.transferAmt,
        "OD_GCIF": "",
        "OD_MAKER_ID": "",
        "payAmt": reqObj.totalAmount + '',
        "REFERENCE_NO": "",
        "ARAMCO_SHORT_NAME":reqObj.shortName,
        "REMITTER_LINKAGE":reqObj.addtoLib,
        "CUST_REFERENCE": reqObj.customerRef,
        "PAYMENT_DETAILS" : reqObj.paymentDetails
      },
      "footerValue": {}
    };
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramcoPayment-submit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

    // return this.http.get('/assets/simulateAPI/aramcoPayment-submit.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getDailyLimitApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "DAILYLIMIT"
      },
      "dataValue": {
        "availBal": reqObj.debitAvailableBalance,
        "reqCountry": "BH",
        "unitId": "IGTBBH",
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
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getChargesApiCall(reqObj: any){
    let reqData = {
      "headerValue": {
          "moduleId": "GETFLDDATA",
          "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
          "action": "CHARGES_INFO",
          "unitId": "IGTBSA",
          "accCcy": reqObj.EQU_AMT_CUR,
          "debAccNo": reqObj.OD_ACC_NO,
          "cif": reqObj.COD_CORECIF,
          "productName": "PAYMNT",
          "subProductName": reqObj.pmtType ? (reqObj.pmttype === "credit" ? "ARAMCOPAY" : "ARCODIRPAY"):"ARAMCOPAY",  //reqObj.subCode
          "functionCode": reqObj.pmtType ? (reqObj.pmttype === "credit" ? "ARTXN" : "ARDTXN") : "ARTXN"    //reqObj.funCode,
      },
      "footerValue": {}
  };

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/AramcoCharges.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }
    // return this.http.get('assets/simulateAPI/AramcoCharges.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }


  getremitterValidate(remitterId: any){
    let reqData = {
      "headerValue": {
          "moduleId":"VALIDATEREMITTER",
          "simulate": `${environment.isSimulate}`,
     
      },
      "dataValue": {
          "accNo" : remitterId
    },
      "footerValue": {}
    };

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/aramcoRemitterIdValid.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }   
  }
  

  getCreditTabEntitlements(debitAccNum :any)
  {
    let reqData = {
      
        "headerValue": {
            "moduleId": "ARAMCOYN",
            "simulate": `${environment.isSimulate}`,
        },
        "dataValue": {
            "userNo": "",
            "odGcif": "",
            "productName": "PAYMNT",
            "subProductName": "ARCODIRPAY",
            "functionCode": "ARDTXN",
            "accNo": debitAccNum,
        },
        "footerValue": {}
    
    };
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/aramco-creditToEntitlements.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }   
  }

  getAramcoInvoice(params:any){
  let reqData={
    "headerValue": {
      "moduleId": "ARAMCOINVOICEINQ",

    },
    "dataValue": {
      "aramcoId": params.aramcoId,
      "invoiceNumber": params.invoiceNumber,
      "currency": params.currency,
      "fromDate": params.fromDate,
      "toDate": params.toDate,
      "status": params.status,
      "amountFrom": params.amountFrom,
      "amountTo": params.amountTo
    },
    "footerValue": {}
}

if(environment.localURL){
  return this.http.get('assets/simulateAPI/aramcoInvoiceInquiry.json');
 }else{
 return this.http.post(`${environment.restAPI}`,reqData)
 }
  }
}
