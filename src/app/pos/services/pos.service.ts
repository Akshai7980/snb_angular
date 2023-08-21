import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  constructor(private http: HttpClient) {}

  getAccountList() {
    const reqData = {
      MODULE_ID: 'POSSTACCLKUP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posAccountList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMerchantList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSSTMRCHNT',
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'POSSTMT',
        functionCode: 'POSSTFNC',
        unitId: params.unitId,
        merchantAccountNumber: params.merchantAccountNumber,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posMerchantList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTerminalList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSSTTRM',
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'POSSTMT',
        functionCode: 'POSSTFNC',
        unitId: params.unitId,
        accountNumber: params.accountNumber,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTerminalList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransactionAccountList() {
    const reqData = {
      MODULE_ID: 'POSTRSACCLKUP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTransactionAccountList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMultiClaimAccountList() {
    const reqData = {
      MODULE_ID: 'POSMULCLMACCLKUP',
      simulate: 'N',
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posMultiClaimAccountList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getServiceRequest(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSSRVINQ',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        userNo: params.userNo,
        gcif: params.gcif,
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        filterMap: [
          {
            filterField: params.filterfield,
            filterConstraint: params.filterconstraint,
            filterValue: params.filterflag,
          },
        ],
        unitId: params.unitId,
        groupBy: params.groupBy,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posServiceRequest.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDownloadCenter(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'DNLDCENTR',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        userNo: params.userNo,
        gcif: params.gcif,
        fromRowNo: params.fromRowNo,
        toRowNo: params.fromRowNo,
        filterMap: [
          {
            filterField: params.filterField,
            filterConstraint: params.filterConstraint,
            filterValue: params.filterflag,
          },
        ],
        unitId: params.unitId,
        groupBy: params.groupBy,
      },
      footerValue: {
        gcif: params.gcif,
      },
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posDownloadCenter.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransactionList() {
    let reqData = {
      headerValue: {
        moduleId: 'PMNTSGETFLDDATA',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'BENETEMP_LOAD',
        unitId: 'hds',
        pdt: 'PAYMNT',
        subPdt: 'BENEUP',
        function: 'BULKUP',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTransactionList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCardType(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSCRDTYPE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_CARD_TYPE_ACTION',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posCardType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPeriod(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSCRDPRD',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_CARD_TYPE_ACTION',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posPeriod.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getSettled(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSCRDSTLD',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_SETTLED_ACTION',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posSettled.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDateSort(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSCRDDTE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_DATE_SORT_ACTION',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posDateSort.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getExportType(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'POSCRDEXPT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_EXPORT_AS_ACTION',
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posExportType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posStatementSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSSTMTSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: '121',
        PARAM1: '2121',
        SEL_PARSED_RULE_ID: '4980',
        SELECTION_FLAG: 'Y',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'POSSTFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSSTMT',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: '',
        INPUT_UNIT_ID: params.INPUT_UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '15/12/2022',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_CHANNEL_ID: '3',
        ACCNO: params.ACCNO, // clarification to pass multiple will as with pown
        NICKNAME: params.NICKNAME,
        FULLNAME: params.FULLNAME,
        STATUS: params.STATUS,
        BALANCE: params.BALANCE,
        MERCHANT: params.MERCHANT,
        TERMINAL: params.TERMINAL,
        CARDTYPE: params.CARDTYPE,
        PERIOD: params.PERIOD,
        DATESORT: params.DATESORT,
        SETTLED: params.SETTLED,
        AMOUNT_FROM: params.AMOUNT_FROM,
        AMOUNT_TO: params.AMOUNT_TO,
        SEQUENCE: params.SEQUENCE,
        AUTHORIZATIONNUMBER: params.AUTHORIZATIONNUMBER,
        EXPORTAS: params.EXPORTAS,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEmail() {
    let reqData = {
      headerValue: {
        moduleId: 'POSTRNEML',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        od_parameter: '18',

        unitId: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTransactionEmail.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFinancialTypeDropdown() {
    let reqData = {
      headerValue: {
        moduleId: 'POSFINCLAIM',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_FINANCIAL_CLAIM_ACTION',
        unitId: 'IGTBSA',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinancialTypeDropdown.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAuthorization() {
    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: 'IGTBSA',
        cif: '7000020027',
        productCode: 'CORESVS',
        subProdCode: 'POSMCD',
        funcCode: 'POSMCDFNC',
        amount: '20.00',
        accNo: '100000002762',
        pymntCurrency: '',
        debitCurrency: 'BHD',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadAuthorization.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransactionSubmit() {
    const reqData = {
      headerValue: {
        moduleId: 'POSTRSSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: '121',
        PARAM1: '2121',
        SEL_PARSED_RULE_ID: '4980',
        SELECTION_FLAG: 'Y',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'POSTRNFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSTRN',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: '',
        INPUT_UNIT_ID: 'IGTBSA',
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '15/12/2022',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_CHANNEL_ID: '3',
        ACCNO: 'SA1010 0100 1000 0000123',
        NICKNAME: 'Dameer',
        FULLNAME: 'Dameer Ahsan',
        STATUS: 'ACTIVE',
        BALANCE: '103.98',
        MERCHANTENGNAME: 'Adhara Alam',
        MERCHANTARBNAME: 'علم أذار',
        CURRENCY: 'SAR',
        MERCHANTNUMBER: '1010 0100 1000 0000 0123',
        SHOPNAME: 'Zamzam Water',
        TERMINALID: '0099 1231 2399 1230',
        TERMINALTYPE: 'Physical',
        TERMINALCITY: 'Ad-Dilam',
        EMAIL: 'zeewaters@info.com',
        MOBILENO: '1234567890',
        COMMENT: 'POS TERMINAL',
        CLAIMDES: 'CLAIM-1',
        AMOUNTTYPE: 'FULL',
        DEDUCTIONDATE: '20/01/2023',
        CLAIMTYPE: 'CLAIM-1',
        SEQUENCE: '3',
        CARDTYPE: 'DEBIT',
        CARDNO: '1234567890',
        AMOUNT: '2130',
        TRANSDATE: '20/02/2023',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTransactionSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAmountTypeDropdown() {
    let reqData = {
      headerValue: {
        moduleId: 'POSAMTTYPE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_POS_AMOUNT_TYPE_ACTION',
        unitId: 'IGTBSA',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posAmountTypeDropdown.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getRecordSummary(param: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MULCLMRCRDSUMMY',
        simulate: 'N',
        sortOrder: 'asc',
        sortColumn: '',
      },
      dataValue: {
        fromRowNo: 1,
        toRowNo: 50,
        productName: 'CORESVS',
        subPdt: 'POSMCD',
        functionCode: 'POSMCDFNC',
        refNo: 'TBC2208301819244',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
