import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ETradeService {
  constructor(public http: HttpClient) {}

  getCompanyInformation(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'CMPYINFETRDREG',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeCompanyInfo.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getUserInformation(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'USERPROFILE',
      },
      dataValue: {},
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeUserInfo.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitETradeRegistration(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'ETRDSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        CIF_NUM: params.userInformation.cif,
        PARAM2: params.secondAuthRef,
        PARAM1: params.otp,
        USER_NUMBER_LIST: '',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'ETRDFNC',
        INPUT_PRODUCT: 'NBMTRD',
        INPUT_SUB_PRODUCT: 'ETRDREG',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.userInformation.cif,
        INPUT_UNIT_ID: params.unitId,
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_HOST_CODE: 'EREG',
        CUSTOMERID: params.companyInformation.customerId,
        CUSTOMER_NAME: params.companyInformation.customerName,
        BRANCH: params.companyInformation.branch,
        USER_ID: params.userInformation.cif,
        NAME_OF_THE_USER: params.userInformation.FIRST_NAME,
        ETRADE_ID: params.userInformation.etradeId,
        PHONE_NUMBER: params.userInformation.MOBILE_NO,
        EMAIL_ADDRESS: params.userInformation.EMAIL_ID,
        AUTH_TYPE_O:params.AUTH_TYPE_O
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeSubmitRegistration.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFromAccounts(): Observable<any> {
    const reqData = {
      MODULE_ID: 'LGACCLKPUP',
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeFromAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getToAccounts(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETLGNICKNAME',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeToAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // getTypes(): Observable<any> {
  //   const reqData = {
  //     headerValue: {
  //       moduleId: 'GETLGTYPE',
  //       simulate: `${environment.isSimulate}`,
  //     },
  //     dataValue: {},
  //     footerValue: {},
  //   };

  //   if (environment.localURL) {
  //     return this.http.get('assets/simulateAPI/eTradeMarginAccounts.json');
  //   } else {
  //     return this.http.post(`${environment.restAPI}`, reqData);
  //   }
  // }

  getTypes(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETLGTYPE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeTypes.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getBranches(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETLGBRANCH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeBranches.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCurrencies(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETLGCURRENCY',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeCurrencies.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAuthorizers(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: 'NBMTRD',
        subProdCode: 'LGCSMAR',
        funcCode: 'LGCFNC',
        amount: params.amount,
        accNo: params.accountNumber,
        pymntCurrency: params.paymentCurrency,
        debitCurrency: params.debitCurrency,
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeAuthorizers.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDailyLimit(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'DAILYLIMIT',
      },
      dataValue: {
        availBal: params.availBal,
        reqCountry: params.reqCountry,
        unitId: params.unitId,
        cif: params.cif,
        accCcy: params.accCcy,
        valueDate: params.valueDate,
        accNo: params.accNo,
        portalAccNo: params.portalAccNo,
        productName: 'NBMTRD',
        subProductName: 'LGCSMAR',
        functionCode: 'LGCFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/dailyLimitRes.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitLgIssue(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'LGSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        ACC_NO_REM: params.account.OD_ACC_NO,
        CIF_NUM: params.account.COD_CORECIF,
        PARAM2: params.secRef,
        PARAM1: params.otp,
        SEL_PARSED_RULE_ID: params.authorizer
          ? params.authorizer.selectedAprover.PARSED_RULE_ID
          : '',
        SELECTION_FLAG:
          params.authorizer && params.authorizer.selectedAprover ? 'Y' : '',
        USER_NUMBER_LIST:
          params.authorizer && params.authorizer.selectedAprover
            ? params.authorizer.selectedAprover.OD_USER_NO
            : '',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'LGCFNC',
        INPUT_PRODUCT: 'NBMTRD',
        INPUT_SUB_PRODUCT: 'LGCSMAR',
        INPUT_ENTL_VALUE: params.account.OD_PORTAL_ACC_NO,
        INPUT_CIF_NO: params.account.COD_CORECIF,
        INPUT_UNIT_ID: params.account.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.account.OD_ACC_NO,
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: params.account.COUNTRY_CODE,
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: params.issueDetails.ccy.currency,
        INPUT_TXN_AMOUNT: params.issueDetails.amount,
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_HOST_CODE: 'TRLG',
        LANGUAGE: params.issueDetails.language,
        NICK_NAME_ENG: params.beneficiary.odEnglish,
        NICK_NAME_AR: params.beneficiary.odArabic,
        LGTYPE: params.issueDetails.type.lgType,
        BRANCH: params.issueDetails.branch.branchCode,
        LGCURRENCY: params.issueDetails.ccy.currency,
        AMOUNT: params.issueDetails.amount,
        AMOUNT_ENG: params.issueDetails.amountInEnglish,
        AMOUNT_AR: params.issueDetails.amountInArabic,
        REPRESENTING: params.issueDetails.representing,
        REFERENCE_NUMBER: params.issueDetails.refNumber,
        EXPIRY_DATE: params.issueDetails.expiry,
        PROJECT_NAME_AND_PURPOSE: params.issueDetails.projectNameAndPurpose,
        COMMISSION_ACCOUNT: params.applicantDetails.commissionAccount,
        MARGIN_ACCOUNT: params.applicantDetails.marginAccount,
        APPLICANT_NAME: params.account.LIAS_NAME,
        ADDRESS1: params.applicantDetails.address1,
        ADDRESS2: params.applicantDetails.address2,
        ADDRESS3: params.applicantDetails.address3,
        EMAIL: params.applicantDetails.email,
        MOBILE: params.applicantDetails.mobile,
        PHONE: params.applicantDetails.phone,
        FAX: params.applicantDetails.fax,
        AUTH_TYPE_O:params.AUTH_TYPE_O
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeSubmitLgIssue.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getLgList(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETCUSTOMERLG',
      },
      dataValue: {
        cif: params.cif,
        productName: 'NBMTRD',
        subProductName: 'LGCSMAR',
        functionCode: 'LGCFNC',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeLGList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDetails(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETLGDETAILS',
      },
      dataValue: {
        lgNumber: params.lgNumber,
        productName: 'NBMTRD',
        subProductName: 'LGCSMAR',
        functionCode: 'LGAMND',
        unitId: 'IGTBSA',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeLgDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  submitAmendment(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'LGAMEND',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        ACC_NO_REM: params.account.OD_ACC_NO,
        CIF_NUM: params.account.COD_CORECIF,
        INPUT_TXN_STATUS: 'RA',
        IsValidateToken: '',
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        PARAM2: params.secRef,
        PARAM1: params.otp,
        SEL_PARSED_RULE_ID: params.authorizer
          ? params.authorizer.selectedAprover.PARSED_RULE_ID
          : '',
        USER_NUMBER_LIST:
          params.authorizer && params.authorizer.selectedAprover
            ? params.authorizer.selectedAprover.OD_USER_NO
            : '',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'LGAMND',
        INPUT_PRODUCT: 'NBMTRD',
        INPUT_SUB_PRODUCT: 'LGCSMAR',
        INPUT_ENTL_VALUE: params.account.OD_PORTAL_ACC_NO,
        INPUT_CIF_NO: params.account.COD_CORECIF,
        INPUT_UNIT_ID: params.account.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: params.account.OD_ACC_NO,
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: params.account.COUNTRY_CODE,
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: params.issueDetails.ccy.currency,
        INPUT_TXN_AMOUNT: params.issueDetails.amount,
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_HOST_CODE: 'TRAM',
        MODE: 'AMEND',
        LGTYPE: params.issueDetails.type.lgType,
        BRANCH: params.issueDetails.branch.branchCode,
        REPRESENTING: params.issueDetails.representing,
        REFERENCE_NUMBER: params.issueDetails.refNumber,
        EXPIRY_DATE: params.issueDetails.expiry,
        PROJECT_NAME_ND_PURPOSE: params.issueDetails.projectNameAndPurpose,
        COMMISSION_ACCOUNT: params.applicantDetails.commissionAccount,
        MARGIN_ACCOUNT: params.applicantDetails.marginAccount,
        APPLICANT_NAME: params.account.LIAS_NAME,
        ADDRESS1: params.applicantDetails.address1,
        ADDRESS2: params.applicantDetails.address2,
        ADDRESS3: params.applicantDetails.address3,
        EMAIL: params.applicantDetails.email,
        MOBILE: params.applicantDetails.mobile,
        PHONE: params.applicantDetails.phone,
        FAX: params.applicantDetails.fax,
        lgNumber: params.lg.lgNumber,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeSubmitAmend.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
