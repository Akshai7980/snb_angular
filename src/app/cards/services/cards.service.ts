import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private http: HttpClient) {}

  // getDebitLookUp(){
  //   let reqData = {
  //       "MODULE_ID": "ARAMCOLKP",
  //       "OD_USER_NO": "",
  //       "OD_GCIF": "",
  //       "DEBIT_UNIT_ID": "IGTBBH",
  //       "BALANCE_REQUIRED": "Y",
  //       "simulate": `${environment.isSimulate}`,
  //   };

  //   if(environment.localURL){
  //     return this.http.get('/assets/simulateAPI/aramcoDebitLookUp.json');
  //    }else{
  //    return this.http.post(`${environment.restAPI}`,reqData)
  //    }

  // }

  getMadaCardLinkedAccountApiCall(): Observable<any> {
    let reqData = {
      MODULE_ID: 'SADPAYUPACCLKP', // Need to change for Mada card Link account after api provided
      simulate: `${environment.isSimulate}`,
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/madacardLinkedAccount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // getDebitLookUp() {
  //   let reqData = {
  //     MODULE_ID: 'ARAMCOLKP',
  //     OD_USER_NO: '',
  //     OD_GCIF: '',
  //     DEBIT_UNIT_ID: 'IGTBBH',
  //     BALANCE_REQUIRED: 'Y',
  //     simulate: `${environment.isSimulate}`,
  //   };

  //   if (environment.localURL) {
  //     return this.http.get('assets/simulateAPI/aramcoDebitLookUp.json');
  //   } else {
  //     return this.http.post(`${environment.restAPI}`, reqData)
  //   }
  // }

  getAccountList() {
    const reqData = {
        "MODULE_ID": "LKADDACCLKUP",
        simulate: `${environment.isSimulate}`
    }
    // const reqData = {
    //   headerValue: {
    //     moduleId: 'LKADDACCLKUP',
    //     simulate: `${environment.isSimulate}`,
    //   },
    //   dataValue: {
    //     sortColumn: params.sortcolumn,
    //     sortDirection: params.sortDirection,
    //     fromRowNo: params.fromRow,
    //     toRowNo: params.toRow,
    //     unitId: params?.unitId,
    //     groupBy: '',
    //     filterFlag: params.flag,
    //     subPdt: 'LINKADDI',
    //   },
    //   footerValue: {},
    // };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaCardAdditionalAccount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitPoSPurchaseLimit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MGPULTSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        //CIF_NUM: params.account.COD_CORECIF,
        PARAM2: params.secRef,
        PARAM1: params.otp,
        SEL_PARSED_RULE_ID: params.ruleId,
        SELECTION_FLAG: params.stnFlag,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'POSLMFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'MADPOSLIM',
        INPUT_ENTL_VALUE: params.entlVal, //params.account.OD_PORTAL_ACC_NO,
        INPUT_CIF_NO: params.cifNo, //params.account.COD_CORECIF,
        INPUT_UNIT_ID: params.unitId, //params.account.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.orgAccNo, //params.account.OD_ACC_NO,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: params.custType,
        INPUT_REQ_COUNTRY_CODE: params.reqCountry,
        INPUT_VALUE_DATE: params.valueDate,
        INPUT_TXN_CURRENCY: params.txtCurrency,
        INPUT_TXN_AMOUNT: params.txnAmount,
        INPUT_HOST_CODE: 'MGPU',
        INPUT_VERSION_NO: params.versionNo,
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.cardNo,
        EXPIRY_DATE: params.expiryDate,
        STATUS: params.status,
        CARD_NAME: params.cardName,
        CURRENT_LIMIT: params.currentLimit,
        NEW_LIMIT: params.newLimit,
        CURRENCY: params.currency,
        INPUT_CHANNEL_ID: '3',
        //ACCOUNT_NUMBER: params.accountNumber
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaPoSLimitSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMadaCardImage(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADACRDIMG',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardImage.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitAddMadaCard(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'NEWCRDSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.PARAM2,
        PARAM1: params.PARAM1,
        SEL_PARSED_RULE_ID: '4980',
        SELECTION_FLAG: 'Y',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'CRDREQFC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'MADAREQ',
        INPUT_ENTL_VALUE: params.entlVal,
        INPUT_CIF_NO: params.cifNo,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: params.orgAccNo,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: params.custType,
        INPUT_REQ_COUNTRY_CODE: params.reqCountryCode,
        INPUT_VALUE_DATE: params.valueDate,
        INPUT_TXN_CURRENCY: params.txtCurrency,
        INPUT_TXN_AMOUNT: params.txnAmount,
        INPUT_HOST_CODE: 'NWCD',
        INPUT_VERSION_NO: params.versionNo,
        INPUT_SERVICE: 'PAYMNT_FT',
        ACCNO: params.accountNo, 
        FULL_NAME: params.accName,
        STATUS: params.status,
        CURRENCY: params.ccy,
        BALANCE: params.balance,
        INPUT_CHANNEL_ID: '3'
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaAddAccountsSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMadaCardDetail(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADACRDDET',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        productName: params.productName,
        subProductName: params.subProductName,
        functionCode: params.functionCode,
        atmCardNumber: params.cardNumber,
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaCardDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitReIssueMada(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'REISMADSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: params?.authType,
        PARAM2: params.PARAM2,
        PARAM1: params.PARAM1,
        SEL_PARSED_RULE_ID: params?.PARSED_RULE_ID,
        SELECTION_FLAG: params?.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'MADREISFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'MADREISS',
        INPUT_ENTL_VALUE: params.entlVal,
        INPUT_CIF_NO: params.cifNo,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: params.orgAccNo,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: params.custType,
        INPUT_REQ_COUNTRY_CODE: params.reqCountryCode,
        INPUT_VALUE_DATE: params.valueDate,
        INPUT_TXN_CURRENCY: params.txtCurrency,
        INPUT_TXN_AMOUNT: params.txnAmount,
        INPUT_HOST_CODE: 'MDRE',
        INPUT_VERSION_NO: params.versionNo,
        INPUT_SERVICE: 'PAYMNT_FT',
        EXPIRY_DATE: params.expiryDate,
        ISSUE_DATE: params.issueDate,
        CARD_NAME: params.cardName,
        CARD_NUM: params.cardNo,
        STATUS: params.status,
        INPUT_CHANNEL_ID: '3'
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/reIssueCardSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  stopMadaCardSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'STMDSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        //CIF_NUM: params.account.COD_CORECIF,
        PARAM2: params.secRef,
        PARAM1: params.otp,
        SEL_PARSED_RULE_ID: params.ruleId,
        SELECTION_FLAG: params.stnFlag,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'MADSTPFC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'MADSTOP',
        INPUT_ENTL_VALUE: params.entlVal, //params.account.OD_PORTAL_ACC_NO,
        INPUT_CIF_NO: params.cifNo, //params.account.COD_CORECIF,
        INPUT_UNIT_ID: params.unitId, //params.account.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.orgAccNo, //params.account.OD_ACC_NO,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: params.custType,
        INPUT_REQ_COUNTRY_CODE: params.reqCountry,
        INPUT_VALUE_DATE: params.valueDate,
        INPUT_TXN_CURRENCY: params.txtCurrency,
        INPUT_TXN_AMOUNT: params.txnAmount,
        INPUT_HOST_CODE: 'MDST',
        INPUT_VERSION_NO: params.versionNo,
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.cardNo,
        CARD_NAME: params.cardName,
        STATUS: params.status,
        EXPIRY_DATE: params.expiryDate,
        REASON: params.resons,
        COMMENTS: 'DTHDT',
        INPUT_CHANNEL_ID: '3',
        //ACCOUNT_NUMBER: params.accountNumber
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaStopCardSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitAdditionalAccount(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADLINKSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        //CIF_NUM: params.account.COD_CORECIF,
        PARAM2: params.secRef,
        PARAM1: params.otp,
        SEL_PARSED_RULE_ID: params.ruleId,
        SELECTION_FLAG: params.stnFlag,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'LKADDFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'LINKADDI',
        INPUT_ENTL_VALUE: params.entlVal, //params.account.OD_PORTAL_ACC_NO,
        INPUT_CIF_NO: params.cifNo, //params.account.COD_CORECIF,
        INPUT_UNIT_ID: 'IGTBSA', //params.account.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.orgAccNo,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: params.custType,
        INPUT_REQ_COUNTRY_CODE: params.reqCountry,
        INPUT_VALUE_DATE: params.valueDate,
        INPUT_TXN_CURRENCY: params.txtCurrency,
        INPUT_TXN_AMOUNT: params.txnAmount,
        INPUT_HOST_CODE: 'LKAD',
        INPUT_VERSION_NO: params.versionNo,
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NAME: params.cardName,
        CARD_NUMBER: params.cardNo,
        ACC_NAME: params.accName,
        BALANCE: params.balance,
        CURRENCY: params.ccy,
        STATUS: params.status,
        ACCOUNT_NUMBER: params.accountNumber,
        EXPIRY_DATE: params.expiryDate,
        INPUT_CHANNEL_ID: '3',
        LinkAddAccount: params.LinkAddAccount
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/madaLinkAdditionalAccountSubmit.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  addNewMadaFlexiAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode, //"CORESVS",
        subProdCode: params.subProdCode, //"LINKADDI",
        funcCode: params.funcCode, //"LKADDFNC",
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  reissueMadaFlexiAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode, //"CORESVS",
        subProdCode: params.subProdCode, //"LINKADDI",
        funcCode: params.funcCode, //"LKADDFNC",
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  stopMadaFlexiAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode, //"CORESVS",
        subProdCode: params.subProdCode, //"LINKADDI",
        funcCode: params.funcCode, //"LKADDFNC",
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posPurchaseLimitFlexiAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode, //"CORESVS",
        subProdCode: params.subProdCode, //"LINKADDI",
        funcCode: params.funcCode, //"LKADDFNC",
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  linkAddAccountFlexiAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode, //"CORESVS",
        subProdCode: params.subProdCode, //"LINKADDI",
        funcCode: params.funcCode, //"LKADDFNC",
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPrimaryAccount(): Observable<any> {
    const reqData = {
      MODULE_ID: 'PRIACCLKP', 
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaPrimaryAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFromAccounts(): Observable<any> {
    const reqData = {
      MODULE_ID: 'MADAACCLKPUP',
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaPrimaryAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAccountsforAddMada(): Observable<any> {
    const reqData = {
      MODULE_ID: 'NEWCDACCLKUP',
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaAddAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posNewLimitService(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADACARDLMT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_MADA_POS_PURCHASE_LIMIT',
        unitId: params.unitId, // dynamic
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardPOSLimit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  stopReasonValueservice(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADACARD',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_MADA_CARD_ACTION',
        unitId: params.unitId, // dynamic
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaStopCardReasonValues.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMadaCardSummary(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MADCRDSUMMY',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
        export: '',
        exportType: '',
      },

      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        productName: 'CORESVS',
        subProductName: 'MADASVS',
        functionCode: 'CDINQFNC',
        unitId: params?.unitId ? params?.unitId : '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/madacardSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //-------- Credit Card APIs starts here -----------------------------

  getMonthAndYear(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'ACTIVCARD',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_ACTIVATE_CARD_ACTION',
        unitId: params.unitId, // dynamic
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/activateCardYearAndMonth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  cardWithdrawalLimitSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CDWDLTSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'WTHLTFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CRDWITHCH',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'CDWD',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_TYPE: params.CARD_TYPE,
        CURRENCY: params.CURRENCY,
        CARD_NAME: params.CARD_NAME,
        CARD_STATUS: params.CARD_STATUS,
        BALANCE: params.BALANCE,
        NEW_LIMIT: params.NEW_LIMIT,
        CURRENT_LIMIT: params.CURRENT_LIMIT,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/activateCardSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  activateCardSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CARDACTSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'CDACTFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CARDACT',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'ACCRD',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_TYPE: params.CARD_TYPE,
        CARD_STATUS: params.CARD_STATUS,
        CARD_NAME: params.CARD_NAME,
        EXPIRY_DATE: params.EXPIRY_DATE,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/activateCardSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // Need to checK the params with Harshitha -- need to refer the common API integration
  activateCardGenerateCallBack(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'GENERATEIVR',
      },
      dataValue: {
        req_UnitID: 'IGTBSA',
        cif: '001211',
        mobile: '987654332',
        language: '1',
        parameter1: 'SNBMAKER',
        txnRefNo: 'TBC2208051359079',
        subProduct: 'CARDACT',
        functionCode: 'CDACTFNC',
        product: 'CORESVS',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get(
        '/assets/simulateAPI/activateCardGenerateCallBack.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // Need to checK the params with Harshitha -- need to refer the common API integration
  activateCardCallBackInquiry(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'INQUIREIVRCALLBACK',
      },
      dataValue: {
        req_UnitID: 'IGTBSA',
        uniqueId: '10012123',
        subProduct: 'CARDACT',
        functionCode: 'CDACTFNC',
        product: 'CORESVS',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get(
        '/assets/simulateAPI/activateCardCallBackInquiry.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  cardDetails(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CRECRDDETAILS',
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CRDCRELIM',
        functionCode: 'CRLMCHG',
        unitId: params.unitId,
        cardId: params.cardId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/cardDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // Stop Card Stop Card DropDown
  getStopPaymentDropDown(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'STOPCARD',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_STOP_CARD_ACTION',
        unitId: params.unitId, // Dynamic
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/creditCardDropDown.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // stop card Authorization
  getStopPaymentAuthorization(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId, // dyanamic
        cif: params.cif, // dyanamic
        productCode: 'CORESVS',
        subProdCode: 'CARDSTP',
        funcCode: 'CRDSTPFNC',
        amount: '20.00',
        accNo: params.acc, // dyanamic
        pymntCurrency: '',
        debitCurrency: 'BHD',
      },
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/creditCardAuthorization.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // stop card Submit Api
  getStopPaymentSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CARDSTPSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.param2, // dynamic
        PARAM1: params.param1, //dynamic
        SEL_PARSED_RULE_ID: params.selfParsedRuleId, //dynamic
        SELECTION_FLAG: params.selectionFlag, //   dynamic
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'CRDSTPFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CARDSTP',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.INPUT_CIF_NO,
        INPUT_UNIT_ID: params.unitId, //dynamic
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: params.inputValueDate, //dynamic
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: params.inputVersionNo, //dynamic
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.cardNo, //dynamic
        CARD_NAME: params.cardName, //dynamic
        REASON: params.reason, //dynamic
        CARD_TYPE: params.cardType, // dynamic
        CARD_STATUS: params.cardStatus, // dynamic
        BALANCE: params.balance, // dynamic
        CURRENCY: params.currency, // dynamic
        COMMENTS: params.comment, // dynamic
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/creditCardStopPaymentSubmit.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // cahnge card limit
  getChangeCardLimitAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif, // dynamic
        productCode: 'CORESVS',
        subProdCode: 'CRDCRELIM',
        funcCode: 'CRLMCHG',
        amount: '20.00',
        accNo: params.acc, // dynamic
        pymntCurrency: '',
        debitCurrency: 'BHD',
      },
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/changeCardLimitAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //change card limit submit api
  getChangeCardLimitSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CDCDLTSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'CRLMCHG',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CRDCRELIM',
        INPUT_ENTL_VALUE: params.entlValue,
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'CDLT',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_TYPE: params.CARD_TYPE,
        CURRENCY: params.CURRENCY,
        CARD_NAME: params.CARD_NAME,
        CARD_STATUS: params.CARD_STATUS,
        BALANCE: params.BALANCE,
        NEW_LIMIT: params.NEW_LIMIT,
        MIN_LIMIT: params.MIN_LIMIT,
        MAX_LIMIT: params.MAX_LIMIT,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/changeCardLimitSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // card summary api
  getCardSummaryList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CARDSUMMY',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CARDSVS',
        functionCode: 'CDSUMFNC',
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/creditCardSummaryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAuthorizerList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: environment.isSimulate,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode,
        subProdCode: params.subProdCode,
        funcCode: params.funcCode,
        amount: params.amount,
        accNo: params.accNo,
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
      },
    };
    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/selfAuthDetailsForCreditCard.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  creditCardPaymentSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CDPAYSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'CDPAYFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CARDPAY',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'CDPY',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_NAME: params.CARD_NAME,
        CARD_TYPE: params.CARD_TYPE,
        CURRENCY: params.CURRENCY,
        FULL_OUT_AMT: params.FULL_OUT_AMT,
        ACCNO: params.ACCNO,
        COMMENTS: params.COMMENTS,
        CARD_STATUS: params.CARD_STATUS,
        BALANCE: params.BALANCE,
        MIN_DUE: params.MIN_DUE,
        ACCOUNT_NAME: params.ACCOUNT_NAME,
        AMOUNT: params.AMOUNT,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/creditCardPaymentSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  viewPinSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'VWPINSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'VWPINFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CRDVWPIN',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '', // Just pass empty string
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'VWPN',
        INPUT_VERSION_NO: '1', // static. Send 1 as static
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_TYPE: params.EXPIRY_DATE,
        CARD_STATUS: params.CARD_STATUS,
        BALANCE: params.BALANCE,
        CURRENCY: params.CURRENCY,
        CARD_NAME: params.CARD_NAME,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/viewPinSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  creditCardLimitMultipeSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CDLTADJSUBMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.userOtpValue,
        PARAM1: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'LIMADFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CRDLIMAD',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'CDADLT',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CURRENCY: params.CURRENCY,
        LimitAdjustment: params.LimitAdjustment,
        INPUT_CHANNEL_ID: '3',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        '/assets/simulateAPI/creditCardLimitMultipeSubmit.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getRecentTransactions(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'STATEONLNE',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CARDSVS',
        functionCode: 'CDSUMFNC',
        accountId: params.accountId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/creditCardRecentTransactions.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //......................credit card limit
  getCreditCardLimit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CRDAMTDET',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CRDCRELIM',
        functionCode: 'CRLMCHG',
        unitId: params.unitId,
        pan: params.pan,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/creditCardsLimits.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAccountLookup() {
    const reqData = {
      MODULE_ID: 'CRDCDACCLKUP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/accountLookupLists.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCreditCardLookup(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CARDSUMMY',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CARDSVS',
        functionCode: 'CDSUMFNC',
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        '/assets/simulateAPI/accountLookupListsForCreditCard.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // getCreditCardPaymentAmountDetailsMenu(params: any) {
  //   const reqData = {
  //     headerValue: {
  //       moduleId: 'CRDCDFETCH',
  //       simulate: environment.isSimulate,
  //     },
  //     dataValue: {
  //       unitId: params.unitId,
  //     },
  //     footerValue: {},
  //   };

  //   if (environment.localURL) {
  //     return this.http.get(
  //       '/assets/simulateAPI/creditCardPaymentAmountDetailsMenu.json'
  //     );
  //   } else {
  //     return this.http.post(`${environment.restAPI}`, reqData);
  //   }
  // }

  getCreditCardPaymentAmountDetails(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CRDCDAMTDET',
        simulate: environment.isSimulate,
      },
      dataValue: {
        subProduct: 'CARDPAY',
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        '/assets/simulateAPI/creditCardPaymentAmountDetails.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  reIssueCardSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CDREISSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.PARAM2,
        PARAM1: params.PARAM1,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'REISEFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'CRDREISSU',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.INPUT_CIF_NO,
        INPUT_UNIT_ID: params.INPUT_UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.INPUT_DEBIT_ORG_ACC_NO,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '15/12/2022',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'CDREIS',
        INPUT_VERSION_NO: params.INPUT_VERSION_NO,
        INPUT_SERVICE: 'PAYMNT_FT',
        CARD_NUM: params.CARD_NUM,
        CARD_NAME: params.CARD_NAME,
        CARD_STATUS: params.CARD_STATUS,
        CARD_TYPE: params.CARD_TYPE,
        BALANCE: params.BALANCE,
        CURRENCY: params.CURRENCY,
        INPUT_CHANNEL_ID: '3'
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/reIssueCardSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCreditCardStatementLists(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'STATEOFLIN',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CARDSVS',
        functionCode: 'CDSUMFNC',
        unitId: params.unitId,
        pan: params.cardId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/creditCardStatementsList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  downloadStatement(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'STATEOFDWN',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'CARDSVS',
        functionCode: 'CDSUMFNC',
        productCode: '', // Passing as empty string as Harshitha told
        statementId: params.statementId,
        statementDate: params.statementDate,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/downloadStatement.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCreditCardImage() {
    const reqData = {
      headerValue: {
        moduleId: 'CRECRDIMG',
        simulate: environment.isSimulate,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/getCreditCardImage.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //-------- Credit Card APIs ends here -------------------------------

  getServiceInquiryLists(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'CARDINQ',
        simulate: environment.isSimulate,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        filterList: params.filterArray,
        unitId: params.unitId,
        groupBy: '',
        filterFlag: 'Y'
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/serviceInquiryLists.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCifLookup() {
    const reqData = {
      headerValue: {
        moduleId: 'SERINCIFLKP',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'SERINQ',
        functionCode: 'SINQFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/cifLookupDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDailyLimitApiCall(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'DAILYLIMIT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        availBal: params.availBal,
        reqCountry: params.reqCountry, //?????
        unitId: params.unitId, //????????
        cif: params.cif,
        accCcy: params.accCcy,
        valueDate: params.valueDate,
        accNo: params.accNo,
        portalAccNo: '', //????????
        productName: 'PAYMNT', //?????
        subProductName: params.subProductName,
        functionCode: params.functionCode,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_DailyLimit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
