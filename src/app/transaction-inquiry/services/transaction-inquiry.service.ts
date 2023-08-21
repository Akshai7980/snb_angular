import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionInquiryService {
  reqData: any;
  constructor(private http: HttpClient) {}
  getSingleTransactionSummary(params :any) {
    this.reqData = {
      headerValue: {
        moduleId: 'SINPYTSUM',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: { 
        userNo: '',
        gcif: '',
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterList: params.filterArray,
        unitId: '',
        groupBy: '',
        languageId: 'en_US',
        filterFlag: params.flag,
        searchText: params.searchText
      },
      footerValue: {},
    };
    //debugger;
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/singleTransferSummary.json')
     }else{
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }
      // return this.http.post(`${environment.restAPI}`, this.reqData);
    // return this.http.get('assets/simulateAPI/error_500.json');
    // return this.http.get('/assets/simulateAPI/singleTransferSummary.json');
  }
  getbulkTransactionDetails() {
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
     }else{
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
    }
    // return this.http.get('/assets/simulateAPI/accountTransactionDetails.json');
  }
  getStandingOrderDetails(params:any) {

    let reqData={
      "headerValue":{
        "moduleId":params.moduleId,
        "simulate": `${environment.isSimulate}`,
        "sortColumn":params.sortcolumn,
        "sortOrder":params.sortDirection,
     },
     "dataValue":{
        "odPortalAccNo":"",
        "cif":"",
        "stmtNo":"",
        "userNo":"",
        "gcif":"",        
        "fromRowNo":params.fromRow,
        "toRowNo":params.toRow,
        // commented bcos of filterList
        // "filterMap":[
        //    {
        //       "filterField":"",
        //       "filterConstraint":"contains",
        //       "filterValue":""
        //    }
        // ],
        "unitId":"",
        "groupBy":"",
        "refNo":"",
        "filterList": params.filterArray,
        "filterFlag": params.flag,
        "searchText" : params.searchText
        
     },
     "footerValue":{}
    } 
    //debugger;  
     if(environment.localURL){
      return this.http.get('assets/simulateAPI/ST-standingInstructions.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    
  }
  getSadadTransactionDetails(params: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "BILPAYSUMM",
        simulate: `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "filterList":params.filterArray,
        "unitId": "",
        "groupBy": "",
        "searchText" : params.searchText
      },
      "footerValue": {}
    }
    //debugger;
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/SADADinquiry.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.post(`${environment.restAPI}`, reqData);
    // return this.http.get('assets/simulateAPI/SADADinquiry.json');
    // return this.http.get('assets/simulateAPI/error_500.json');
  }
  getAramcoTransactionSummary(params:any) {
    let reqPayload = {
      "headerValue": {
          "moduleId": "ARMCOSUM",
          "simulate": `${environment.isSimulate}`,
          "sortColumn": params.sortcolumn,
          "sortOrder": params.sortDirection
      },
      "dataValue": {
          "userNo": "",
          "gcif": "",          
          "fromRowNo": params.fromRow,
          "toRowNo": params.toRow,
          "aramcoid": "",
          "invoiceNo": "",
          "currency": "",
          "invoiceFromDate": "",
          "invoiceToDate": "",
          "InvoiceStatus": "",
          "paidFromAmount": "",
          "paidToAmount": "",
          "filterList": params.filterArray,
          "unitId": "",
          "groupBy": "",
          "languageId": "en_US",
          "filterFlag":params.filterFlag,
          "searchText" : params.searchText
      },
      "footerValue": {}
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/aramcoTransactionInquirySummary.json');
   }else{
    return this.http.post(`${environment.restAPI}`, reqPayload);
  }
    // return this.http.post(`${environment.restAPI}`, reqPayload);
    // return this.http.get('assets/simulateAPI/error_500.json');
    // return this.http.get('/assets/simulateAPI/aramcoTransactionInquirySummary.json');
  }
  getPayrollDetails() {
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
     }else{
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
    }
    // return this.http.get('/assets/simulateAPI/accountTransactionDetails.json');
  }
  getDividendsDetails() {
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
     }else{
      return this.http.get('assets/simulateAPI/accountTransactionDetails.json');
    }
    // return this.http.get('/assets/simulateAPI/accountTransactionDetails.json');
  }
  submittransactionPayment(): Observable<any> {
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/sadadPayment-submit.json');
     }else{
      return this.http.get('assets/simulateAPI/sadadPayment-submit.json');
    }
    // return this.http.get('/assets/simulateAPI/sadadPayment-submit.json');
  }

  getSinglePaymentDetails(params: any): Observable<any> {
    let reqPayload = {
      headerValue: {
        moduleId: 'GETTRAN',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        ...params,
      },
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/singleTransferPaymentDetails.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqPayload);
    }
    // return this.http.get(
    //   'assets/simulateAPI/singleTransferPaymentDetails.json'
    // );
        // return this.http.post(`${environment.restAPI}`, reqPayload);
  }

  toCheckCancelTransaction(params: any) {
    let reqPayload = {
        "headerValue": {
            "moduleId": "CNCLTXNINIT",
            "simulate": `${environment.isSimulate}`,
        },
        "dataValue": {
            "INPUT_ACTION": "CANCEL_CHECK",
            "INPUT_GCIF": params.transferDetails.cifNo,
            "INPUT_USER_NO": "",
            "PRODUCT_NAME": params.transferSummary.product_CODE,
            "INPUT_PRODUCT":  params.transferSummary.product_CODE,
            "INPUT_FUNCTION_CODE":  params.transferSummary.functionCode,
            "INPUT_SUB_PRODUCT":  params.transferSummary.subProduct,
            "PAGE_CODE_TYPE": "VALIDATE",
            "TXN_REF_NUM":  params.transferDetails.txnRefNo,
            "TRANSACTION_FLAG": "Y",
            "INPUT_DEBIT_ORG_ACC_NO": params.transferSummary.debitAccNo,
            "INPUT_VALUE_DATE": "",
            "INPUT_REFERENCE_NO":  params.transferSummary.referenceNo,
            "OD_SUBPROD_CODE":  params.transferSummary.subprcode,
            "INPUT_TXN_STATUS": "FH",
            "REQUEST_TYPE": "CANCEL",
        },
        "footerValue": {}
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/checkCancelTransaction.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqPayload);
    }
    // return this.http.get('/assets/simulateAPI/checkCancelTransaction.json');
    //  return this.http.post(`${environment.restAPI}`, reqPayload);
  }

  cancelTransaction(params: any) {
    //debugger;
    let reqPayload = 	{
      "headerValue": {
      "moduleId": "PAYMNTINIT",
      "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
      "TRANSACTION_FLAG": "Y",
      "IS_FILE_IMPORT_TXN": "Y",
      "DEAL_FLAG": "",
      "UNIT_ID": params.transferSummary?.unitId,
      "PREV_BALANCE": "",
      "OD_FUNCTION_ID": "CNTXN",
      "CAN_REF_NO": "",
      "INPUT_CREDIT_CURR_FX": "",
      "CORP_NAME": "",
      "CUT_OFF_TIME": "",
      "INPUT_DEBIT_AMT_FX": "",
      "COUNTRY_LKP": "",
      "CHQ_OPTION": "",
      "MAKER_NAME": "",
      "RATE_REF_NO": "",
      "OD_VERSION_NO": "1",
      "INPUT_DEBIT_ACC_NO": params.transferSummary?.debitAccNo,
      "AUTH_NAME": "",
      "INPUT_FROZEN_AMT": "",
      "deb_alias_name": "",
      "CARD_NICK_NAME1": "",
      "INPUT_CUST_TYPE": "C",
      "BENE_BANK_NAME_TEXT": params.transferSummary?.benefName,
      "BENE_ACC_TYPE_DESC": params.transferDetails?.creditType,
      "AMT_CAP": "",
      "INPUT_DEBIT_BANK": "",
      "BENE_BANK_COUNTRY": params.transferSummary?.benefCountry,
      "payBranch": "",
      "EXCHANGE_RATE_FX": "",
      "INPUT_MODE": "CONFORM_SUBMIT",
      "icNo": "",
      "INPUT_VALUE_DATE": "",
      "PYMNT_AMT_RADIO": "DEBIT",
      "INPUT_TXN_STATUS": "RA",
      "ERROR_CALLBACKS": "",
      "OD_MAX_INDIV_TXN_LIMIT": 9999999999999,
      "SI_OPTION": "",
      "DEAL_REF_NO": "",
      "INPUT_DEBIT_CURRENCY": params.transferDetails?.debitCurrency,
      "PAYMENT_MODE": params.transferSummary?.subprcode,
      "collecBranch": "",
      "OD_AUTH_NAME": "",
      "hostRefNo": "",
      "cutoffDate": "",
      "BENE_ACC_NO": params.transferSummary?.benefAccNo,
      "createdDate": "",
      "OD_SUBPROD_CODE": params.transferSummary?.subprcode,
      "CHARGE_ACC_NUMBER": params.transferDetails?.chargeAccNumber,
      "UNCOLLECT_BAL": "",
      "REMARKS3": "",
      "CHQ": "",
      "PRINT_LANG": "",
      "INPUT_CHANNEL_ID": "3",
      "OD_REJECT_REASON": "",
      "COUNTRY": "",
      "BENE_UNIT_DESC": "",
      "invoiceType": "",
      "REQUEST_TYPE": "VALIDATE", //POWN SAID 11-03-2023
      "BRANCH_CODE": "",
      "INPUT_CREDIT_AMOUNT_CURR": params.transferDetails?.creditCurrency,
      "PAYMENT_GATEWAY": "",
      "payDetails2": "",
      "ERROR_DESC": "",
      "BENE_ACC_NAME": "",
      "BENE_AC_NO": "",
      "PAYMENT_TYPE_BENE": "Own Account Transfer",
      "payAmt": params.transferDetails?.txnAmount,
      "INPUT_CREDIT_AMOUNT": params.transferDetails?.txnAmount,
      "INPUT_CREDIT_AMT_FX": "",
      "BENE_BANK": params.transferDetails?.creditBank,
      "CARD_NUMBER1": "",
      "Delivery_Pin": "",
      "ACC_TYPE_DESC": "",
      "INPUT_DEBIT_ACC_NAME": params.transferSummary?.benefName,
      "SELECT_INTER_BANK": "",
      "BALANCE_FIELD": "",
      "INPUT_AVAILABLE_BAL": "",
      "OD_MAKER_ID": "",
      "BROKER_NAME": "",
      "EXT_CROSS_RATE": "",
      "IS_CONFORM_PAGE_REQD": "",
      "CHARGE_FLAG": "",
      "BENE_BRANCH_CITY": "",
      "AVAIL_PAY_LIMIT": "",
      "INPUT_DEBIT_BRANCH": "",
      "beneCountry": params.transferSummary?.benefCountry,
      "Delivery_City": "",
      "ACCEPT_NAME": "",
      "REMARKS2": "",
      "INPUT_DEBIT_AMOUNT_CURR": params.transferDetails?.debitCurrency,
      "REMARKS1": "",
      "OD_HOST_STATUS": params.transferDetails?.odStatus,
      "PAGE_CODE_TYPE": "CANCEL_TXN",
      "IsValidateToken": "",
      "OD_AUTH_ID": "",
      "DEPOSIT_FIELD": "",
      "odTxnType": "",
      "BATCH_MODE": "",
      "beneId": "",
      "DEBIT_COUNTRY_DESC": params.transferDetails?.debitCountry,
      "BENE_CURRENCY": params.transferDetails?.creditCurrency,
      "AUTH_TYPE_O": params.AUTH_TYPE_O,
      "OD_ACC_NO": params.transferSummary?.debitAccNo,
      "INPUT_DEBIT_ORG_ACC_NO": params.transferSummary?.debitAccNo,
      "payType": "",
      "OD_PRODUCT_CODE": params.transferSummary?.product_CODE,
      "EXT_SELL_RATE": "",
      "OD_PROCESS_DATE": "",
      "OD_STATUS": "",
      "INPUT_GCIF": "001211",
      "debitValDate": "",
      "RECALL_TYPE": "",
      "TXN_REF_NO": params.txnNo,
      "AUTHENTICATION_TYPE": "",
      "AMOUNT_TYPE": "",
      "pay_reg_flag": "",
      "USED_PAY_LIMIT": 0,
      "EXT_BUY_RATE": "",
      "TOTAL_FIELD": "",
      "RATE_CONV_12": "",
      "BENE_UNIT_ID": "",
      "RATE_CONV_11": "",
      "BENE_BNK_BRNH": "",
      "COUNTRY_CODE": params.transferDetails?.creditCountry,
      "OD_ACCEPT_NAME": "",
      "INPUT_USER_NO": "",
      "OD_AUTH_DATE": "",
      "RECALL_AMEND_REASON": "",
      "Bene_City": "",
      "phoneNo": "",
      "OD_STATUS_DESC": "",
      "OD_GCIF": params.transferDetails?.cifNo,
      "_delMethod": "",
      'PARAM2': params?.authRef,
      "PARAM1": params?.otp,
      "PURPOSE": "SAL",
      "REINIT_REASON": "",
      "EXT_BASE_CURRENCY": "",
      "SI_NO_PAY": "",
      "CARD_NAME": "",
      "INPUT_OVERDRAFT_LIMIT": "",
      "CITY": "",
      "INPUT_ACTION": "SAVE_TXN",
      "enrichDetails": "",
      "BENE_TYPE": params.transferDetails?.creditType,
      "emailId": "",
      "INPUT_SUB_PRODUCT": params.transferSummary?.subProductCode,
      'delAddress1': "",
      "delAddress2": "",
      "INPUT_PRODUCT": params.transferSummary?.product_CODE,
      "drawBranch": "",
      "INPUT_DEBIT_ACC_TYPE": "",
      "BENE_BANK_CODE": "",
      "INPUT_FUNCTION_CODE": "CNTXN",
      "OD_ACCEPT_DATE": "",
      "FIELD_AUTHPERSON2": "",
      'EXT_PAYMENT_AMOUNT': "",
      "PRODUCT_NAME": "PAYMNT",
      "PRINT_LANG_DSC": "",
      'PAYMENT_TYPE': "",
      "BANK_NAMEE": "",
      "DEAL_RATE": "",
      "INPUT_DEBIT_AMOUNT": params.transferDetails?.debitAmount,
      "BENE_BRANCH": params.transferDetails?.creditBranch,
      "CIF_NO": params.cifNo,
      "BENE_COUNTRY": params.transferDetails?.creditCountry,
      "INPUT_CONFIRMATION": "",
      "payee_type": "Existing",
      "ERROR_CODE": "",
      "OD_MAKER_DATE": "",
      "VALIDATE_STATUS": "",
      'Address4': "",
      "INPUT_DEBIT_CURR_FX": "",
      "HOST_REF_NO": params.hostRefNo,
      'FIELD_IDNO2': "",
      "REQ_COUNTRY_CODE": "SA",
      'CHARGES_TO': "",
      "Address2": "",
      'CARD_CIF_NO': "",
      "Address3": "",
      "Address1": "",
      "Delivery_Country": "",
      "alias_name": params.transferSummary?.aliasName,
      "CREDIT_DESC": "",
      "DEB_AMT_RADIO": "",
      "authPerson": params.selectedAprover?.AUTH_NAME,
      "PAY_LOCATION": "",
      "beneBname": "",
      'debitDesc': "",
      "CARD_ADD_FLAG": "",
      'BANK_NAME': "",
      "SI_FIRST_PAY_DATE": "",
      "EXEC_FREQ": "",
      "FREQ_UNIT": "",
      "CHANGE_PAYEE": "",
      "CUST_REF": params.transferDetails?.customerReference,
      "CHARGE_AMOUNT": params.transferDetails?.chargeAmt,
      "VAT_AMOUNT":params.transferDetails?.vatAmt,
      "ADD_REF": params.transferDetails?.txnRefNo,
      "OTHERS_REASON": params?.reason,
      "OD_HOST_REF_NO" :params?.hostRefNo
      },
      "footerValue": {
      "userNo": params.transferSummary?.customerId,
      "gcif": params.transferDetails?.cifNo
      }
    };

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cancelTransactionTI.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqPayload);
    }
      // return this.http.get('/assets/simulateAPI/cancelTransactionTI.json');
      // return this.http.post(`${environment.restAPI}`, reqPayload);
  }


  selfAuthCheck(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "SELFAUTHCHECK"
      },
      "dataValue": {
        //"userNo": "",
        //"gcif": "",
        "unitId": reqObj.unitId,
        "cif": reqObj.cifNo,
        "productCode": "PAYMNT",
        "subProdCode": reqObj.subProduct,
        "funcCode": reqObj.functionCode,
        "amount": reqObj.txnAmount,
        "accNo": reqObj.debitNumber,
        "pymntCurrency": reqObj.creditCurrency,
        "debitCurrency":reqObj.debitCurrency
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/secFactAuth.json')
     }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/secFactAuth.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  getBulkTransferSummary(params: any) {
    const reqObj = {
      headerValue: {
        moduleId: 'FILEPAYMENTINQ',
        simulate: 'N',
        sortColumn: params.sortingColumn,
        sortOrder: params.sortingOrder,
      },
      dataValue: {
        userNo: '',
        gcif: '',
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterList: params.filterArray,
        unitId: '',
        groupBy: '',
        searchText:params.searchText
      },
      footerValue: {},
    };
    if(environment.localURL){
      //  return this.http.get('/assets/simulateAPI/error_500.json');
      return this.http.get('assets/simulateAPI/fileTransferSummary.json');
     }else{
      return this.http.post(`${environment.restAPI}`, reqObj);
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
        fileSeqNo: data.fileSeqNo,
        transactionRefNo: data.transactionRefNo,
        fileType: data.fileType,
        accNo: data.accNo,
        pageCall: data.pageName
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransactionList(data: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYROLTXNS',
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
        productName: 'PAYMNT',
        subPdt: data.subPdt,
        functionCode: '',
        refNo: data.refNo,
        pageCall: data.pageName
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/recordSummaryBulKUpload.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAccountDetails(accountDetailsData :any){
    this.reqData = {
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
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    // return this.http.get('/assets/simulateAPI/accountSummaryDetails.json')
      // return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getStandingOrderDetailPage(params:any){
    let reqData = {
      "headerValue": {
          "moduleId": "STDINSDTLS",
          "simulate": "N"
      },
      "dataValue": {
          "refNo": params.refNo, 
           "unitId": "IGTBSA", 
          "languageId": "en_US"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/standingOrderDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

  }

  getStandingOrderTXNDetails(params:any){
    let reqData = {
      "headerValue": {
          "moduleId": "SITXNSUM",
          "simulate": "N"
      },
      "dataValue": {
          "siRefNo": params.refNo, 
          "languageId": "en_US"
      },
      "footerValue": {}
  }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/standingOrderTXNDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }

  }

  getPaymentStatusDetails(data:any){
    let req = {
      "headerValue": {
       "moduleId":"GETWRKFLW",
       "simulate": `N`
       },
       
        "dataValue":{
       "txnRefNo" : data.refNum,
       "productCode" : data.productCode,
       "subProductCode":data.subProductCode,
       "functionCode":data.functionCode,
       "gcif":"",
       "unit_ID" :"",
       }
       } 
       if(environment.localURL){
        return this.http.get('assets/simulateAPI/transferSummaryPaymentStatus.json');
       }else{
        return this.http.post(`${environment.restAPI}`, req)
       }
       //return this.http.get('http://localhost:4200/assets/simulateAPI/workFlow.json');
      // return this.http.post(`${environment.restAPI}`,workFlowdata);
     }
  
     getTrackerDetails(data:any){
      let req = {
        "headerValue": {
          "moduleId":"GETHISTORY",
        "simulate": `N`
          },
          
         "dataValue":{
          "txnRefNo" : data.refNum,
          "productCode" : data.productCode,
          "subProductCode":data.subProductCode,
          "functionCode":data.functionCode,
          "gcif":"",
          "unit_ID" :"",
          }
          
         }
         if(environment.localURL){
          return this.http.get('assets/simulateAPI/transferTrackerDetails.json');
         }else{
          return this.http.post(`${environment.restAPI}`, req)
         }
        //return this.http.get('http://localhost:4200/assets/simulateAPI/history.json');
        // return this.http.post(`${environment.restAPI}`,historydata);
    }

    getSwiftGpiDetails(params: any){
      let req = {
        "headerValue": {
          "moduleId":"SWIFTGPIDETAILS",
        "simulate": `N`
          },
         "dataValue":{
         "requestFrom": params.requestFrom,
         "transUTIReference": params.transRefNo,
         "productName":"PAYMNT",
         "subProductName":"INTFDTF",
         "functionCode":"SWFTGPI",
         "unitId": params.unitID ,
         "accountId":"",
         "postingDate":"",
         "journalId":""
          }
          
         }
         if(environment.localURL){
          return this.http.get('assets/simulateAPI/swiftGPIDetails.json');
         }else{
          return this.http.post(`${environment.restAPI}`, req)
         }
    }

    getDuplicateFileApi(data?: any): Observable<any> {
      let reqData = {
        headerValue: {
          moduleId: 'PAYDUPFLE',
          simulate: `${environment.isSimulate}`,
        },
        dataValue: {
          txnRefNo: data.txnRefNo,
          productCode: 'PAYMNT',
          subProductCode: data?.subProductCode,
          functionCode: data?.functionCode,
          fromAccountId: data?.fromAccountId,
          fileType: data?.fileType,
          totalAmount: data?.totalAmount,
          totalRecords: data?.totalRecords,
          noOfDays: data?.noOfDays,
          promoCode: 0,
          unit_ID: '',
          fromRowNo: data.fromRow,
          toRowNo: data.toRow,
          pageCall: data.pageName ? data.pageName :''
        },
      };
  
      if (environment.localURL) {
        return this.http.get('assets/simulateAPI/payDupFle.json');
      } else {
        return this.http.post(`${environment.restAPI}`, reqData);
      }
    }

    siCancelTransaction(params: any) {
      //debugger;
      let reqPayload = 	{
        "headerValue": {
        "moduleId": "PAYMNTINIT",
        "simulate": `${environment.isSimulate}`
        },
        "dataValue": {
          "TRANSACTION_FLAG": "Y",
          "IS_FILE_IMPORT_TXN": "Y",
          "DEAL_FLAG": "",
          "UNIT_ID": "IGTBSA",
          "PREV_BALANCE": "",
          "OD_FUNCTION_ID": "CNCLSI",
          "CAN_REF_NO": params.transferDetails.siRefNo,//refnumber
          "INPUT_CREDIT_CURR_FX": "",
          "CORP_NAME": "",
          "CUT_OFF_TIME": "",
          "INPUT_DEBIT_AMT_FX": "",
          "PAYMENT_INVOICE_DETAILS": "",
          "COUNTRY_LKP": "",
          "CHQ_OPTION": "",
          "MAKER_NAME": "",
          "ODTXNTYPE": "",
          "RATE_REF_NO": "",
          "OD_VERSION_NO": "1",
          "INPUT_DEBIT_ACC_NO": params.transferSummary.debitAccount,//debit Acc num
          "AUTH_NAME": "",
          "INPUT_FROZEN_AMT": "",
          "deb_alias_name": "",
          "CARD_NICK_NAME1": "",
          "INPUT_CUST_TYPE": "C",
          "BENE_BANK_NAME_TEXT": params.transferSummary.beneficiaryName, //beneName
          "BENE_ACC_TYPE_DESC": "",
          "AMT_CAP": "",
          "INPUT_DEBIT_BANK": "",
          "BENE_BANK_COUNTRY": "",
          "payBranch": "",
          "EXCHANGE_RATE_FX": "",
          "INPUT_MODE": "CONFORM_SUBMIT",
          "CUST_REF": "",
          "icNo": "",
          "INPUT_VALUE_DATE": "",
          "PYMNT_AMT_RADIO": "",
          "INPUT_TXN_STATUS": "RA",
          "ERROR_CALLBACKS": "",
          "OD_MAX_INDIV_TXN_LIMIT": 9999999999999,
          "SI_OPTION": "Yes",
          "DEAL_REF_NO": "",
          "INPUT_DEBIT_CURRENCY": params.transferSummary.siCurrency,//Debit currency
          "PAYMENT_MODE": "BKSIBT",//subproductCOde
          "collecBranch": "",
          "payRef": "",
          "OD_AUTH_NAME": "",
          "hostRefNo": "",
          "cutoffDate": "",
          "BENE_ACC_NO": params.transferSummary.benefAcNo,//BeneAcc Num
          "createdDate": "",
          "OD_SUBPROD_CODE": "RECPAY",
          "CHARGE_ACC_NUMBER": "100000003275",
          "UNCOLLECT_BAL": "",
          "REMARKS3": "",
          "CHQ": "",
          "OD_REF_NO": params.transferDetails.siRefNo,//ref numb
          "PRINT_LANG": "",
          "INPUT_CHANNEL_ID": "3",
          "OD_REJECT_REASON": params.reason,
          "COUNTRY": "",
          "BENE_UNIT_DESC": "",
          "invoiceType": "",
          "REQUEST_TYPE": "VALIDATE",
          "BRANCH_CODE": "",
          "INPUT_CREDIT_AMOUNT_CURR": params.transferSummary.siCurrency, //credit currency
          "PAYMENT_GATEWAY": "",
          "payDetails2": "",
          "ERROR_DESC": "",
          "BENE_ACC_NAME": params.transferSummary.beneficiaryName,//bene acc name
          "BENE_AC_NO": params.transferSummary.benefAcNo,// bene acc number
          "PAYMENT_TYPE_BENE": params.transferDetails.paymtType,//bene type
          "payAmt": params.transferDetails.siAmount, // txn amount
          "INPUT_CREDIT_AMOUNT": params.transferDetails.siAmount, // txn amount
          "INPUT_CREDIT_AMT_FX": "",
          "BENE_BANK": "",// bene bank
          "CARD_NUMBER1": "",
          "Delivery_Pin": "",
          "ACC_TYPE_DESC": "",
          "INPUT_DEBIT_ACC_NAME": "",//bene name
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
          "beneCountry": "",//benecountry
          "Delivery_City": "",
          "ACCEPT_NAME": "",
          "REMARKS2": "",
          "INPUT_DEBIT_AMOUNT_CURR": params.transferDetails.sicurrency,//debit currency
          "REMARKS1": "DN",
          "OD_HOST_STATUS": "", //od status
          "PAGE_CODE_TYPE": "PMNT_TRNFR_CNCL",
          "IsValidateToken": "",
          "CUST_REMARKS": "",
          "CUSTOMER_REFERENCE": "",
          "OD_AUTH_ID": "",
          "DEPOSIT_FIELD": "",
          "odTxnType": "",
          "BATCH_MODE": "",
          "DEBIT_COUNTRY_DESC": params.transferDetails.sicurrency,//debit country
          "BENE_CURRENCY": params.transferDetails.sicurrency,//credit currency
          "AUTH_TYPE_O": params.AUTH_TYPE_O,
          "OD_ACC_NO": params.transferSummary.debitAccount, //debit acc num
          "INPUT_DEBIT_ORG_ACC_NO": params.transferSummary.debitAccount,//debit acc num
          "payType": "",
          "OD_PRODUCT_CODE": "PAYMNT",
          "EXT_SELL_RATE": "",
          "OD_PROCESS_DATE": "",
          "OD_STATUS": "",
          "debitValDate": "",
          "RECALL_TYPE": "",
          "AUTHENTICATION_TYPE": "",
          "AMOUNT_TYPE": "",
          "pay_reg_flag": "",
          "USED_PAY_LIMIT": "",
          "EXT_BUY_RATE": "",
          "TOTAL_FIELD": "",
          "RATE_CONV_12": "",
          "BENE_UNIT_ID": "",
          "INPUT_VER_NO": 1,
          "RATE_CONV_11": "",
          "BENE_BNK_BRNH": "",
          "COUNTRY_CODE": "",
          "OD_ACCEPT_NAME": "",
          "INPUT_USER_NO": "",
          "OD_AUTH_DATE": "",
          "RECALL_AMEND_REASON": "",
          "Bene_City": "",
          "phoneNo": "",
          "OD_STATUS_DESC": "",
          "_delMethod": "",
          "ATTACH_DOC_REF": "",
          "PARAM2": params.authRef,//authref
          "PARAM1": params.otp,//otp
          "PURPOSE": "",
          "REINIT_REASON": "",
          "EXT_BASE_CURRENCY": "",
          "SI_NO_PAY": 1,
          "CARD_NAME": "",
          "ATTACH_DOC_REF_NAME": "",
          "INPUT_OVERDRAFT_LIMIT": "",
          "CITY": "",
          "INPUT_ACTION": "SAVE_TXN",
          "enrichDetails": "",
          "BENE_TYPE": "",
          "emailId": "",
          "INPUT_SUB_PRODUCT": "RECPAY",
          "delAddress1": "",
          "delAddress2": "",
          "INPUT_PRODUCT": "PAYMNT",
          "drawBranch": "",
          "INPUT_DEBIT_ACC_TYPE": "",
          "BENE_BANK_CODE": "",
          "INPUT_FUNCTION_CODE": "CNCLSI",
          "OD_ACCEPT_DATE": "",
          "FIELD_AUTHPERSON2": "",
          "EXT_PAYMENT_AMOUNT": "",
          "PRODUCT_NAME": "PAYMNT",
          "PRINT_LANG_DSC": "",
          "PAYMENT_TYPE": "",
          "BANK_NAMEE": "",
          "DEAL_RATE": "",
          "INPUT_DEBIT_AMOUNT": params.transferDetails.siAmount,//debit amount
          "BENE_BRANCH": " ",//bene branch
          "CIF_NO": params && params.summaryCIF ? params.summaryCIF : '',
          "INPUT_GCIF": "",
          "OD_GCIF": "",
          "BENE_COUNTRY": "", //bene country
          "INPUT_CONFIRMATION": "",
          "payee_type": "New",
          "ERROR_CODE": "",
          "OD_MAKER_DATE": "",
          "VALIDATE_STATUS": "",
          "Address4": "",
          "ADD_REF": "",
          "INPUT_DEBIT_CURR_FX": "",
          "HOST_REF_NO": "",
          "FIELD_IDNO2": "",
          "REQ_COUNTRY_CODE": "SA",
          "CARD_CIF_NO": "",
          "Address3": "",
          "Delivery_Country": "",
          "CREDIT_DESC": "",
          "DEB_AMT_RADIO": "DEBIT",
          "authPerson": "",
          "PAY_LOCATION": "",
          "beneBname": "",
          "debitDesc": "",
          "CARD_ADD_FLAG": "",
          "BANK_NAME": "",
          "CHARGES_TO": "",
          "Address2": "",
          "BENE_BRANCH_CITY": "",
          "Address1": "",
          "alias_name": "",
          "beneId": "",
          "SI_FIRST_PAY_DATE": params.transferDetails.firstPymtDate,//first payment date
          "EXEC_FREQ": params.transferDetails.payevery, //frequency
          "SI_LAST_PAY_DATE": params.transferDetails.nextPymtDate,//last payment date
          "FREQ_UNIT": params.transferDetails.frequency,
          "INPUT_TMPLT_NAME": "",
          "INPUT_TMPLT_DESC": "",
          "TEMP": "",
          "MAINTAIN_TYPE": "",
          "CHANGE_PAYEE": "",
          "PAYMENT_MODE_TYPE": "",
          "Mode_Obj": "",
          "SELECTION_FLAG": "N",
          "SEL_PARSED_RULE_ID": "",
          "USER_NUMBER_LIST": "",
          "CHARGE_AMOUNT": "0.20",
          "VAT_AMOUNT": "0.03",
          "ARMOR_TICKET": null,
          "AUTH_TYPE": "O",
          "OD_LOGIN_ID": null,
          "isSingleUser": "N",
          "isSoloCorporate": "Y",
          "channelId": "Desktop",
          "INPUT_REQ_COUNTRY_CODE": "SA",
          "INPUT_CIF_NO": "",
          "INPUT_REFERENCE_NO": "",
          "REFERENCE_NO": params.transferDetails.siRefNo,//ref num
          "SI_AMOUNT":"112",//si amount
          "ACC_TYPE":"4402",
          "FIRST_PAYMENT_DATE":params.transferDetails.firstPymtDate,//first payment
          "NO_OF_PAYMENTS": params.transferDetails.noOfpaymnts,//number of payments
          "PAY_EVERY":params.transferDetails.payevery, //frequency
          "LAST_PAYMENT_DATE":params.transferDetails.nextPymtDate,//last date
          "TXN_REF_NO": params && params.txnRefNo ? params.txnRefNo : '',
          "beneCurrency":params.transferDetails.sicurrency,//bene currency
          "SI_CURRENCY":params.transferDetails.sicurrency,//bene ccy
          "DEBIT_ACC_NO":params.transferSummary.debitAccount,//debit acc number
          "BENEE_CURRENCY":params.transferDetails.sicurrency,//bene ccy,
          "OD_HOST_REF_NO" : params && params.hostRefNo ? params.hostRefNo : ''
          
        
      },
        "footerValue": {
       
        }
      };
  
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/cancelTransactionTI.json');
       }else{
        return this.http.post(`${environment.restAPI}`, reqPayload);
      }
        // return this.http.get('/assets/simulateAPI/cancelTransactionTI.json');
        // return this.http.post(`${environment.restAPI}`, reqPayload);
    }

}
