import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { amountUnFormat } from 'src/app/utility/amount-unformat';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationManagementService {
  rootScopeData: RootScopeDeclare = RootScopeData;
  reqData: any;
  // private reqData:any
  constructor(private http:HttpClient) { }
selfAuthCheck(reqObj: any){
  let reqData = {
    "headerValue": {
      "moduleId": "SELFAUTHCHECK"
    },
    "dataValue": {
      "userNo": "",
      "gcif": "",
      "unitId": reqObj.unitId ? reqObj.unitId : 'IGTBAE',//CIF table or IGTBSA
      "cif": reqObj.cifNumber,//CIF number
      "productCode": "PAYMNT",
      "subProdCode": reqObj.subProdCode,
      "funcCode": reqObj.funcCode,
      "amount": amountUnFormat(reqObj.paymentAmount),
      "accNo": reqObj.accNo,
      "pymntCurrency": reqObj.beneCurrencyCode,
      "debitCurrency":reqObj.debitCurrencyCode
    },
    "footerValue": {}
  }


  if(environment.localURL){
    return this.http.get('assets/simulateAPI/secFactAuth.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }

  //return this.http.get('/assets/simulateAPI/secFactAuth.json');
  // return this.http.post(`${environment.restAPI}`, reqData)
}
secondFactorAuthApiCall (reqObj: any){
  let reqData = {
    "headerValue": {
        "moduleId": "SECFACINIT",
        "simulate": `${environment.isSimulate}`,
        //"_dinsess": "7c4a0854-0be4-451d-b0fa-55e76a4fea39"
    },
    "dataValue": {
        "action": "",
        "pdt": "",
        "subPdt": "",
        "amount": "",
        "accNo": "",
        "unitId": "",
        "cif": "",
        //"languageId": "en_US"
    },
    "footerValue": {}
}
if(environment.localURL){
  return this.http.get('assets/simulateAPI/secondFactorAuthApiCall.json', this.reqData);
 }else{
 return this.http.post(`${environment.restAPI}`,reqData)
 }

// return this.http.get('/assets/simulateAPI/secondFactorAuthApiCall.json', this.reqData);
//  return this.http.post(`${environment.restAPI}`, reqData)
}
getTransactionLimit(data:any): Observable<any> {
  let reqData = {
    "headerValue": {
      "moduleId": "FETCHTXNLIMIT",
      "simulate": `${environment.isSimulate}`,
    },
    "dataValue": {
      "unitId": "IGTBSA",
        "cif": data.cifNo,
          "productName": "PAYMNT",
      "subProductName": "BKSRNT",
      "functionCode": "CRRNTS"

    },
    "footerValue": {}
  };

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/QuickTransactionLimit.json');
   }else{
   return this.http.post(`${environment.restAPI}`,reqData)
   }

//  return this.http.get('/assets/simulateAPI/QuickTransactionLimit.json');
  // return this.http.post(`${environment.restAPI}`, reqData)
}

  getQuickTransferConfigSubmit(data:any, ipsData:any, userInfo:any,otp:any,otpRef:any,authType:any): Observable<any> {
    this.reqData = {
      "headerValue": {
      "moduleId": "IPSREGSUB",
      "simulate":  `${environment.isSimulate}`,
       },
       "dataValue": {
       "accNo": ipsData.OD_ACC_NO,// deb acc portal acc num
       "proxy1":data[0].MOBILE_NUMBER?11:"",//mobile
       "proxy2":data[0].EMAIL_ID?12:"",//email
       "proxy3":data[0].NATIONAL_ID?13:"",
       "proxy1Value":data[0].MOBILE_NUMBER, // mobile
       "proxy2Value":data[0].EMAIL_ID, // email
       "proxy3Value":data[0].NATIONAL_ID, // national_id
       "proxy1Key":data[0].MOBILE_NUMBER_FLAG, //Mobile toggled checked Yes orelse No
       "proxy2Key":data[0].EMAIL_ID_FLAG,//Email toggled checked Yes orelse No
       "proxy3Key":data[0].NATIONAL_ID_FLAG,//NationalId toggled checked Yes orelse No
       "cqtlCurrency":"",//NA (empty)
       "cqtlAmt":"",//NA(empty)
       "qltCurrency":"",//NA(empty)
       "qltAmt":"",//NA(empty)
       "ipsAuthDate":"",//NA
       "ipsAuthId":"",//NA
       "ipsMakerId":userInfo.userNo,//user no(Rest Controller)
       "Status":"U", // Leave as it is
       "Modes":"R",// Leave as it is
       "Action":"action",// Leave as it is
       "TRANSACTION_FLAG":"Y", // selectionFlag
       "INPUT_USER_NO":userInfo.userNo,//user no(Rest Controller)
       "INPUT_ACTION":"SAVE_TXN",
       "INPUT_GCIF":"",
       "INPUT_FUNCTION_CODE":"CRREGI",
       "INPUT_PRODUCT":"PAYMNT",
       "INPUT_SUB_PRODUCT":"IPSREG",
       "INPUT_DEBIT_ACC_NO":ipsData.OD_PORTAL_ACC_NO, // OD_PORTAL_ACC_NO
       "INPUT_DEBIT_AMOUNT":"",
       "INPUT_DEBIT_CURRENCY":ipsData.OD_CCY_CODE,
       "CIF_NO":ipsData.COD_CORECIF, // COD_CORECIF
       "UNIT_ID":ipsData.UNIT_ID,
       "INPUT_DEBIT_ORG_ACC_NO":ipsData.OD_ACC_NO, // OD_ACC_NO
       "INPUT_LANGUAGE_ID":userInfo.mLanguage,//Language Id from Restcontroller servlet
       "INPUT_DEBIT_BRANCH":ipsData.BRANCH_NAME, // BRANCH_NAME
       "INPUT_TXN_STATUS":"RA",
       "INPUT_CUST_TYPE":"C",
       "REQ_COUNTRY_CODE":ipsData.REQ_COUNTRY_CODE, // REQ_COUNTRY_CODE
       "INPUT_MODE":"IPS",
       "BENE_ACC_NO":"",
       "BENE_CURRENCY":"SAR", // OD_CCY_CODE
       "INPUT_VALUE_DATE":"",
       "OD_SUBPROD_CODE":"IPSREG",
       "PAGE_CODE_TYPE":"PMNT_TRNFR",
       "payAmt":"0",
       "PARAM1": otp,
       "PARAM2": otpRef,
       "AUTH_TYPE_O":authType
       },
       "footerValue": {
        }
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/quickTransferConfigSubmit.json');
       }else{
       return this.http.post(`${environment.restAPI}`,this.reqData)
       }
    // return this.http.get('/assets/simulateAPI/quickTransferConfigSubmit.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData);
  }

  getdebitlookup(): Observable<any>{
    this.reqData={
      "MODULE_ID": "DEBITLKP",
      "PREFERRED_CCY": "",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "BALANCE_REQUIRED": "N",
      "simulate": `${environment.isSimulate}`
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/debitlookup.json');
     }else{
     return this.http.post(`${environment.restAPI}`,this.reqData)
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('/assets/simulateAPI/debitlookup.json')
  }

  getIPSRegistrationSummary() {
    let reqData = {
      "headerValue": {
        "moduleId": "IPSREGSUM",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue":{
               
      },
        "footerValue": {
          "userNo": "",
          "gcif": ""
      }
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/getIPSRegistrationSummary.json');
     }else{
     return this.http.post(`${environment.restAPI}`, reqData )
     }
    // return this.http.post(`${environment.restAPI}`, reqData );
    // return this.http.get('assets/simulateAPI/getIPSRegistrationSummary.json')
  }

  submitManageAlerts(storedData:any) {
    let accnum = this.rootScopeData.userInfo.userNo;
    let reqData = {
      "headerValue": {
        "moduleId": "SAVEMANAGEALRTS"
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "alertSubscription":storedData ,
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {
        "userNo": accnum,
        "gcif": ""
      }
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/submitManageAlerts.json');
     }else{
     return this.http.post(`${environment.restAPI}`, reqData )
     }
    //  return this.http.post(`${environment.restAPI}`, reqData);
    // return this.http.get('assets/simulateAPI/submitManageAlerts.json')
  }

  fetchAccounts(): Observable<any>{
    this.reqData = {
      "MODULE_ID": "IPSFETCACCTS",
      "OD_USER_NO": "",
      "OD_GCIF": "",
      "DEBIT_UNIT_ID": "IGTBSA",
      "BALANCE_REQUIRED": "Y",
      "simulate": `${environment.isSimulate}`,
      // "_dinsess": "d7c2ed0f-d24c-477b-a7f0-c5aa37a7fb39",
      // "languageId": "en_US"
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/fetchAccountsIPS.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
    // return this.http.get('/assets/simulateAPI/fetchAccountsIPS.json')
    //  return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getProxyIdentifierForIPSRegistration(accountNo: any,ibanAccNo: any,unitId:any): Observable<any>{
    this.reqData ={
      "headerValue": {
        "moduleId": "IPSREGPROXYIBAN",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "accountNo": accountNo, // debitAccount accNum
        "ibanAccNo": accountNo, // debitAccount accNum as confirmed by Pown
        "unitId": unitId // accountUnitId
      },
      "footerValue": {
      }
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/ipsRegProxyIban.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    //return this.http.get('/assets/simulateAPI/IPSproxyDetails.json')
  }

  getProxyIdentifierData(accountNo: any,ibanAccNo: any): Observable<any>{
    this.reqData ={
      "headerValue": {
        "moduleId": "IPSREGPROXYIBAN",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "accountNo": accountNo, // debitAccount accNum
            "ibanAccNo": ibanAccNo,
        "unitId": "IGTBSA",
        "languageId": "en_US"
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/IPSproxyDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    //return this.http.get('assets/simulateAPI/IPSproxyDetails.json')
  }
  getProxyIdentifierDetailsData(accountNo: any,ibanAccNo: any): Observable<any>{
    this.reqData = {
      "headerValue": {
        "moduleId": "IPSREGIBANPROXY",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {

        "proxyType": "M or E or N",
        "proxyValue": "005sabrco@gmail.com",
        "unitId": "",
        "languageId": "en_US"
      },
      "footerValue": {
                "userNo": "202204007003",
        "gcif": "10000187"
      }
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/IPSproxyValueDetails.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('assets/simulateAPI/IPSproxyValueDetails.json')
  }

  getReasonLookup(): Observable<any>{
    return this.http.get('assets/simulateAPI/deregistrationReasons.json');
  }

  submitIpsDeRegistration(proxyData: any, account: any, userInfo:any, otp:any, otpRef:any): Observable<any>{
  
    this.reqData = {
      "headerValue": {
      "moduleId": "IPSREGSUB",
      "simulate":`${environment.isSimulate}`
       },
       "dataValue": {
       "accNo": account.OD_ACC_NO,
       "proxy1":proxyData.mobile ? 11 : '',
       "proxy2":proxyData.email ? 12: '',
       "proxy3":proxyData.nationalId ? 13 : '',
       "proxy1Value":proxyData.mobile,
       "proxy2Value":proxyData.email,
       "proxy3Value":proxyData.nationalId,
       "proxy1Key":proxyData.mobileDeregFlag,
       "proxy2Key":proxyData.emailDeregFlag,
       "proxy3Key":proxyData.nationalIdDeregFlag,
       "cqtlCurrency":"",//NA
       "cqtlAmt":"",//NA
       "qltCurrency":"",//NA
       "qltAmt":"",//NA
       "ipsAuthDate":"",//NA
       "ipsAuthId":"",//NA
       "ipsMakerId":userInfo.userNo,
       "Status":"U",
       "Modes":"D",
       "Action":"DS",
       "TRANSACTION_FLAG":"Y",
       "INPUT_USER_NO":userInfo.userNo,
       "INPUT_ACTION":"SAVE_TXN",
       "INPUT_GCIF":"",
       "INPUT_FUNCTION_CODE":"CRDRGI",
       "INPUT_PRODUCT":"PAYMNT",
       "INPUT_SUB_PRODUCT":"IPSDRG",
       "INPUT_DEBIT_ACC_NO": account.OD_PORTAL_ACC_NO, // OD_PORTAL_ACC_NO
       "INPUT_DEBIT_AMOUNT":"",
       "INPUT_DEBIT_CURRENCY": account.OD_CCY_CODE,
       "CIF_NO": account.COD_CORECIF, // COD_CORECIF
       "UNIT_ID": account.UNIT_ID,
       "INPUT_DEBIT_ORG_ACC_NO": account.OD_ACC_NO, // OD_ACC_NO
       "INPUT_LANGUAGE_ID":userInfo.mLanguage,
       "INPUT_DEBIT_BRANCH":account.BRANCH_NAME,
       "INPUT_TXN_STATUS":"RA",
       "INPUT_CUST_TYPE":"C",
       "REQ_COUNTRY_CODE":account.REQ_COUNTRY_CODE,
       "INPUT_MODE":"IPS",
       "BENE_ACC_NO":"",
       "BENE_CURRENCY":"SAR",
       "INPUT_VALUE_DATE":"",
       "OD_SUBPROD_CODE":"IPSDRG",
       "PAGE_CODE_TYPE":"PMNT_TRNFR",
       "payAmt":"0",
       "PARAM1": otp,
       "PARAM2": otpRef,
       "reasonCode":proxyData.reasonCode? proxyData.reasonCode : '',
       "reasonDesc":proxyData.reasonDescription ? proxyData.reasonDescription : '',
       },
       "footerValue": {}

    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/quickTransferConfigSubmit.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
  //  return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('assets/simulateAPI/submitDeRegistration.json')

  }
  submitQuickTransfer(data :any) {
    this.reqData = {
      "headerValue": {
        "moduleId": "IPSREGSUB",
        "simulate": "N"
      },
      "dataValue": {

        "cqtlCurrency": "SAR",//SAR
        "cqtlAmt": parseFloat(amountUnFormat(data.customerLimit))+'',
        "qltCurrency": "SAR",//SAR
        "qltAmt": parseFloat(amountUnFormat(data.ownLimitAmount))+'',
        "ipsAuthDate": "",
        "ipsAuthId": "",
        "ipsMakerId": "",//empty
        "Status": "U",
        "Modes": "Q",
        "Action": "",//empty
        "TRANSACTION_FLAG": "Y",
        "INPUT_USER_NO": "",//empty
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_GCIF": data.gcif,
        "INPUT_FUNCTION_CODE": "CRQTLI",
        "INPUT_PRODUCT": "PAYMNT",
        "INPUT_SUB_PRODUCT": "MNTQTL",
        "INPUT_DEBIT_ACC_NO": data.cifNo,//empty
        "INPUT_DEBIT_AMOUNT": "",//empty
        "INPUT_DEBIT_CURRENCY": "SAR",//SAR
        "CIF_NO": data.cifNo,
        "UNIT_ID": data.unitId,
        "INPUT_DEBIT_ORG_ACC_NO": data.cifNo,//empty
        "INPUT_DEBIT_BRANCH": "",
        "INPUT_TXN_STATUS": "RA",
        "INPUT_CUST_TYPE": "C",
        "REQ_COUNTRY_CODE": "SA",
        "INPUT_MODE": "IPS",
        "BENE_ACC_NO": "",
        "BENE_CURRENCY": "SAR",
        "INPUT_VALUE_DATE": "",
        "OD_SUBPROD_CODE": "MNTQTL",
        "PAGE_CODE_TYPE": "PMNT_TRNFR",
        "payAmt": parseFloat(amountUnFormat(data.customerLimit))+'',
        "PARAM2": data.secAuthRef,
        "PARAM1": data.otp,
        "AUTH_TYPE_O":data.AUTH_TYPE_O

      },
      "footerValue": {
        "userNo": "",//empty
        "gcif": ""//empty
      }
    }
    //debugger;
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/quickTransferConfigSubmit.json');
     }else{
     return this.http.post(`${environment.restAPI}`, this.reqData )
     }
    // console.log(this.reqData)
    //  return this.http.get('assets/simulateAPI/quickTransferConfigSubmit.json');
    //  return this.http.post(`${environment.restAPI}`, this.reqData);
  }


  getCIFLookup(){
    this.reqData = {
      "headerValue": {
        "moduleId": "CIFLKUP",
        "simulate": "N"
      },
      "dataValue": {

        "productName":"PAYMNT",
        "subProductName":"MNTQTL",
        "functionCode":"CRQTLI"
      },
        "footerValue": {
          "userNo": "",
          "gcif": ""
        }
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/CIFLookup.json');
       }else{
       return this.http.post(`${environment.restAPI}`, this.reqData )
       }
      // return this.http.get('assets/simulateAPI/CIFLookup.json');
      // return this.http.post(`${environment.restAPI}`, this.reqData);
  }

  getUserProfileData(){
    let reqData={
      "headerValue": {
        "moduleId": "USERPROFILE",
    },
    "dataValue": {
        "userNo": "",
        "gcif": "",
        "languageId": "en_US"
    },
    "footerValue": {
    "userNo": "202005003160",
    "gcif": "1004"
    }
  }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/userProfile.json')
    }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCropCustomerDetails(data:any){
    let reqData = {
      "headerValue":{
         "moduleId":"CORPCUSTDETAIL"
      },
      "dataValue":{
         "shortCIF":data.cifNo,
         "languageId":"en_US"
      },
      "footerValue":{
         
      }
   }
   
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/corpCustomerDetails.json')
    }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  checkIPSRegIBANProxy(data:any){
    let reqData = {
      "headerValue":{
         "moduleId":"IPSREGIBANPROXY",
         "simulate":"N"
      },
      "dataValue":{
         "proxyType":data.proxyType,
         "proxyValue":data.proxyValue,
         "unitId":"",
         "languageId":"en_US"
      },
      "footerValue":{
         
      }
   }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/IPSproxyValueDetails.json')
    }else{
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }



}

