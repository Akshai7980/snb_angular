import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PosFinanceService {
  constructor(private http: HttpClient) {}

  //------------------------- pos finance request start from here -------------------------
  getAccountList() {
    // verifed by suren
    let reqData = {
      MODULE_ID: 'POSACCLKPUP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceRequestDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // pos finance request auth///////
  getAuthorizerList(params: any) {
    //verified by dg

    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId, //
        cif: '7000020027',
        productCode: 'CORESVS',
        subProdCode: 'POSFIN',
        funcCode: 'PFINFNC',
        amount: '20.00',
        accNo: '100000002762',
        pymntCurrency: '',
        debitCurrency: 'BHD',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceRequestAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  //  Pos Finance request Submit Api
  submitApi(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'POSFINSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        PARAM2: params.param2,
        PARAM1: params.param1,
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'PFINFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSFIN',
        INPUT_ENTL_VALUE: params.accNo,
        INPUT_CIF_NO: params.COD_CORECIF,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '15/12/2022',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'POSF',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        ACCNO: params.accNo,
        REQUESTID: params.requestId,
        CRNO: params.crNo,
        RMREFERRAL: params.rmReferals,
        FINANCEAMOUNT: params.financeAmt,
        CURRENCY: params.currency, //
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceRequestSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //  Pos Finance request Request ID Api
  getRequestId(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'POSFINFETCH',
      },
      dataValue: {
        cif: params.cif,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/PosFinanceRequestId.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //------------------------- pos finance request end here -------------------------

  //------------------------- pos finance inquiry start from here -------------------------

  getPosFinanceInquiryList(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'POSFININQ',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        filterList: [
          {
            filterField: params.filterField,
            filterConstraint: params.filterConstraint,
            filterValue: '',
            status: params.status,
            fromDate: params.fromDate,
            toDate: params.toDate,
          },
        ],
        unitId: params.unitId,
        groupBy: '',
        filterFlag: params.filterFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceInquiryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // pos finance request details
  getPosFinanceSummaryDetails(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'POSFININQDET',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        REFERENCE_NUM: params.REFERENCE_NUM,
        subProductName: 'POSFIN',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceSummaryDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPoSFinanceInquiryCiflkp() {
    let reqData = {
      headerValue: {
        moduleId: 'POSSERINCIFLKP',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'POSFIN',
        functionCode: 'PFINFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/poSFinanceInquiryCiflkp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
