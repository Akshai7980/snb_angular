import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Injectable({
  providedIn: 'root'
})
export class SadadPaymentService {
  private reqData: any
  constructor(private http: HttpClient) { }
  rootScopeData: RootScopeDeclare = RootScopeData;
  uploadFileDetails:any={};
  getdebitlookup() {
    this.reqData = {
      "MODULE_ID": "DEBITLKP",
      "PREFERRED_CCY": "",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/debitlookup.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get(`${environment.restAPI}`, this.reqData)
    // return this.http.get('/assets/simulateAPI/debitlookup.json')
  }

  getEsalDebitAccounts(): any {
    const reqData = {
      MODULE_ID: 'ESALPAYACCLKUP',
      PREFERRED_CCY: '',
      OD_USER_NO: '',
      OD_GCIF: '',
      BALANCE_REQUIRED: 'N',
      simulate: 'N',
    };
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/esalFromAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getcreditlookup() {
    return this.http.get('assets/simulateAPI/creditLookUp.json')
  }
  submitSadadPayment(): Observable<any> {
    return this.http.get('assets/simulateAPI/sadadPayment-submit.json')
  }

  submitSadadsPayment(data: any, debitdata: any, reqobj: any): Observable<any> {
    let reqdata = {
      "headerValue": {
        "moduleId": "SADADPAYMNT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "ACC_TYPE_DESC": "",
        "AMOUNT_TYPE": "",
        "AUTHENTICATION_TYPE": "",
        "AUTH_TYPE_O": reqobj.AUTH_TYPE_O,
        "AVAIL_PAY_LIMIT": "",
        "BENE_BANK_CODE": "",
        "BENE_BRANCH": "Main Office",//tbd
        "BENE_COUNTRY": debitdata.COUNTRY,
        "BENE_CURRENCY": debitdata.OD_CCY_CODE,
        "CIF_NO": debitdata.COD_CORECIF, //dbtAccCIF, 
        "DEB_AMT_RADIO": "",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_AVAILABLE_BAL": "",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_CONFIRMATION": "",
        "INPUT_CREDIT_AMOUNT": reqobj.totalAmount,
        "INPUT_CREDIT_AMOUNT_CURR": debitdata.OD_CCY_CODE,//dbtAccCCY,
        "INPUT_CUST_TYPE": "C",
        "INPUT_DEBIT_ACC_NAME": debitdata.OD_ACC_NAME,//dbtName,
        "INPUT_DEBIT_ACC_NO": debitdata.OD_PORTAL_ACC_NO,//dbtPortalAccNo, //portal Acc number
        "INPUT_DEBIT_ACC_TYPE": "",
        "INPUT_DEBIT_AMOUNT": reqobj.totalAmount,
        "INPUT_DEBIT_AMOUNT_CURR": debitdata.OD_CCY_CODE,//dbtAccCCY,
        "INPUT_DEBIT_BANK": debitdata.BANKNAME,
        "INPUT_DEBIT_BRANCH": debitdata.BRANCH_NAME,
        "INPUT_DEBIT_CURRENCY": debitdata.OD_CCY_CODE, //dbtAccCCY,
        "INPUT_DEBIT_ORG_ACC_NO": debitdata.OD_ACC_NO,//dbtAccNum, //Debit Acc number
        "INPUT_FROZEN_AMT": "",
        "INPUT_FUNCTION_CODE": "SADTXN",
        "INPUT_GCIF": "",//tbd
        "INPUT_MODE": "CONFORM_SUBMIT",
        "INPUT_OVERDRAFT_LIMIT": "",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_REFERENCE_NO": "",
        "INPUT_SUB_PRODUCT": "SADADPAY",
        "INPUT_TXN_STATUS": "RA",
        "INPUT_USER_NO": "",
        "INPUT_VALUE_DATE": reqobj.valueDate,
        "INPUT_VER_NO": "1",
        "IS_CONFORM_PAGE_REQD": "",
        "NARRATION": "test",
        "OD_ACC_NO": debitdata.OD_PORTAL_ACC_NO,//dbtPortalAccNo, //portal Acc number
        "OD_AUTH_DATE": "",
        "OD_FUNCTION_ID": "SADTXN",
        "OD_MAKER_DATE": "",
        "OD_GCIF": "",
        "OD_MAKER_ID": "",
        "OD_MAX_INDIV_TXN_LIMIT": reqobj.maxIndTxnLimit,
        "OD_PRODUCT_CODE": "PAYMNT",
        "PAYMENT_TYPE": "",
        "REMITTER_ID": "",
        "OD_REF_NO": "",
        "OD_REJECT_REASON": "",
        "OD_STATUS": "",
        "OD_SUBPROD_CODE": "SADADPAY",
        "OD_VERSION_NO": "1",
        "PAGE_CODE_TYPE": "PMNT_TRNFR",
        "PARAM1": reqobj.otp,
        "PARAM2": reqobj.otpRef,
        "PAYMENT_MODE": "SADADPAY",
        "PRODUCT_NAME": "PAYMNT",
        "PYMNT_AMT_RADIO": "INPUT_CREDIT_AMOUNT",
        "RATE_CONV_11": "",
        "REFERENCE_NO": "",
        "REQUEST_TYPE": "CONFIRM",
        "REQ_COUNTRY_CODE": debitdata.REQ_COUNTRY_CODE,  //dbtAccCountryCode, 
        "TRANSACTION_FLAG": "Y",
        "TXN_REF_NO": "",
        "UNCOLLECT_BAL": "",
        "UNIT_ID": "IGTBAE",
        "USED_PAY_LIMIT": reqobj.usedPayLimit,
        "deb_alias_name": "",
        "payAmt": reqobj.totalAmount,
        "PAYMENT_DETAILS": reqobj.paymentDetails,   //paymentdetails
        "PAYMENT_AMT": reqobj.totalAmount,
        "CUSTOMER_REFERENCE": reqobj.customerRef, //customerref       
        "CITY": "",
        "CUST_REF": reqobj.customerRef,//customerref,
        "CUST_REMARKS": reqobj.customerRef,  //customerref
        "SELECTED_BILLERS": data,
        "SELECTION_FLAG": reqobj.selectionFlag,
        "SEL_PARSED_RULE_ID": reqobj.authRuleId,
        "USER_NUMBER_LIST": reqobj.userNoList

      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPayment-submit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    // return this.http.post(`${environment.restAPI}`, reqdata);
    //return this.http.get('/assets/simulateAPI/sadadPayment-submit.json');
    // return this.http.get('/assets/simulateAPI/invalidOTP.json');
  }
  getSadadBillerGroupsApiCall(): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADBLRGRP",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB",

      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerGroup.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('/assets/simulateAPI/sadadBillerGroup.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadBillerNamesApiCall(grpcode: any, grpId: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADBILLERS",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB",
        "billergroupId": grpId,
        "billerGroupCode": grpcode,

      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerNames.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('/assets/simulateAPI/sadadBillerNames.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  addSadadBillerNickname(refNum: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "VALIDATEBILLER",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "refNo": refNum
      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/billerNickNameValidate.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.post(`${environment.restAPI}`, reqData)
    //return this.http.get('/assets/simulateAPI/billerNickNameValidate.json');
  }

  submitAddSadadBiller(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADBILLSBMT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "INPUT_ACTION": "LIB_CREATE",
        "PAGE_CODE_TYPE": "SADADFRM",
        "PRODUCT_NAME": "PAYMNT",
        "INPUT_SUB_PRODUCT": "SADLIBR",
        "INPUT_PRODUCT": "PAYMNT",
        "TYPE": "Confirm",
        "INPUT_FUNCTION_CODE": "SADLB",
        "INPUT_CUST_TYPE": "C",
        "INPUT_CONFIRMATION": "C",
        "UTILITY_TYPE": "SADAD", // Default Value
        "UTILITY_PROVIDER_NAME": params.billerCompany, // BILLER_COMPANY
        "SERVICE_DESCRIPTION": "",
        "UTILITY_ACC_NUMBER": params.subscriberId, //SUBSCRIBER_ID
        "OD_REF_NO": "TBC2203181815484",
        "SERVICE_PROVIDER": "", // Empty
        "UTILITY_PROVIDER_CODE": params.billerCode, //BILLER_CODE
        "UTILITY_TYPE_CODE": "Kenya EB", //
        "UTILITY_PROVIDER_ID": params.billerCode, //BILLER_CODE
        "SERVICE_TYPE": "Kenya EB",
        "PAYEE_NICKNAME": "", // Empty
        "UTILITY_CATEGORY": "", // Previous API value
        "REFERENCE_NO": "TBC2203181815484",
        "JSON_TO_HASH_MAP_SUPPORT_FLAG": "JSONVALUES",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_TXN_STATUS": "RA",
        "NEW_STATUS": "PR",
        "MAKER_ACTION": "CREATE",
        "INPUT_USER_NO": "202115004780",
        "INPUT_GCIF": "7000020027",
        "INPUT_REFERENCE_NO": "TBC2203181815484",

        "BILLER_GROUP_NAME": params.billerGroupname,
        "BILLER_GROUP_CODE": params.billerGroupCode,
        "BILLER_COMPANY": params.billerCompany,
        "BILLER_CODE": params.billerCode,
        "SUBSCRIBER_ID": params.subscriberId,
        "NICK_NAME": params.nickName,
        "AUTOPAY_ENABLED": "",//TBD
        "RESTRICTED_ACCESS": "",//TBD
        "ALIAS_NAME": params.nickName,
        "BILLER_ID": params.billerId,
        "BILLER_NAME": params.billerCompany,
        "INPUT_VALUE_DATE": "",
        "OD_SUBPROD_CODE": "SADLIBR",
        "REQ_COUNTRY_CODE": "",
        "CIF_NUM_LOOKUP": "",//TBD
        "PARAM1": params.otp,
        "PARAM2": params.otpRef,
        "AUTH_TYPE_O":params.AUTH_TYPE_O,
        "TRANSACTION_FLAG": "Y",
        "SELECTION_FLAG": params.selectionFlag,
        "SEL_PARSED_RULE_ID": params.authRuleId,
        "USER_NUMBER_LIST": params.userNoList,
        "CUSTOMER_REFERENCE": params.approverNote,
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadAddBillerSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('/assets/simulateAPI/sadadAddBillerSubmit.json')
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadMoiDynamicfields(billername: any, billercode: any, billerid: any, serviceCode: any): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADPARAMETRS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADMOIPAY",
        "functionCode": "SAMITXN",
        "billerId": billerid,
        "billerCode": billercode,
        "billerName": billername,
        "serviceCode": serviceCode
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIDynamicValue.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMOIDynamicValue.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  getSadadMoiService(billername: any, billercode: any, billerid: any,pageCall:any): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADSERVTYPE",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADMOIPAY",
        "functionCode": "SAMITXN",
        "billerId": billerid,
        "billerCode": billercode,
        "billerName": billername,
        "pageCall": pageCall
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiUpdatedServiceType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata)
    }
  }

  getSadadMoiBillerInfo(data:any): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADMOIBILRS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADMOIPAY",
        "functionCode": "SAMITXN",
        "pageCall": data.pageCall
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fetchBillDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata)
    }
  }

  getSadadMOIDebitApiCall(): Observable<any> {
    let reqData = {
      "MODULE_ID": "SADADMOIACCLKUP",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "Y",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiDebitLkp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/sadadMoiDebitLkp.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  getSadadDebitApiCall(): Observable<any> {
    let reqData = {
      "MODULE_ID": "SADADPAYLKUP",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "Y",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadDebitLKp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/sadadDebitLKp.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  sadadRegisteredBillers(): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADPAYREGBILLS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB",
      },
      "footerValue": {}

    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/SadadRegBiller.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('/assets/simulateAPI/SadadRegBiller.json')
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  sadadBillersInquiry(billeraccount: any, billerId: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADINQUIRY",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "accountId": billeraccount,
        "billerId": billerId,
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB"
      },
      "footerValue": {}

    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerINQ.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('/assets/simulateAPI/sadadBillerINQ.json')
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  getDailyLimitApiCall(reqObj: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "DAILYLIMIT"
      },
      "dataValue": {
        "availBal": reqObj.debitAvailableBalance,
        "reqCountry": "BH", //?????
        "unitId": "IGTBBH", //????????
        "cif": reqObj.debitCifNo,
        "accCcy": reqObj.debitCurrencyCode,
        "valueDate": reqObj.valueDate,
        "accNo": reqObj.debitPortalAccNo,
        "portalAccNo": "", //????????
        "productName": "PAYMNT", //?????
        "subProductName": reqObj.subProduct,
        "functionCode": reqObj.functionCode
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_DailyLimit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/Payment_DailyLimit.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  selfAuthCheck(reqObj: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SELFAUTHCHECK"
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "unitId": reqObj.unitID,
        "cif": reqObj.debitCifNo,
        "productCode": "PAYMNT",
        "subProdCode": reqObj.vsubprdtcode, //reqObj.vsubprdtcode
        "funcCode": reqObj.funCode,
        "amount": reqObj.paymentAmount,
        "accNo": reqObj.debitPortalAccNo,
        "pymntCurrency": reqObj.beneCurrencyCode,
        "debitCurrency": reqObj.debitCurrencyCode
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/secFactAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/secFactAuth.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }
  getSadadBillerInfo(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADREGBILLS",
        "simulate": "N",
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "groupBy": "",
        "filterList": params.filterArray,
        "filterFlag": params.flag
      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerInquiry.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //  return this.http.get('/assets/simulateAPI/error_500.json');
    //return this.http.get('/assets/simulateAPI/sadadBillerInquiry.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadBillerInfoForCreatePayment(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADREGBILLS",
        "simulate": "N",
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADLIBR",
        "functionCode": "SADLB",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "groupBy": "",
        "filterList": params.filterArray,
        "filterFlag": params.flag
      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerInquiry.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //  return this.http.get('/assets/simulateAPI/error_500.json');
    //return this.http.get('/assets/simulateAPI/sadadBillerInquiry.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  sadadbillerDelete(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADBILLDELETE",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {

        "REFERENCE_NO": data.refNum,
        "REFERENCE_NUMBER": data.refNum,
        "INPUT_STATUS": "D",
        "INPUT_TXN_STATUS": "AO",
        "BILLER_NAME": data.billerName,
        "ALIAS_NAME": data.shortName,
        "BILLER_ID": data.billerId,
        "CIF_NUM_LOOKUP": "",
        "CRN_NUMBER": "",
        "BILLER_GROUP_NAME": data.billerGroupName,
        "SUBSCRIBER_ID": data.subscriberId,
        "BILLER_LOOKUP": "",
        "INPUT_USER_NO": "",
        "INPUT_GCIF": "",
        "REASON": "cancel",
        "INPUT_ACTION": "LIB_MODIFY",
        "PAGE_CODE_TYPE": "SADADFRM",
        "PRODUCT_NAME": "PAYMNT",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_SUB_PRODUCT": "SADLIBR",
        "INPUT_FUNCTION_CODE": "SADLB",
        "ACTION": "CANCEL"
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/deleteSadadBiller.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    //return this.http.get('assets/simulateAPI/deleteSadadBiller.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }
  
  submitESALPayment(params: any){
    let reqData = {
      headerValue: {
        moduleId: 'ESALPAYMNT',
        simulate: 'N',
      },
      dataValue: {
        ACC_TYPE_DESC: '',
        AMOUNT_TYPE: '',
        AUTHENTICATION_TYPE: '',
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        AVAIL_PAY_LIMIT: '',
        BENE_BANK_CODE: '',
        BENE_BRANCH: '',
        BENE_COUNTRY: params.debitDetails.COUNTRY,
        BENE_CURRENCY: params.debitDetails.OD_CCY_CODE,
        CIF_NO: params.debitDetails.COD_CORECIF,
        DEB_AMT_RADIO: '',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_AVAILABLE_BAL: '',
        INPUT_CHANNEL_ID: '3',
        INPUT_CONFIRMATION: '',
        INPUT_CREDIT_AMOUNT: params.totalAmount,
        INPUT_CREDIT_AMOUNT_CURR: params.debitDetails.OD_CCY_CODE,
        INPUT_CUST_TYPE: 'C',
        INPUT_DEBIT_ACC_NAME: params.debitDetails.OD_ACC_NAME,
        INPUT_DEBIT_ACC_NO: params.debitDetails.OD_ACC_NO,
        INPUT_DEBIT_ACC_TYPE: '',
        INPUT_DEBIT_AMOUNT: params.totalAmount,
        INPUT_DEBIT_AMOUNT_CURR: params.debitDetails.OD_CCY_CODE,
        INPUT_DEBIT_BANK: params.debitDetails.BANKNAME,
        INPUT_DEBIT_BRANCH: params.debitDetails.BRANCH_NAME,
        INPUT_DEBIT_CURRENCY: params.debitDetails.OD_CCY_CODE,
        INPUT_DEBIT_ORG_ACC_NO: params.debitDetails.OD_ACC_NO,
        INPUT_FROZEN_AMT: '',
        INPUT_FUNCTION_CODE: params.funcCode,
        INPUT_GCIF: '',
        INPUT_MODE: 'CONFORM_SUBMIT',
        INPUT_OVERDRAFT_LIMIT: '',
        INPUT_PRODUCT: 'PAYMNT',
        INPUT_REFERENCE_NO: '',
        INPUT_SUB_PRODUCT: params.subprodCode,
        INPUT_TXN_STATUS: 'RA',
        INPUT_USER_NO: '',
        INPUT_VALUE_DATE: params.additionalDetails.date,
        INPUT_VER_NO: '1',
        IS_CONFORM_PAGE_REQD: '',
        NARRATION: 'test',
        OD_ACC_NO: params.debitDetails.OD_ACC_NO,
        OD_AUTH_DATE: '',
        OD_FUNCTION_ID: params.funcCode,
        OD_MAKER_DATE: '',
        OD_GCIF: '',
        OD_MAKER_ID: '',
        OD_MAX_INDIV_TXN_LIMIT: '',
        OD_PRODUCT_CODE: 'PAYMNT',
        PAYMENT_TYPE: '',
        OD_REF_NO: '',
        OD_REJECT_REASON: '',
        OD_STATUS: '',
        OD_SUBPROD_CODE: params.subprodCode,
        OD_VERSION_NO: '1',
        PAGE_CODE_TYPE: 'PMNT_TRNFR',
        PARAM1: params.otpValue,
        PARAM2: params.secAuthRef,
        PAYMENT_MODE: params.subprodCode,
        PRODUCT_NAME: 'PAYMNT',
        PYMNT_AMT_RADIO: 'INPUT_CREDIT_AMOUNT',
        RATE_CONV_11: '',
        REFERENCE_NO: '',
        REQUEST_TYPE: 'CONFIRM',
        REQ_COUNTRY_CODE: params.debitDetails.REQ_COUNTRY_CODE,
        TRANSACTION_FLAG: 'Y',
        TXN_REF_NO: '',
        UNCOLLECT_BAL: '',
        UNIT_ID: params.debitDetails.UNIT_ID,
        USED_PAY_LIMIT: '',
        deb_alias_name: params.debitDetails.ALIAS_NAME,
        payAmt: params.totalAmount,
        PAYMENT_DETAILS: params.additionalDetails.paymentDetails,
        PAYMENT_AMT: params.totalAmount,
        CUSTOMER_REFERENCE: params.additionalDetails.customerRef,
        CITY: '',
        CUST_REF: params.additionalDetails.customerRef,
        CUST_REMARKS: params.additionalDetails.customerRef,
        FEES: params.paymentDetails.fee,
        VAT: params.paymentDetails.vat,
        ALIAS_NAME: '',
        SHORT_NAME: '',
        PAYER_ID: '',
        PAYER_FULL_NAME: '',
        INVOICE_NO: '',
        SELECTED_BILLERS: params.selectedBillers,
      },
      footerValue: {},
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadEsalPaymentStatus.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEsalAuthorizers(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        unitId: reqObj.unitID,
        cif: reqObj.debitCifNo,
        productCode: 'PAYMNT',
        subProdCode: reqObj.subCode,
        funcCode: reqObj.funCode,
        amount: reqObj.paymentAmount,
        accNo: reqObj.debitPortalAccNo,
        pymntCurrency: reqObj.beneCurrencyCode,
        debitCurrency: 'SAR',
      },
      footerValue: {},
    };
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/secFactAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
   
  }

  getSadadMOIRefChargesApiCall(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "GETFLDDATA",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "action": "CHARGES_INFO",
        "unitId": data.UNIT_ID,
        "accCcy": data.OD_CCY_CODE,
        "debAccNo": data.OD_PORTAL_ACC_NO,
        "cif": data.COD_CORECIF,
        "productName": "CORESVS",
        "subProductName": "CHEQUES",
        "functionCode": "CHQREQ",
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiRefCharges.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/sadadMoiRefCharges.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadMoiRefundBillerInfo(): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADMOIREFBILRS",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "",
        "subProductName": "",
        "functionCode": "",
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIBillerRefund.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMOIBillerRefund.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  getSadadMoiRefundServiceTypeInfo(billername: any, billercode: any, billerid: any): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADREFSERVTYPE",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "",
        "subProductName": "",
        "functionCode": "",
        "billerId": billerid,
        "billerCode": billercode,
        "billerName": billername,
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiRefundServiceType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMoiRefundServiceType.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  getSadadMoiRefundAmount(dynamicFields: any, vdbtlkpPortalNo: any, billerId: any, billername: any, serviceCode: any): Observable<any> {
    // debugger
    let historydata =
    {
      "headerValue": {
        "moduleId": "SADADREFFEESINQ",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "",
        "subProductName": "",
        "functionCode": "",
        "fromAccountId": vdbtlkpPortalNo,
        "billerId": billerId,
        "serviceCode": serviceCode,
        "billerName": billername,
        "parameter": dynamicFields,
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIRefundAmount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('http://localhost:4200/assets/simulateAPI/sadadMOIRefundAmount.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  getSadadMoiRefundDynamicfields(billername: any, billercode: any, billerid: any, serviceCode: any): Observable<any> {
    // debugger
    let historydata = {
        "headerValue": {
          "moduleId": "SADADREFPARAMETRS",
          "simulate": `${environment.isSimulate}`,
        },
        "dataValue": {
          "userNo": "",
          "odGcif": "",
          "productName": "",
          "subProductName": "",
          "functionCode": "",
          "billerId": billerid,
          "billerCode": billercode,
          "billerName": billername,
          "serviceCode": serviceCode,
        },
        "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIRefundDynamicValue.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMOIRefundDynamicValue.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }
  submitSadadRefundPayment(): Observable<any> {
    return this.http.get('assets/simulateAPI/sadadMOIRefundSubmit.json')
  }
  getSadadMoiSubmit(data: any, debitdata: any, reqobj: any, vsecAuthCode: any, dynamicFields: any): Observable<any> {
    let historydata = {
      "headerValue": {
        "moduleId": "SADADMOISUBMIT"
      },
      "dataValue": {
        "ACC_TYPE_DESC": "",
        "AMOUNT_TYPE": "",
        "AUTHENTICATION_TYPE": "",
        "AUTH_TYPE_O": reqobj.AUTH_TYPE_O,
        "AVAIL_PAY_LIMIT": reqobj.availPayLimit, // type is number
        "BENE_BANK_CODE": "",
        "BENE_BRANCH": debitdata.BRANCH_NAME,
        "BENE_COUNTRY": debitdata.COUNTRY,
        "BENE_CURRENCY": debitdata.OD_CCY_CODE,
        "CIF_NO": debitdata.COD_CORECIF,
        "CITY": "",
        "DEB_AMT_RADIO": "",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_AVAILABLE_BAL": "",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_CONFIRMATION": "",
        "INPUT_CREDIT_AMOUNT": reqobj.totalAmount,
        "INPUT_CREDIT_AMOUNT_CURR": debitdata.OD_CCY_CODE, //dbtAccCCY,
        "INPUT_CUST_TYPE": "C",
        "INPUT_DEBIT_ACC_NAME": debitdata.OD_ACC_NAME, //dbtName,
        "INPUT_DEBIT_ACC_NO": debitdata.OD_PORTAL_ACC_NO, //dbtPortalAccNo, //portal Acc number,
        "INPUT_DEBIT_ACC_TYPE": "",
        "INPUT_DEBIT_AMOUNT": reqobj.totalAmount,
        "INPUT_DEBIT_AMOUNT_CURR": debitdata.OD_CCY_CODE, //dbtAccCCY,
        "INPUT_DEBIT_BANK": "Saudi National Bank",
        "INPUT_DEBIT_BRANCH": "",
        "INPUT_DEBIT_CURRENCY": debitdata.OD_CCY_CODE, //dbtAccCCY,
        "INPUT_DEBIT_ORG_ACC_NO": debitdata.OD_ACC_NO, //dbtAccNum, //Debit Acc number,
        "INPUT_FROZEN_AMT": "",
        "INPUT_FUNCTION_CODE": reqobj.functionCode,
        "INPUT_GCIF": "",
        "INPUT_MODE": "CONFORM_SUBMIT",
        "INPUT_OVERDRAFT_LIMIT": "",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_REFERENCE_NO": "",
        "INPUT_SUB_PRODUCT": reqobj.subProductCode,
        "INPUT_TXN_STATUS": "RA",
        "INPUT_USER_NO": "",
        "INPUT_VALUE_DATE": "",
        "INPUT_VER_NO": "1",
        "IS_CONFORM_PAGE_REQD": "",
        "NARRATION": "",
        "OD_ACC_NO": debitdata.OD_PORTAL_ACC_NO,
        "OD_AUTH_DATE": "",
        "OD_FUNCTION_ID": "SAMITXN",
        "OD_MAKER_DATE": "",
        "OD_GCIF": "",
        "OD_MAKER_ID": "",
        "OD_MAX_INDIV_TXN_LIMIT": reqobj.maxIndTxnLimit, // Type is Number,
        "OD_PRODUCT_CODE": "PAYMNT",
        "OD_REF_NO": "",
        "OD_REJECT_REASON": "",
        "OD_STATUS": "",
        "OD_SUBPROD_CODE": "SADMOIPAY",
        "OD_VERSION_NO": "1",
        "PAGE_CODE_TYPE": "PMNT_TRNFR",
        "PARAM2": vsecAuthCode,
        "PARAM1": reqobj.userOtpValue, // User Input
        "PAYMENT_AMT": reqobj.totalAmount,
        "PAYMENT_MODE": "SADMOIPAY",
        "PAYMENT_TYPE": "Credit",
        "PRODUCT_NAME": "PAYMNT",
        "PYMNT_AMT_RADIO": "INPUT_CREDIT_AMOUNT",
        "RATE_CONV_11": "",
        "REFERENCE_NO": "",
        "REMITTER_ID": "",
        "REQUEST_TYPE": "CONFIRM",
        "REQ_COUNTRY_CODE": debitdata.REQ_COUNTRY_CODE, //dbtAccCountryCode,
        "TRANSACTION_FLAG": reqobj.selectionFlag,
        "TXN_REF_NO": "",
        "UNCOLLECT_BAL": "",
        "UNIT_ID": debitdata.UNIT_ID, // Unit ID Updated
        "USED_PAY_LIMIT": reqobj.usedPayLimit, // Type is Number 
        "deb_alias_name": debitdata.ALIAS_NAME,
        "payAmt": reqobj.totalAmount,
        "PAYMENT_DETAILS": reqobj.paymentDetails, //paymentdetails,
        "CUST_REFERENCE": reqobj.customerRef,
        "billerName": data[0].BILLER_NAME,
        "billerCode": data[0].BILLER_ID, //type is string
        "serviceType": data[0].SERVICE_TYPE,
        "AMT_IN_DEBIT_CCY": debitdata.OD_CCY_CODE,
        "INPUT_PAYMENT_AMOUNT": reqobj.totalAmount,
        "parameters": dynamicFields,
        "feeReferenceId": reqobj.feeReferenceId, //type is number
        "sadadReferenceId": reqobj.sadadReferenceId, //type is number
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOISubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMOISubmit.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }
  getSadadMoiRefundSubmit(data: any, debitdata: any, reqobj: any, vsecAuthCode: any, dynamicFields: any): Observable<any> {    
    let historydata = {
      "headerValue": {
        "moduleId": "SADADMOIREFSUBMIT",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "ACC_TYPE_DESC": "",
        "AMOUNT_TYPE": "",
        "AUTHENTICATION_TYPE": "",
        "AUTH_TYPE_O":reqobj.AUTH_TYPE_O,
        "AVAIL_PAY_LIMIT": reqobj.availPayLimit, // type is number
        "BENE_BANK_CODE": "",
        "BENE_BRANCH": debitdata.BRANCH_NAME,
        "BENE_COUNTRY": debitdata.COUNTRY,
        "BENE_CURRENCY": debitdata.OD_CCY_CODE,
        "CIF_NO": debitdata.COD_CORECIF,
        "CITY": "",
        "DEB_AMT_RADIO": "",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_AVAILABLE_BAL": "",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_CONFIRMATION": "",
        "INPUT_CREDIT_AMOUNT": reqobj.totalAmount,
        "INPUT_CREDIT_AMOUNT_CURR": debitdata.OD_CCY_CODE,//dbtAccCCY,
        "INPUT_CUST_TYPE": "C",
        "INPUT_DEBIT_ACC_NAME": debitdata.OD_ACC_NAME,//dbtName,,
        "INPUT_DEBIT_ACC_NO": debitdata.OD_PORTAL_ACC_NO,//dbtPortalAccNo, //portal Acc number,
        "INPUT_DEBIT_ACC_TYPE": "",
        "INPUT_DEBIT_AMOUNT": reqobj.totalAmount,
        "INPUT_DEBIT_AMOUNT_CURR": debitdata.OD_CCY_CODE,//dbtAccCCY,
        "INPUT_DEBIT_BANK": "Saudi National Bank",
        "INPUT_DEBIT_BRANCH": "",
        "INPUT_DEBIT_CURRENCY": debitdata.OD_CCY_CODE, //dbtAccCCY,
        "INPUT_DEBIT_ORG_ACC_NO": debitdata.OD_ACC_NO, //dbtAccNum, //Debit Acc number,
        "INPUT_FROZEN_AMT": "",
        "INPUT_FUNCTION_CODE": reqobj.functionCode,
        "INPUT_GCIF": "",
        "INPUT_MODE": "CONFORM_SUBMIT",
        "INPUT_OVERDRAFT_LIMIT": "",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_REFERENCE_NO": "",
        "INPUT_SUB_PRODUCT": reqobj.subProductCode,
        "INPUT_TXN_STATUS": "RA",
        "INPUT_USER_NO": "",
        "INPUT_VALUE_DATE": "",
        "INPUT_VER_NO": "1",
        "IS_CONFORM_PAGE_REQD": "",
        "NARRATION": "",
        "OD_ACC_NO": debitdata.OD_PORTAL_ACC_NO,//dbtPortalAccNo, //portal Acc number,
        "OD_AUTH_DATE": "",
        "OD_FUNCTION_ID": reqobj.functionCode,
        "OD_MAKER_DATE": "",
        "OD_GCIF": "",
        "OD_MAKER_ID": "",
        "OD_MAX_INDIV_TXN_LIMIT": reqobj.maxIndTxnLimit, // Type is Number,
        "OD_PRODUCT_CODE": "PAYMNT",
        "OD_REF_NO": "",
        "OD_REJECT_REASON": "",
        "OD_STATUS": "",
        "OD_SUBPROD_CODE": reqobj.subProductCode,
        "OD_VERSION_NO": "1",
        "PAGE_CODE_TYPE": "PMNT_TRNFR",
        "PARAM2": vsecAuthCode,
        "PARAM1": reqobj.userOtpValue, // User Input
        "PAYMENT_AMT": reqobj.totalAmount,
        "PAYMENT_MODE": reqobj.subProductCode,
        "PAYMENT_TYPE": "Credit",
        "PRODUCT_NAME": "PAYMNT",
        "PYMNT_AMT_RADIO": "INPUT_CREDIT_AMOUNT",
        "RATE_CONV_11": "",
        "REFERENCE_NO": "",
        "REMITTER_ID": "",
        "REQUEST_TYPE": "CONFIRM",
        "REQ_COUNTRY_CODE": debitdata.REQ_COUNTRY_CODE,  //dbtAccCountryCode,
        "TRANSACTION_FLAG": reqobj.selectionFlag,
        "TXN_REF_NO": "",
        "UNCOLLECT_BAL": "",
        "UNIT_ID": debitdata.UNIT_ID, // Unit ID Updated
        "USED_PAY_LIMIT": reqobj.usedPayLimit, // Type is Number
        "deb_alias_name": debitdata.ALIAS_NAME,
        "payAmt": reqobj.totalAmount,
        "PAYMENT_DETAILS": reqobj.paymentDetails,   //paymentdetails,
        "CUST_REFERENCE": reqobj.customerRef,
        "billerName": data[0].BILLER_NAME,
        "billerCode": data[0].BILLER_ID, //type is string
        "serviceType": data[0].SERVICE_TYPE,
        "AMT_IN_DEBIT_CCY": debitdata.OD_CCY_CODE,
        "INPUT_PAYMENT_AMOUNT": reqobj.totalAmount,
        "parameters": dynamicFields,
        // "feeReferenceId": reqobj.feeReferenceId, //type is number //as pown said
        // "sadadReferenceId": reqobj.sadadReferenceId, //type is number  //as pown said
        "serviceCode":data[0].SERVICE_CODE
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIRefundSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('/assets/simulateAPI/sadadMOIRefundSubmit.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  getSadadMOIRefDebitApiCall(): Observable<any> {
    let reqData = {
      "MODULE_ID": "SADADMOIACCREFLKUP",
      "PREFERRED_CCY": "AED",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiRefDebitLkp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/sadadMoiRefDebitLkp.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  secondFactorAuthApiCall() {
    let reqData = {
      "headerValue": {
        "moduleId": "SECFACINIT",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "action": "",
        "pdt": "",
        "subPdt": "",
        "amount": "",
        "accNo": "",
        "unitId": "",
        "cif": "",
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/secFactInit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/secondFactorAuthApiCall.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadMOIChargesApiCall(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "GETFLDDATA",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "action": "CHARGES_INFO",
        "unitId": data.UNIT_ID,
        "accCcy": data.OD_CCY_CODE,
        "debAccNo": data.OD_PORTAL_ACC_NO,
        "cif": data.COD_CORECIF,
        "productName": "CORESVS",
        "subProductName": "CHEQUES",
        "functionCode": "CHQREQ",
        "chargeAccNo" : data.OD_ACC_NO
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiCharges.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/sadadMoiCharges.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getSadadMoiamount(dynamicFields: any, vdbtlkpPortalNo: any, billerId: any, billername: any, serviceCode: any): Observable<any> {
    // debugger
    let historydata = {
      "headerValue": {
        "moduleId": "SADADFEESINQ",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "odGcif": "",
        "productName": "PAYMNT",
        "subProductName": "SADMOIPAY",
        "functionCode": "SAMITXN",
        "fromAccountId": vdbtlkpPortalNo,
        "billerId": billerId,
        "serviceCode": serviceCode,
        "billerName": billername,
        "parameter": dynamicFields
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIAmount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata);
    }
    // return this.http.get('http://localhost:4200/assets/simulateAPI/sadadMOIAmount.json');
    // return this.http.post(`${environment.restAPI}`, historydata);
  }

  // --------- Start - Sadad bulk file upload apis - 22 Sep 

  getEntitlement(unitId:string): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "PMNTSGETFLDDATA",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "action": "GET_USERENT_SADAD_UPLD",
        "unitId": unitId,
      },
      "footerValue": {}
    }
    if (environment.localURL) {
         return this.http.get('assets/simulateAPI/entitlement.json');
       //return this.http.post(`${environment.restAPI}`, reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  getSadadBulkFileUploadLokupApiCall(): Observable<any> {
    let reqData = {
      "MODULE_ID": "SADPAYUPACCLKP",
      "simulate": `${environment.isSimulate}`,
      "footerValue": {
      }
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadPayupAccLkp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  sadUpSubmitApiCall(requestObject: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADUPSUBMIT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "REQUEST_ID": "ONLINE_DUPLICATE",
        "PAYMENT_TYPE": requestObject.subPdtCode,
        "FILE_NAME": requestObject.fileName,
        "MAKER_DATE": requestObject.makerDate,
        "TEMPLATE_ID": "",
        "FILE_SIZE": requestObject.fileSize,
        "FILEFORMAT_CD": requestObject.fileType,
        "ACC_NO_REM": requestObject.accountNumber,
        "CIF_NUM": requestObject.cifNumber,
        "ACTUAL_FILE_NAME": requestObject.actualFileName,
        "CRC_SUM": requestObject.checkSum
      },
      "footerValue": {}
    }
    if (environment.localURL) {
       return this.http.get('assets/simulateAPI/sadUpSubmit.json');
      //return this.http.post(`${environment.restAPI}`, reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  getFileDetailsApiCall(requestObject: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADFILEDETAILS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "REFERENCE_NUM": requestObject.referenceNumber,
        "subProductName": "SADPAYUP",
        "unitId": requestObject.unitId,
      },
      "footerValue": {}
    }
    if (environment.localURL) {
        return this.http.get('assets/simulateAPI/sadFileDetails.json');
      //return this.http.post(`${environment.restAPI}`, reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  sadadBulkFileUploadAuthCheck(reqObj: any, uploadFileData: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADAUTHCHECK",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "unitId": reqObj.UNIT_ID ? reqObj.UNIT_ID : '',
        "cif": reqObj.COD_CORECIF ? reqObj.COD_CORECIF : '',
        "productCode": "PAYMNT",
        "subProdCode": "SADPAYUP",
        "funcCode": "BULKUP",
        "amount": uploadFileData.amount,
        "accNo": reqObj.OD_ACC_NO ? reqObj.OD_ACC_NO : '',
        "pymntCurrency": uploadFileData.currencyCode,
        "debitCurrency": reqObj.OD_CCY_CODE ? reqObj.OD_CCY_CODE : ''
      },
      "footerValue": {}
    }
    if (environment.localURL) {
        return this.http.get('assets/simulateAPI/flexiAuth.json');
      //return this.http.post(`${environment.restAPI}`, reqData);
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  sadUpConfirmApiCall(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "SADUPCONFIRM",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "INPUT_TXN_STATUS": "RA",
        "IsValidateToken": "",
        "AUTH_TYPE_O": data.AUTH_TYPE_O,
        "PARAM2": data?.otpRef,
        "PARAM1": data?.otp,
        "REFERENCE_NUM": data?.referenceNumber,
        "INPUT_MODE": "CONFORM_SUBMIT",
        "PAYMENT_TYPE": data.subPdtCode,
        "INPUT_SUB_PRODUCT": data.subPdtCode,
        "FILE_NAME": data?.fileName,
        "MAKER_DATE": data?.makerDate,
        "TEMPLATE_ID": "",
        "FILE_SIZE": data?.fileSize,
        "FILEFORMAT_CD": data.fileType,
        "ACC_NO_REM": data?.accountNumber,
        "CIF_NUM": data?.cifNumber,
        "ACTUAL_FILE_NAME": data?.actualFileName,
        "CRC_SUM": data?.checkSum,
        "odTxnCy": data?.paymentCy,
        "odFileAmount": data?.amount
      },
      "footerValue": {}
    }
    if (environment.localURL) {
          return this.http.get('assets/simulateAPI/sadUpConfirm.json');
          //return this.http.post(`${environment.restAPI}`,reqData);
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  // --------- End - Sadad bulk file upload apis - 22 Sep 

  // --------- Start - Sadad MOI bulk file upload apis - 24 Sep 

  getSadadMOIBulkFileUploadLokupApiCall(param:any): Observable<any> {
    let reqData = {
      "MODULE_ID": param,
      "simulate": `${environment.isSimulate}`,
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIFileUploadDebitLookUp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  flexiAuthorizationSadadMOIFileUpload(reqObj: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADMOIAUTHCHECK"
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "unitId": reqObj.unitId,
        "cif": reqObj.cifNum,
        "productCode": "PAYMNT",
        "subProdCode": "SADMOIUP",
        "funcCode": "BULKUP",
        "amount": reqObj.fileAmount,
        "accNo": reqObj.accountNumber,
        "pymntCurrency": reqObj.pymntCurrency,
        "debitCurrency": reqObj.debitCurrency
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/flexiAuth.json');
      //return this.http.post(`${environment.restAPI}`,reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  proceedSadadMOIBulkFileUploadLokupApiCall(requestObj: any): Observable<any> {
    // debugger
    let reqData = {
      "headerValue": {
        "moduleId": "SADMOIUPSUBMIT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "REQUEST_ID": "ONLINE_DUPLICATE",
        "PAYMENT_TYPE": requestObj.subPdtCode,
        "FILE_NAME": requestObj.fileName,
        "MAKER_DATE": requestObj.makerDate,
        "TEMPLATE_ID": "",
        "FILE_SIZE": requestObj.fileSize,
        "FILEFORMAT_CD": requestObj.fileType,
        "ACC_NO_REM": requestObj.accountNumber,
        "CIF_NUM": requestObj.cifNumber,
        "ACTUAL_FILE_NAME": requestObj.actualFileName,
        "CRC_SUM": requestObj.checkSum,
        "BILLERCODE": requestObj.billerCode,
        "SERVICECODE": requestObj.serviceCode,
        "BILLERID": requestObj.billerId
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/proceedAPISadadMoiFileUpload.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  fetchFileDetailsByProceedReferenceNumber(reqObj: any) {
    const reqData = {
      "headerValue": {
        "moduleId": "SADMOIFILEDETAILS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "REFERENCE_NUM": reqObj.referenceNumber,
        "subProductName": "SADMOIUP",
        "unitId": reqObj.unitId,
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/proceedRefFileSadadMoiFileUpload.json');
      //return this.http.post(`${environment.restAPI}`,reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  submitSadadMoiBulkFileUpload(reqObj: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADMOIUPCONFIRM",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "REFERENCE_NUM": reqObj.referenceNumber,
        "INPUT_MODE": "CONFORM_SUBMIT",
        "PAYMENT_TYPE": reqObj.subPdtCode,
        "INPUT_SUB_PRODUCT": reqObj.subPdtCode,
        "FILE_NAME": reqObj.fileName,
        "MAKER_DATE": reqObj.dateTime,
        "TEMPLATE_ID": "",
        "FILE_SIZE": reqObj.fileSize,
        "FILEFORMAT_CD": reqObj.fileType,
        "ACC_NO_REM": reqObj.accountNumber,
        "CIF_NUM": reqObj?.codCifNo,
        "ACTUAL_FILE_NAME": reqObj.actualFileName,
        "CRC_SUM": reqObj?.checkSum,
        "BILLERCODE": reqObj?.billerCode,
        "SERVICECODE": reqObj.serviceCode,
        "BILLERID": reqObj.billerId,
        "INPUT_TXN_STATUS": "RA",
        "IsValidateToken": "",
        "AUTH_TYPE_O": reqObj.AUTH_TYPE_O,
        "PARAM1": reqObj?.otp,
        "PARAM2": reqObj?.otpRef,
        "odFileAmount":reqObj?.amount,
        "odTxnCy":reqObj?.paymentCy
       },
      "footerValue": {}
    }
    if (environment.localURL) {
            return this.http.get('assets/simulateAPI/submitSadadMoiFileUpload.json');
         // return this.http.post(`${environment.restAPI}`, reqData)
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  // --------- End - Sadad MOI bulk file upload apis - 24 Sep 

  // ---------ESAL Biller Summary
  getEsalBillerInfo(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "ESALPAYBENELKUP",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {

        "gcif": "",
        "productName": "",
        "subProductName": "",
        "functionCode": ""
      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/esalBillerInquiry.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/esalBillerInquiry.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getPayerIdBasedInvoices(payerId: any): any {
    const reqData = {
      headerValue: {
        moduleId: 'ESALPAYERFETCH',
        simulate: 'N',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        payorId: payerId,
        filterList: [
          {
            filterField: 'ACTION_DISPVAL',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: '',
      },
      footerValue: {},
    };
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/validatePayer.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
validateEsalPayer(param:any){
  let reqData={
    "headerValue": {
      "moduleId": "VALIDATEPAYER",
      "simulate": `${environment.isSimulate}`,
      // "_dinsess": "4252d0e0-6f43-4365-8005-31c2e83e7d97"
    },
    "dataValue": {
      "userNo": "",
      "gcif": "",
      "refNo": param.refNo,
      "languageId": "en_US"
    },
    "footerValue": {
      "userNo": "",
      "gcif": ""
    }
  }
  if(environment.localURL) {
    return this.http.get('assets/simulateAPI/validateEsalPayer.json');
  } else {
    return this.http.post(`${environment.restAPI}`, reqData);
  }
}
  getEsalCharges(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "GETFLDDATA",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "action": "CHARGES_INFO",
        "unitId": data.UNIT_ID,
        "accCcy": data.OD_CCY_CODE,
        "debAccNo": data.OD_PORTAL_ACC_NO,
        "cif": data.COD_CORECIF,
        "productName": "PAYMNT",
        "subProductName": "ESALPAY",
        "functionCode": "ESALTXN",
        "chargeAccNo" : data.OD_ACC_NO
      },
      "footerValue": {}
    }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiRefCharges.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitEsalPayer(params: any): any {
    const reqData = {
      "headerValue": {
        "moduleId": "ESALPAYERSUBMIT",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue" : {
      "ACC_TYPE_DESC": "",
      "AMOUNT_TYPE": "",
      "AUTHENTICATION_TYPE": "",
      "AUTH_TYPE_O": params.AUTH_TYPE_O,
      "AVAIL_PAY_LIMIT": "",
      "BENE_BANK_CODE": "",
      "BENE_BRANCH": "",
      "BENE_COUNTRY": "",
      "BENE_CURRENCY": "",
      "CIF_NO": "",
      "DEB_AMT_RADIO": "",
      "INPUT_ACTION": "SAVE_TXN",
      "INPUT_AVAILABLE_BAL": "",
      "INPUT_CHANNEL_ID": "",
      "INPUT_CONFIRMATION": "",
      "INPUT_CREDIT_AMOUNT": "",
      "INPUT_CREDIT_AMOUNT_CURR": "",
      "INPUT_CUST_TYPE": "",
      "INPUT_DEBIT_ACC_NAME": "",
      "INPUT_DEBIT_ACC_NO": "",
      "INPUT_DEBIT_ACC_TYPE": "",
      "INPUT_DEBIT_AMOUNT": "",
      "INPUT_DEBIT_AMOUNT_CURR": "",
      "INPUT_DEBIT_BANK": "",
      "INPUT_DEBIT_BRANCH": "",
      "INPUT_DEBIT_CURRENCY": "",
      "INPUT_DEBIT_ORG_ACC_NO": "",
      "INPUT_FROZEN_AMT": "",
      "INPUT_FUNCTION_CODE": "PAYCRET",
      "INPUT_GCIF": "",
      "INPUT_MODE": "CONFORM_SUBMIT",
      "INPUT_OVERDRAFT_LIMIT": "",
      "INPUT_PRODUCT": "PAYMNT",
      "INPUT_REFERENCE_NO": "",
      "INPUT_SUB_PRODUCT": "PAYRMAIN",
      "INPUT_TXN_STATUS": "",
      "INPUT_USER_NO": "",
      "INPUT_VALUE_DATE": "",
      "INPUT_VER_NO": "",
      "IS_CONFORM_PAGE_REQD": "",
      "NARRATION": "",
      "OD_ACC_NO": "",
      "OD_AUTH_DATE": "",
      "OD_FUNCTION_ID": "",
      "OD_MAKER_DATE": "",
      "OD_GCIF": "",
      "OD_MAKER_ID": "",
      "OD_MAX_INDIV_TXN_LIMIT": "",
      "OD_PRODUCT_CODE": "PAYMNT",
      "PAYMENT_TYPE": "",
      "REMITTER_ID": "",
      "OD_REF_NO": "",
      "OD_REJECT_REASON": "",
      "OD_STATUS": "",
      "OD_SUBPROD_CODE": "",
      "OD_VERSION_NO": "1",
      "PAGE_CODE_TYPE": "PMNT_TRNFR",
      "PARAM1": params.otp,
      "PARAM2": params.otpRef,
      "PAYMENT_MODE": "",
      "PRODUCT_NAME": "PAYMNT",
      "PYMNT_AMT_RADIO": "INPUT_CREDIT_AMOUNT",
      "RATE_CONV_11": "",
      "REFERENCE_NO": "",
      "REQUEST_TYPE": "CONFIRM",
      "REQ_COUNTRY_CODE": "SA",
      "TRANSACTION_FLAG": "Y",
      "TXN_REF_NO": "",
      "UNCOLLECT_BAL": "",
      "UNIT_ID": "IGTBAE",
      "USED_PAY_LIMIT": "",
      "deb_alias_name": "",
      "payAmt": "1000",
      "PAYMENT_DETAILS": "",
      "PAYMENT_AMT": "",
      "CUSTOMER_REFERENCE": "",
      "CITY": "",
      "CUST_REF": "",
      "CUST_REMARKS": "",
      "ALIAS_NAME": params.shortName,
      "SHORT_NAME": params.shortName,
      "PAYER_ID": params.payerId,
      "PAYER_FULL_NAME": params.fullName,
      "BILLER_ID": "",
      "BILLER_NAME": "",
      "BUYER_NAME": "",
      "INVOICE_CODE": "",
      "BILL_CATEGORY": "",
      "DUE_AMOUNT": "",
      "BILL_STATUS": "",
      "INVOICE_NUMBER": "",
      "BILL_TYPE": "",
      "LOWER_RANGE": "",
      "UPPER_RANGE": ""
    },
    "footerValue": {}
  }
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/submitEsalPayer.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEsalBeneficiaryData(){
    const reqData = {
      headerValue: {
        moduleId: 'ESALPAYBENELKUP',
        simulate: 'N',
      },
      dataValue: {
        userNo: '',
        odGcif: '',
        productName: 'PAYMNT',
        subProductName: 'ESALPAY',
        functionCode: 'ESALTXN',
      },
      footerValue: {},
    };
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadEsalBeneficiaries.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getInvoiceIdBasedInvoices(invoiceId: any) : any {
    const reqData = {
      headerValue: {
        moduleId: 'ESALPAYINVLIST',
        simulate: 'N',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        invoiceCode: invoiceId,
        filterMap: [
          {
            filterField: 'ACTION_DISPVAL',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: '',
      },
      footerValue: {},
    };
    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/invoiceIdBasedInvoices.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getRecordSummary(data: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'SADRECSUMY',
        simulate: `${environment.isSimulate}`,
        sortColumn: data.sortColumn,
        sortOrder: data.sortOrder,
      },
      dataValue: {
        fromRowNo: data.fromRow,
        toRowNo: data.toRow,
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        groupBy: '',
        productName: data.productName,
        subPdt: data.subPdt,
        functionCode: data.functionCode,
        refNo: data.odDRefNo, 
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }  

  getsadadMOIRecordSummary(data: any): Observable<any> {
    //console.log(data,"TESTL:::")
    let reqData = {
      headerValue: {
        moduleId: 'SADMOIRECSUMY',
        simulate: `${environment.isSimulate}`,
        sortColumn: data.sortColumn,
        sortOrder: data.sortOrder,
      },
      dataValue: {
        fromRowNo: data.fromRow, // in case of using pagi:
        toRowNo: data.toRow,
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        groupBy: '',
        productName: data.productName,
        subPdt: data.subPdt,
        functionCode: data.functionCode,
        refNo: data.odDRefNo
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  setUploadFileDetails(data: any) {
    this.uploadFileDetails = data;
  }

  getUploadFileDetails() {
    return this.uploadFileDetails;
  }

  getCreditTabEntitlements(debitAccNum :any)
  {
    let reqData = {
      
        "headerValue": {
            "moduleId": "ARAMCOYN", //Pown confirmed
            "simulate": `${environment.isSimulate}`,
        },
        "dataValue": {
            "userNo": "",
            "odGcif": "",
            "productName": "PAYMNT",
            "subProductName": "ESALONEPAY",
            "functionCode": "ESLONTXN",
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


  esalBillerDelete(data: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "ESALPAYERDLT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {

        "REFERENCE_NO": data.referenceNumber,
        "REFERENCE_NUMBER": data.referenceNumber,
        "INPUT_STATUS": "D",
        "INPUT_TXN_STATUS": "AO",
        "BILLER_NAME": data.billerName,
        "ALIAS_NAME": data.shortName,
        "BILLER_ID": data.billerId,
        "CIF_NUM_LOOKUP": "",
        "CRN_NUMBER": "",
        "BILLER_GROUP_NAME": data.billerGroupName,
        "SUBSCRIBER_ID": data.subscriberId,
        "BILLER_LOOKUP": "",
        "INPUT_USER_NO": "",
        "INPUT_GCIF": "",
        "REASON": "cancel",
        "INPUT_ACTION": "LIB_MODIFY",
        "PAGE_CODE_TYPE": "SADADFRM",
        "PRODUCT_NAME": "PAYMNT",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_SUB_PRODUCT": "SADLIBR",
        "INPUT_FUNCTION_CODE": "SADLB",
        "ACTION": "CANCEL"
      },
      "footerValue": {}
    }

    if(environment.localURL) {
      return this.http.get('assets/simulateAPI/deleteSadadBiller.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
