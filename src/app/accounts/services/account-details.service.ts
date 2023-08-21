import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private accountSummaryReqData: any;
  private financeSummaryReqData:any;
  private reqData:any;

  constructor(public http:HttpClient) { }

  getAccDetails(accNum:any,advancedSearchdata:any){
    let accountStatementReqData = {
      "MODULE_ID": "CASASTATEMENT",
      "REQ_ACCOUNT_NUMBER": accNum,
      "SELECTED_RANGE": advancedSearchdata.period,
      "res_Flag":advancedSearchdata.searchWithin,
      "res_transactionType":advancedSearchdata.transacttype,
      "FILTER_DATE_VALUE_DATE":advancedSearchdata.fromDate,
      "FILTER_DATE_VALUE_DATE2":advancedSearchdata.toDate,
      "simulate": `N`,
      "fromAmount" :advancedSearchdata.fromAmount ? amountUnFormat(advancedSearchdata.fromAmount) :'',
      "toAmount": advancedSearchdata.toAmount ? amountUnFormat(advancedSearchdata.toAmount) :'',
      "fromRowNo":advancedSearchdata.fromRow ,
      "toRowNo": advancedSearchdata.toRow,
      "recordId": advancedSearchdata.recordId
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountDetailsRecentTransaction.json');
     }else{
     return this.http.post(`${environment.restAPI}`,accountStatementReqData)
     }
    //return this.http.get(`http://localhost:4200/assets/simulateAPI/accountDetailsRecentTransaction.json`);
    // return this.http.post(`${environment.restAPI}`, accountStatementReqData)
     //return this.http.get('/assets/simulateAPI/accDetails.json')
  }

  getNarrationAPI(params:any){
    let narrationReqData ={
      "MODULE_ID": "CASATXNDET",
      "simulate": "N",
      "REQ_ACCOUNT_NUMBER":params.accNumber,
      "RECORD_ID":params.recordId,
      "refNo":"10"
  }
   if(environment.localURL){
    return this.http.get('assets/simulateAPI/accountDetailsNarration.json');
   }else{
   return this.http.post(`${environment.restAPI}`,narrationReqData)
   }
  //return this.http.get(`http://localhost:4200/assets/simulateAPI/accountDetailsNarration.json`);
  // return this.http.post(`${environment.restAPI}`, narrationReqData)
  }

  getcasaActDtls(flag: String){
    if (flag == "N") {
      this.accountSummaryReqData = { "MODULE_ID": "CASASUMMARY", "simulate": `N` }
    }
    if (flag == "Y") {
      this.accountSummaryReqData = { "MODULE_ID": "CASASUMMARY", "REFRESH": "Y", "simulate": `N` }
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/accountsSummary.json');
	  // return this.http.get('/assets/simulateAPI/500reponse.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.accountSummaryReqData)
     }
    // return this.http.get('/assets/simulateAPI/500reponse.json');
      // return this.http.post(`${environment.restAPI}`, this.accountSummaryReqData);
    // return this.http.get('/assets/simulateAPI/accountsSummary.json')
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

  updateNickName(data:any,nickname:any){
    this.reqData = {
      "headerValue": {
        "moduleId": "FORCEADDNICKNAME",
        "simulate": "N"
      },
      "dataValue": {
        "unitId": data.UNIT_ID,
        "aliasName": nickname,
        "odPortalAccId": data.OD_PORTAL_ACC_NO,
        "makerDate": "",
        "authId": "",
        "refNo": "",
        "authDate": "",
        "versionNo": "",
        "status": "U",
        "odRefNo": data.OD_REF_NO,
        "cifNo": data.COD_CORECIF,
        "countryCode": data.REQ_COUNTRY_CODE,
        "languageId": "en_US"
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/upDateNickName.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/upDateNickName.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData);
}

getAccountStatement(accNumber:any,accountStatementFlag:any){
  this.reqData = {
    "headerValue": {
      "moduleId": "VIEWESTMT"
    },
    "dataValue": {
      "userNo": "",
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
      "languageId": "en_US",
      "groupBy": "",
      "reqCustomerId": accNumber,
      "reqFromDate": "",
      "reqToDate": "",
      "accountNum": accNumber,
      "accStatement": accountStatementFlag
    },
    "footerValue": {}
  }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/accountsStatement.json');
   }else{
   return this.http.post(`${environment.restAPI}`,this.reqData)
   }

  //return this.http.get('/assets/simulateAPI/accountsStatement.json');
  // return this.http.post(`${environment.restAPI}`, this.reqData);
}

statementsDownloadApi(url: string): Observable<any>{
  return this.http.get(url, { observe: 'response' });
}

  getloansSummaryDtls(flag:any){
    if (flag == "N") {
      this.financeSummaryReqData = {
        "MODULE_ID": "LOANSUM",
        "PREFERRED_CCY": "",
        "simulate": `N`
      }
    }
    if (flag == "Y") {
      this.financeSummaryReqData = {
        "MODULE_ID": "LOANSUM",
        "PREFERRED_CCY": "",
        "REFRESH": "Y",
        "simulate": `N`
      }
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/loansSummary.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.financeSummaryReqData)
     }
    // return this.http.get('/assets/simulateAPI/loansSummary.json');
    //  return this.http.post(`${environment.restAPI}`, this.financeSummaryReqData);
     
  }
  loanDetailsApiCall(accNumber:any){
    let financeDetailsReqData = {
      "MODULE_ID": "LOANDETAIL",
      "PREFERRED_CCY": "",
      "LOAN_ACC_NO": accNumber,
      "simulate": `N`
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/loanDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`,financeDetailsReqData)
     }

    // return this.http.get('http://localhost:4200/assets/simulateAPI/loanDetails.json');
    // return this.http.post(`${environment.restAPI}`, financeDetailsReqData);
  }
  loanRecentTransactionsApiCall(accNum:any,advancedSearchdata:any){
    let financeStatementReqData = {
      "MODULE_ID": "LOANSTMNT",
      "PREFERRED_CCY": "",
      "LOAN_ACC_NO": accNum,
      "SELECTED_RANGE": advancedSearchdata.period,
      "FILTER_DATE_VALUE_DATE":advancedSearchdata.fromDate,
      "FILTER_DATE_VALUE_DATE2":advancedSearchdata.toDate,
      "simulate": `N`,
      "CIF_NO": advancedSearchdata.data.CIF_NO,
      "COUNTRY_CODE": advancedSearchdata.data.REQ_COUNTRY_DESC,
      "UNIT_ID": advancedSearchdata.data.UNIT_ID,

    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/loanRecentTransaction.json');
     }else{
     return this.http.post(`${environment.restAPI}`,financeStatementReqData)
     }


    //return this.http.get('http://localhost:4200/assets/simulateAPI/loanRecentTransaction.json');
    // return this.http.post(`${environment.restAPI}`, financeStatementReqData);
  }

  getdeposistsActDtls(){
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/casaaccountDetails.json')
     }else{
      return this.http.get('assets/simulateAPI/casaaccountDetails.json')
     }    
  }

  getexternalActDtls(){
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/casaaccountDetails.json')
     }else{
      return this.http.get('assets/simulateAPI/casaaccountDetails.json')
     }      
  }

  getdebitlookup(){
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/debitlookup.json')
     }else{
      return this.http.get('assets/simulateAPI/debitlookup.json')
     }    
    
  }


  /** ChequeBook Request Start**/
  getChequeBookRequest(){
    this.reqData = {
      "MODULE_ID": "CHEQINQACCLKP",
      "PREFERRED_CCY": "",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/chequeBook.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
     //return this.http.get('/assets/simulateAPI/chequeBook.json')
  }

  getcheckbooksize(data: any) {
    // this.reqData = {
    //   "headerValue": {
    //     "moduleId": "GETFLDDATA",
    //     "simulate": `${environment.isSimulate}`
    //   },
    //   "dataValue": {
    //     "action": "GET_CHEQUEBOOK_SIZE",
    //     "unitId": data.UNIT_ID,
    //     "accCcy": data.OD_CCY_CODE,
    //     "debAccNo": data.OD_ACC_NO
    //   },
    //   "footerValue": {}

    // }

    this.reqData ={      
        "headerValue": {
            "moduleId": "GETFLDDATA",
            "simulate": `${environment.isSimulate}`
        },
        "dataValue": {
            "action": "GET_CHEQUEBOOK_SIZE",
            "unitId": data.UNIT_ID,
            "accCcy": data.OD_CCY_CODE,
            "debAccNo": data.OD_ACC_NO,
            "cif": data.COD_CORECIF,
            "productName": "CORESVS",
            "subProductName": "CHEQUES",
            "functionCode": "CHQREQ"
        },
        
        "footerValue": {}
    }
    
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-size.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    
    //return this.http.get('/assets/simulateAPI/cb-size.json')    
      //return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getbranchlookup(data: any): Observable<any> {
    this.reqData =
    {
      "headerValue": {
        "moduleId": "BRANCHLKP",
        "simulate": `${environment.isSimulate}`
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
        "accCcy": data.OD_CCY_CODE,
        "unitId": data.UNIT_ID,
        "odPortalAccId":data.OD_PORTAL_ACC_NO,
        "groupBy": "",
        "productName": "CORESVS",
        "subProductName": "CHEQUES",
        "functionCode": "CHQREQ"
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-collectionBranch.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    //return this.http.get('/assets/simulateAPI/cb-collectionBranch.json')  
    // return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getchequecharges(data: any) {
    this.reqData = {

      "headerValue": {
        "moduleId": "GETFLDDATA",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "action": "CHARGES_INFO",
        "unitId": data.UNIT_ID,
        "accCcy": data.OD_CCY_CODE,
        "debAccNo": data.OD_ACC_NO,
        "cif": data.COD_CORECIF,
        "productName": "CORESVS",
        "subProductName": "CHEQUES",
        "functionCode": "CHQREQ"
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-charges.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    //  return this.http.post(`${environment.restAPI}`, this.reqData)
    //return this.http.get('assets/simulateAPI/cb-charges.json')
  }

  getcheckbookpersonlization(data: any) {
    this.reqData = {
        "headerValue": {
          "moduleId": "CHQPRESONALIZATION",
          "simulate": `${environment.isSimulate}`
        },
        "dataValue": {
          "userNo": "",
          "gcif": "",
          "accountId":data.OD_ACC_NO,
          "inquiryFlag":"Y",
          "unitId": data.UNIT_ID,
          "groupBy": ""
          },
        "footerValue": {}     
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-personalization.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    //return this.http.get('/assets/simulateAPI/cb-personalization.json')    
      // return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getsubmitsuccess(params :any) {
    var vchecksize = params.vchecksize;
    var vnumbooks = params.vnumofbooks;
    var vmodeofdelivery = params.vmodeofdelivery;
    var vbymailsend = params.bymailsend;
    var vcollectfrombranchselection = params.vbranchselection;
    var vholderid = params.holderid;
    var vholdername = params.holdername;
    this.reqData =
    {
      "headerValue": {
        "moduleId": "CHQBKINIT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "INPUT_GCIF": "",
        "INPUT_USER_NO": "",
        "TRANSACTION_FLAG": "Y",
        "INPUT_DEBIT_ORG_ACC_NO": params.vaccno,
        "INPUT_VALUE_DATE": "",
        "INPUT_REFERENCE_NO": "",
        "OD_SUBPROD_CODE": "CHEQUES",
        "INPUT_TXN_STATUS": "RA",
        "REQUEST_TYPE": "CONFIRM",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_FUNCTION_CODE": "CHQREQ",
        "INPUT_SUB_PRODUCT": "CHEQUES",
        "INPUT_PRODUCT": "CORESVS",
        "PAGE_CODE_TYPE": "CHEQUE_BOOK_REQUEST",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_CUST_TYPE": "C",
        "ODTXNTYPE": "T",
        "INPUT_CONFIRMATION": "C",
        "INPUT_LANGUAGE_ID": "en_US",
        "INPUT_MODE": "CONFORM_SUBMIT",
        "CHQ_TYPE_ID": "",
        "CHQ_TYPE": "",
        "CHQ_CCY": "",
        "VAT_ACCNO": "",
        "CHQ_ACCNO": "",
        "COUNTRY": params.vcountry,
        "CURRENCY": params.vcurrency,
        "INST_STATUS": "",
        "INST_NUMBER": "",
        "CHARGE_AMOUNT": "",
        "VAT_AMOUNT": "",
        "CHEQUE_SPL": "No",
        "COL": vcollectfrombranchselection,
        "AUTHPERSON_NAME": "",
        "AUTHPERSON_ID": "",
        "CORPADDRESS_FIELD": "",
        "CHE_DEL": vmodeofdelivery,
        "CUST_CHEQUE_TYPE": vchecksize,
        "CUST_CHEQUE_TYPEE": params.chequeBookTypeCode,
        "AUTHPERSON_NAME1": "",
        "AUTHPERSON_ID1": "",
        "NO_BK": vnumbooks,
        "INPUT_DEBIT_CURRENCY": params.vcurrency,
        "PARAM2": params.vsecAuthCode,
         "PARAM1": params.vOtpValue,
         "AUTH_TYPE_O":params.AUTH_TYPE_O
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/cb-submitResponse.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    //return this.http.get('assets/simulateAPI/cb-submitResponse.json')
  }

  /** ChequeBook Request End**/
    
  /** Generate statement start **/
  getGenerateStatementInfo(){
    this.reqData = {
      "MODULE_ID": "EXPACCACCLKP",
      "PREFERRED_CCY": "AED",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "simulate": `${environment.isSimulate}`
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/generateStatement.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    //return this.http.get('/assets/simulateAPI/generateStatement.json')
    //  return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  submitGenerateStatementCall(accountdetails: any, fromdate: any, todate: any, exportas: any) {
    var vfromdate = fromdate;
    var vtodate = todate;
    var vexportas = exportas;
    this.reqData = {
      "headerValue": {
        "moduleId": "EXPACCINIT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "INPUT_GCIF": "",
        "INPUT_USER_NO": "",
        "TRANSACTION_FLAG": "Y",
        "INPUT_DEBIT_ORG_ACC_NO": "",
        "INPUT_VALUE_DATE": "02/12/2021",
        "INPUT_REFERENCE_NO": "",
        "OD_SUBPROD_CODE": "EXPACC",
        "INPUT_TXN_STATUS": "RI",
        "REQUEST_TYPE": "CONFIRM",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_FUNCTION_CODE": "MULACC",
        "INPUT_SUB_PRODUCT": "EXPACC",
        "INPUT_PRODUCT": "CORESVS",
        "PAGE_CODE_TYPE": "MULTI_EXPORT_DOWN",
        "INPUT_CHANNEL_ID": "3",
        "INPUT_CUST_TYPE": "C",
        "ODTXNTYPE": "T",
        "INPUT_CONFIRMATION": "C",
        "INPUT_LANGUAGE_ID": "en_US",
        "INPUT_MODE": "CONFORM_SUBMIT",
        "CRITERIA_TYPE": "ACC",
        "TYPE": "Request",
        "EXP_TYPE": vexportas,
        "JSON_TO_HASH_MAP_SUPPORT_FLAG": "TRANS_REF_LIST",
        "FROM_DATE": vfromdate,
        "TO_DATE": vtodate,
        "SELECTED_RECORDS": accountdetails
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/generate-statement-submit.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    //return this.http.get('/assets/simulateAPI/generate-statement-submit.json')    
    // return this.http.post(`${environment.restAPI}`, this.reqData)
  }
  /** Generate statement end **/

  getGenericServiceRequestData(){
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/GenericServiceRequestDetail.json');
     }else{
     return this.http.get('assets/simulateAPI/GenericServiceRequestDetail.json');
     }

    // return this.http.get('/assets/simulateAPI/GenericServiceRequestDetail.json')
  }

  /** View E-statement start **/
  getAccountSummaryCall(flag: String){
      if (flag == "N") {
        this.accountSummaryReqData = { "MODULE_ID": "CASASUMMARY", "simulate": `${environment.isSimulate}` }
      }
      if (flag == "Y") {
        this.accountSummaryReqData = { "MODULE_ID": "CASASUMMARY", "REFRESH": "Y", "simulate": `${environment.isSimulate}` }
      }


      if(environment.localURL){
        return this.http.get('assets/simulateAPI/casasummary.json');
       }else{
       return this.http.post(`${environment.restAPI}`,this.accountSummaryReqData)
       }

      //return this.http.get('/assets/simulateAPI/casasummary.json');
      //return this.http.post(`${environment.restAPI}`, this.accountSummaryReqData); 
  }
  geteStatementTableInfo(formData: any){ 
      let reqData = {
        "headerValue": {
          "moduleId": "VIEWESTMT"
        },
        "dataValue": {
          "userNo": "",
          "gcif": formData.gcifnumber,
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
          "unitId": formData.unitId,
          "languageId": "en_US",
          "groupBy": "",
          "reqCustomerId": formData.cifnumber,
          "reqFromDate": '',
          "reqToDate": '',
          "accountNum":formData.accNum
        },
        "footerValue": {}      
      }

      if(environment.localURL){
        return this.http.get('assets/simulateAPI/e-statementdata.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }

      //return this.http.get('assets/simulateAPI/e-statementdata.json');
      //return this.http.post(`${environment.restAPI}`, reqData);    
  }

  downloadApi(url: string){    
    //return this.http.get(url);
    return this.http.get(url, { observe: 'response' });
}
/** View E-statement end **/

  getServicereqdowncenterDtls(params:any){
    this.reqData = {
      "headerValue": {
        "moduleId": "STMTINQ",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,       
        "filterList": [
          {
            "filterField": params.filterfield,
            "filterConstraint": params.filterconstraint,
            "filterValue": "",
            "fromAmt": "",
            "toAmt": "",
            "fromDate": params.fromDate,
            "toDate": params.toDate
          }
        ],
        "unitId": "",
        "groupBy":"",
        "filterFlag": params.filterflag
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/ServiceReqDownloadCenter.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('/assets/simulateAPI/ServiceReqDownloadCenter.json')
  }
  getOtherReqDtls(params:any){
    this.reqData = {
      "headerValue": {
        "moduleId": "OTHERREQINQ",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
        "export": "",
        "exportType": ""
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,        
        "filterMap": [
          {
            "filterField": params.filterfield,
            "filterConstraint": params.filterconstraint,
            "filterValue": "",
            "fromAmt": "",
            "toAmt": "",
            "fromDate": params.fromDate,
            "toDate": params.toDate
          }
        ],
        "unitId": "",
        "groupBy": "",
        "filterFlag": params.filterflag
      },
      "footerValue": {}
    }  

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/OtherReq.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }

    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('/assets/simulateAPI/OtherReq.json')
  }

  exportDocument(url: string) {
    return this.http.get(url, { observe: 'response' });

  }


  //----------------------------- Additional Account Start--------------------------------
  
  //----------------------------- Currency --------------------------------

  getCurrency(params: any) { // verfied by harshita
    let reqData = {
      "headerValue": {
          "moduleId": "ACCCURRENCY",
          "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
         "action": "GET_CURRENCY_DETAILS_ACTION",
         "unitId": params.unitId
      },
      "footerValue": {}
  }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccCurrency.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //----------------------------- Reason --------------------------------

  getReason(params : any) { // verfied by harshita
    let reqData = {
      "headerValue": {
          "moduleId": "ACCREASON",
          "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
          "action": "GET_REASON_DETAILS_ACTION",
          "unitId": params.unitId,     
      },
      "footerValue": {}
  }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccReason.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //----------------------------- Account --------------------------------

  getAccount(params : any) {  // verfied by harshita
    let reqData = {
      "MODULE_ID": "ADDTACCLKP",
      "simulate": `${environment.isSimulate}`,
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccAccount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }


  getAddAccAuthorization(params : any) { // verfied by harshita
    let reqData = {
      "headerValue": {
        "moduleId": "ACCAUTHCHECK",
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "unitId": params.unitId,
        "cif": "", // harshota told to pass it empty value
        "productCode": "CORESVS",//harshita told to pass static value
        "subProdCode": "ACCINT",//harshita told to pass static value
        "funcCode": "ACCSUB",//harshita told to pass static value
        "amount": "",//harshita told to pass empty value
        "accNo": "",//harshita told to pass empty value
        "pymntCurrency": "",//harshita told to pass empty value
        "debitCurrency": ""//harshita told to pass empty value
      }
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccAuthorization.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }


  addAccSubmit(params: any){ // verfied by harshita
    let reqData = {
      "headerValue": {
        "moduleId": "ACOPNINIT",//harshita told to pass static value
        "simulate": `${environment.isSimulate}`,
      },
      "dataValue": {
        "PAYMENT_TYPE": "ACCINT",//harshita told to pass static value
        "FUNCTION_CODE": "ACCSUB",//harshita told to pass static value
        "ACC_NO_REM": params.linkAccount, // harshita told it should link account number
        "CIF_NUM": params.CIF_NUM, // harshita told to pass the selected account cif number i.e. COD_CORECIF
        "INPUT_TXN_STATUS": "RA",//harshita told to pass static value
        "IsValidateToken": "",//harshita told to pass empty value
        "AUTH_TYPE_O": params.authType,//harshita told to pass dynamic value
        "PARAM2": params.PARAM2,//harshita told to pass dynamic value
        "PARAM1": params.PARAM1,//harshita told to pass dynamic value
        "SEL_PARSED_RULE_ID": params.SEL_PARSED_RULE_ID,//harshita told to pass dynamic value
        "SELECTION_FLAG": params.SELECTION_FLAG,//harshita told to pass dynamic value
        "USER_NUMBER_LIST": params.USER_NUMBER_LIST,//harshita told to pass dynamic value
        "sefAuthFlag": params.sefAuthFlag, //harshita told to pass dynamic value
        "currency": params.currency, // harshita told to pass dynamic value
        "reason": params.reason, // harshita told to pass dynamic value
        "linkAccount": params.linkAccount, // harshita told to pass dynamic value
        "OD_SUBPROD_CODE": "ACCINT",//harshita told to pass static value
        "INPUT_SUB_PRODUCT": "ACCINT",//harshita told to pass static value
        "INPUT_PRODUCT": "CORESVS",//harshita told to pass static value
        "OD_PRODUCT_CODE": "CORESVS",//harshita told to pass static value
        "PRODUCT_NAME": "CORESVS",//harshita told to pass static value
        "currencyDesc": params.currencyDesc,
        "reasonCode":params.reasonId
      },
      "footerValue": {
              
      }
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }


   
   additionalAccountRequest(params:any){ // verfied by harshita
    this.reqData = {
      "headerValue": {
        "moduleId": "ADDACCDETAILS",//harshita told to pass static value
        "simulate": `${environment.isSimulate}`,//harshita told to pass dynamic value
        "sortColumn": params.sortcolumn,//harshita told to pass dynamic value
        "sortOrder": params.sortDirection,//harshita told to pass dynamic value
      },
      "dataValue": {
        "fromRowNo": params.fromRow,//harshita told to pass dynamic value
        "toRowNo": params.toRow,//harshita told to pass dynamic value
        "filterMap": [
          {
            "filterField": params.filterfield,//harshita told to pass dynamic value
            "filterConstraint": params.filterconstraint,//harshita told to pass dynamic value
            "filterValue": ""//harshita told to pass empty value
          }
        ],
        "unitId": params.unitId, //harshita told to pass dynamic value
        "groupBy": "",//harshita told to pass empty value
      },
      "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/additionalRequest.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
  }

  //----------------------------- Additional Account End -------------------------------

    getInvoiceData(reqObj:any){
      let reqData;
      if (environment.localURL) {
        return this.http.get('assets/simulateAPI/invoiceDetails.json');
      } else {
        return this.http.post(`${environment.restAPI}`, reqData);
      }
    }
    submitInvoiceApi(reqObj:any){
      let reqData;
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/Payment_Submit.json');
      }else{
        return this.http.post(`${environment.restAPI}`,reqData)
      }
    }

    downloadMT103(params : any){
      let reqData = {
        "headerValue": {
          "moduleId": "EXPORTFILE",
          "simulate": "N",
        },
        "dataValue": {
          "RequestType": params.reqType ? params.reqType : '',
          "RequestFormat":params.fileType ? params.fileType : '',
          "AccountNo": params.accNo ? params.accNo : '',
          "fromDate": '',
          "toDate": '',
          "ProductCode": params.productCode ? params.productCode : '',
          "SubProductCode":params.subProdCode ? params.subProdCode : '',
          "accountId": params.accId ? params.accId : '',
          "journalId": params.journalId ? params.journalId : '',
          "valueDate": params.valDate ? params.valDate : '',
          "FunctionCode": params.functionCode ? params.functionCode : '',
          "ChannelId":"M",
          "Action":params.action
        },
        "footerValue": {
          userNo: params.userNo,
          gcif: params.gcif
        }
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/MT103Pdf.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }
    //------------------------------BalanceCertificate------------------------------------
    balanceCertificate(){
      let reqData = {
        "headerValue": {
        "moduleId": "BALANCIFLKUP",
        "simulate": "N"
         },
         "dataValue": {
         "productName":"CORESVS",
         "subProductName":"BALCERT",
         "functionCode":"BALCFNC"
         },
         "footerValue": {
         }
        };
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/nationalAddress.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }

    submiNationalApi(reqObj:any){
      let reqData;
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/Payment_Submit.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }

    auditUserList(params: any){
      let reqData = {
        "headerValue": {
            "moduleId": "BALANAUDITLIST",
            "simulate": "N"
        },
        "dataValue": {
           "action": "GET_AUDITOR_DETAILS_ACTION",
           "unitId": params.unitId,
        },
        "footerValue": {}
    };
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/auditUserList.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }

    BalanceCityLists(params: any){
      let reqData = {
        "headerValue": {
            "moduleId": "IBANCITYLIST",
            "simulate": "N"
        },
        "dataValue": {
          "countryCode":"SA",
        },
        "footerValue": {}
    };
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/balanceCityLists.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }

    downloadBalCertificate(params:any){
      let reqData = {
        "headerValue": {
          "moduleId": "DOWNLOADBALANCE",
          "simulate": "N",
        },
        "dataValue": {
          "Refno": params.refNo
        },
        "footerValue": {}
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/balanceCertificatePdf.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
    }

    submitBalanceApi(params:any){
      let reqData = {
        "headerValue": {
          "moduleId": "BALANSUBMIT",
          "simulate": "N"
        },
        "dataValue": {
          "PAYMENT_TYPE": "BALCERT",
          "FUNCTION_CODE": "BALCFNC",
          "CIF_NUM": params.cifNo ? params.cifNo : '',
          "INPUT_TXN_STATUS": "RA",
          "Auditor": params.auditor ? params.auditor : '',
          "city": params.city ? params.city : '',
          "POBox" : params.poBox ? params.poBox : '',
          "Postalcode" : params.postalCode ? params.postalCode : '',
          "cityCode": 'SA',
          "AsOnDate" : params.date ? params.date : ''
        },
        "footerValue": {}
      };
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/balanceSubmit.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
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

    getTransferSummaryDetails(params: any){
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
        return this.http.get('assets/simulateAPI/transferSummaryDetails.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqPayload)
       }
  
      // return this.http.get('http://localhost:4200/assets/simulateAPI/loanDetails.json');
      // return this.http.post(`${environment.restAPI}`, financeDetailsReqData);
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
           "accountId": params.accId,
           "postingDate": params.postingDate,
           "journalId": params.journalId
            }
            
           }
           if(environment.localURL){
            return this.http.get('assets/simulateAPI/swiftGPIDetails.json');
           }else{
            return this.http.post(`${environment.restAPI}`, req)
           }
      }

      downlodIBAN(params:any){
        let req ={
            "headerValue": {
              "moduleId": params.moduleId
            },
            "dataValue": {
              "accountNo":params.accountNo,
              "cifNo" : params.cifNo,
            },
            "footerValue": { }
        }
        if(environment.localURL){
          return this.http.get('assets/simulateAPI/ibanLetter.json');
         }else{
          return this.http.post(`${environment.restAPI}`, req)
         }
      }


      validateCIFAccounts(params:any){
        let req ={
          "headerValue": {
          "moduleId": "BALACCSVALID",
          "simulate": "N"
           },
           "dataValue": {
          
           "productName":"CORESVS",
           "subProductName":"BALCERT",
           "functionCode":"BALCFNC",
            "CIF_NUM": params.cifNo
           },
           "footerValue": {}
          }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/validateCIFAcconts.json');
       }else{
        return this.http.post(`${environment.restAPI}`, req)
       }

      }

  getNationAddressDetails(params:any){
    let reqData = {
      "headerValue":{
      "moduleId":"NATADDDETAILS"
      },
      "dataValue":{
      "id":params.id,
      "productName":params.productName,
      "subProductName":params.subProductName,
      "functionCode":params.functionCode,
      "unitId":params. unitId
      },
      "footerValue":{}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/updateNationalAddressDetails.json');
    }else{
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }
  getCrExpiryDetails(params:any){
    let reqData = {
      "headerValue": {
        "moduleId": "CRDETAILS",
        "simulate": "N",
      },
      "dataValue": {
        "subProductName": params.subProductName,
        "unitId": params. unitId
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/crExpiryDetailsData.json');
    }else{
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  downloadRecentTransactionPDF(params:any){
    let req ={
        "headerValue": {
          "moduleId": "ACCTRANRECEIPT"
        },
        "dataValue": {
          "accountNo":params.accountNo,
          "ibanNo" : params.ibanNo,
          "description" : params.description,
          "amount" : params.amount,
          "currency" : params.currency,
          "branch" : params.branch,
          "accountName" : params.accountName,
          "accountType" : params.accountType,
          "transactionDesc" : params.transactionDesc,
          "beneficiaryName" : params.beneficiaryName,
          "processingDate" : params.processingDate,
        },
        "footerValue": { }
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/ibanLetter.json');
     }else{
      return this.http.post(`${environment.restAPI}`, req)
     }
  }

  getCorporateAccountDetails(params:any){
    let req = {
      "headerValue": {
        "moduleId": "CORPCUSTDETAIL"
      },
      "dataValue": {
        "shortCIF": params.coreCif,
        "languageId": "en_US"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/getCorporateAccountDetails.json');
     }else{
      return this.http.post(`${environment.restAPI}`, req)
     }
  }


  ValidateAdditionalAccount(params : any){
    let payLoad = {
      "headerValue": {
          "moduleId": "ADDACCCVALIDATION",
          "simulate": "N"
      },
      "dataValue": {
          "currency": params.currency,
          "productType": params.productType,
          "country": params.country,
          "nationalIdNumber": "",
          "cif":params.cif,
          "reasonCode":params.reasonCode,
          "customerName":""
      },
      "footerValue": {}
  }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/AddAccValidation.json');
   }else{
    return this.http.post(`${environment.restAPI}`, payLoad)
   }
  }
}
