import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EpayServiceService {
  constructor(public http: HttpClient) { }

  epayDebitAccount(reqObj: any) {
    let reqData = {
      MODULE_ID: reqObj.moduleId,
      simulate: `${environment.isSimulate}`
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_DebitLookup.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFeeDetails(reqObj: any) {
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayChargesDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  sbmitEpayApi(reqObj: any) {
    let reqData = {
      "AUTH_TYPE_O": "",
      "PARAM2": reqObj.secRef,
      "PARAM1": reqObj.otp,
      "SEL_PARSED_RULE_ID": reqObj.ruleId,
      "SELECTION_FLAG": reqObj.stnFlag,
      "INPUT_ACTION": "SAVE_TXN",
      "INPUT_FUNCTION_CODE": "APEPYFNC",
      "INPUT_PRODUCT": "CORESVS",
      "INPUT_SUB_PRODUCT": "APEPYSTMT",
      "INPUT_ENTL_VALUE": reqObj.entlVal,
      "INPUT_CIF_NO": reqObj.cif,
      "INPUT_UNIT_ID": reqObj.unitId,
      "INPUT_DEBIT_ORG_ACC_NO": reqObj.primaryAcctNo,
      "INPUT_LANGUAGE_ID": "en_US",
      "INPUT_TXN_STATUS": "RA",
      "INPUT_CUST_TYPE": reqObj.custType,
      "INPUT_REQ_COUNTRY_CODE": reqObj.countryCode,
      "INPUT_VALUE_DATE": reqObj.valDate,
      "INPUT_TXN_CURRENCY": reqObj.txnCurrency,
      "INPUT_TXN_AMOUNT": reqObj.txnAmount,
      "INPUT_HOST_CODE": "STCD",
      "INPUT_VERSION_NO": "",
      "INPUT_SERVICE": "PAYMNT_FT",
      "INPUT_CHANNEL_ID": "3",
      "ACCNO": reqObj.primaryAcctNo,
      "NICKNAME": reqObj.accountNickName,
      "FULLNAME": reqObj.accountFullName,
      "STATUS": reqObj.status,
      "BALANCE": reqObj.accountBalance,
      "ENGNAME": reqObj.engName,
      "ARBNAME": reqObj.arabicName,
      "PHONENO": reqObj.phoneNo,
      "CITY": reqObj.city,
      "ADDRESS": reqObj.address,
      "DELFIRSTNAME": reqObj.delFirstName,
      "DELLASTNAME": reqObj.delLastName,
      "MOBILENO": reqObj.mobileNo,
      "EMAIL": reqObj.email,
      "TECFIRSTNAME": reqObj.techFirstName,
      "TECLASTNAME": reqObj.techLastName,
      "TECHEMAIL": reqObj.techMail,
      "TECHMOBILENO": reqObj.techMobileNo,
      "PAYTYPE": reqObj.paymentType,
      "PAYSERPROV": reqObj.payServiceProvider,
      "SCHEMA": reqObj.schema,
      "GATEWAY": reqObj.gateway,
      "COMMENTS": reqObj.comments,
      "WEBURL": reqObj.webUrl,
      "SETUPFEE": reqObj.setupFee,
      "MONTHLYFEE": reqObj.monthlyFee,
      "MADPERCNT": reqObj.madaCNT,
      "CREDCRDPRCNT": reqObj.creditPRCNT,
      "CREDCRDFIXFEE": reqObj.creditFixFee
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_Submit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  selfAuthCheck(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
      },
      dataValue: {
        //"userNo": "",
        //"gcif": "",
        unitId: reqObj.unitId,
        cif: reqObj.cif,
        productCode: reqObj.productCode,
        subProdCode: reqObj.subProduct,
        funcCode: reqObj.functionCode,
        amount: reqObj.amount,
        accNo: reqObj.accNo,
        pymntCurrency: reqObj.pymntCurrency,
        debitCurrency: reqObj.debitCurrency,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/secFactAuth.json');
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
        subProductName: 'EPYSRT',
        functionCode: 'EPYSRFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/cifLookupDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  epayRequestData(params: any) {
    let reqData = {
      headerValue: {
        "moduleId": "EPYSRVINQ",
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
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/epayRequestDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  epayDownloadData(req: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "EPYDNLDCENTR"
      },
      "dataValue": {
        "unitId": req.unitId,
        "userId": req.userId,
        "documentType": req.documentId
      }
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/epayDownloadCenter.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getMerchantData(reqObj: any) { // Need to comment this method
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/merchantDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getEpayTransactions(reqObj: any) {

    let reqData = {
      headerValue: {
        moduleId: 'EPYTRNSCTIN',
      },
      dataValue: {
        "unitId":reqObj?.unitId,
        "productName":"CORESVS",
        "subProductName":"EPYTRSN ",
         "functionCode":"EPYTRNFNC",
      "transactionReference": reqObj?.transactionReference,
      "reconciliationFromDate": reqObj?.reconciliationFromDate,
      "reconciliationToDate": reqObj?.reconciliationToDate,
      "authorizationNumber": reqObj?.authorizationNumber,
      "settled": reqObj?.settled,
      "dateSort": reqObj?.dateSort,
      "pageSize": reqObj?.pageSize,
      "pageNumber": reqObj?.pageNumber,
      "offlineReport": reqObj?.offlineReport,
      "offlineReportOwner": reqObj?.offlineReportOwner 
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayTransactionsDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  sbmitEpayMercahntClaim(reqObj: any) {
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_Submit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getPaymentGateway(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PYTGTWAY',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayPaymentGateway.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  // getPaymentSchema(reqObj: any) {
  //   let reqData = {
  //     headerValue: {
  //       moduleId: 'PYTGTWAY',
  //     },
  //     dataValue: {
  //       action: reqObj.action,
  //       unitId: reqObj.unitId
  //     },
  //     footerValue: {},
  //   };
  //   if (environment.localURL) {
  //     return this.http.get('assets/simulateAPI/ePayPaymentGateway.json');
  //   } else {
  //     return this.http.post(`${environment.restAPI}`, reqData);
  //   }
  // }
  getPaymentSchema(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PYTSCHEMA',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayPaymentSchemaOptions.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getPaymentServiceProvider(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PYTSRVPRVD',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayPaymentServiceProvider.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getPaymentOption(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PYTTYPECTY',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayPaymentType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getCitiesOption(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'APPEPCTY',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayCity.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getCardType(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EPYCRDTYPE',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/cardTypeDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getPeriod(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EPYCRDPRD',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayCardPeriod.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getSettled(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EPYCRDSTLD',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      }
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayCardSetteled.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getExport(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EPYCRDEXPT',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayCardExportOption.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getDateSort(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EPYCRDDTE',
      },
      dataValue: {
        action: reqObj.action,
        unitId: reqObj.unitId
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayCardDateSort.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  submitEpayStmt(reqObj: any) {
    const reqData = {
      headerValue: {
        moduleId: "EPYSTMTSUBMIT",
        simulate: environment.isSimulate
      },
      dataValue: {
        "AUTH_TYPE_O": "",
        "PARAM2": "",
        "PARAM1": "",
        "SEL_PARSED_RULE_ID": "4980",
        "SELECTION_FLAG": "Y",
        "INPUT_ACTION": "SAVE_TXN",
        "INPUT_FUNCTION_CODE": "EPYSTFNC",
        "INPUT_PRODUCT": "CORESVS",
        "INPUT_SUB_PRODUCT": "EPYSTMT",
        "INPUT_ENTL_VALUE": "",
        "INPUT_CIF_NO": reqObj.cifNo,
        "INPUT_UNIT_ID": reqObj.unitId,
        "INPUT_DEBIT_ORG_ACC_NO": reqObj.debitAccountNo,
        "INPUT_LANGUAGE_ID": "en_US",
        "INPUT_TXN_STATUS": "RA",
        "INPUT_CUST_TYPE": reqObj.custType,
        "INPUT_REQ_COUNTRY_CODE": reqObj.reqCountryCode,
        "INPUT_VALUE_DATE": reqObj.valueDate,
        "INPUT_TXN_CURRENCY": reqObj.txnCurrency,
        "INPUT_TXN_AMOUNT": reqObj.txnAmount,
        "INPUT_HOST_CODE": "EPCT",
        "INPUT_VERSION_NO": "",
        "INPUT_SERVICE": "PAYMNT_FT",
        "INPUT_CHANNEL_ID": "3",
        "ACCNO": reqObj.accountNo,
        "NICKNAME": reqObj.nickName,
        "FULLNAME": reqObj.fullName,
        "STATUS": reqObj.accountStatus,
        "BALANCE": reqObj.accountBalance,
        "merchant": reqObj.merchantObject,
        "CARDTYPE": reqObj.cardType,
        "PERIOD": reqObj.cardPeriod,
        "DATESORT": reqObj.cardDateSort,
        "DATEFROM": reqObj.dateFrom,
        "DATETO": reqObj.dateTo,
        "SETTLED": reqObj.settled,
        "AMOUNTFROM": reqObj.amountFrom,
        "AMOUNTTO": reqObj.amountTo,
        "EPAYREF": reqObj.refNo,
        "AUTHORIZATIONNUMBER": reqObj.authNo,
        "EXPORTAS": reqObj.exportType
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_Submit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMultiClaimAccountList() {
    const reqData = {
      MODULE_ID: 'EPYMULCLMACCLKUP',
      simulate: environment.isSimulate
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/multiClaimAccountList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEPayMerchantList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: environment.isSimulate
      },
      dataValue: {
        productName: params.productName,
        subProductName: params.subProductName,
        functionCode: params.functionCode,
        unitId: params.unitId,
        merchantAccountNumber: params.accNo
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayMerchantList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEPayClaimTypes(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYFINCLAIM',
        simulate: environment.isSimulate
      },
      dataValue: {
        action: 'GET_POS_FINANCIAL_CLAIM_ACTION',
        unitId: params.unitId
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayClaimTypes.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEPayRefundTypes(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYAMTTYPE',
        simulate: environment.isSimulate
      },
      dataValue: {
        action: 'GET_POS_AMOUNT_TYPE_ACTION',
        unitId: params.unitId
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayRefundTypes.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  multiClaimProceed(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPAYUPLOAD',
        simulate: environment.isSimulate
      },
      dataValue: {
        paymentType: '',
        fileSize: params.fileSize,
        fileFormat: params.fileFormat,
        accNo: params.accNo,
        fileName: params.fileName,
        email: '',
        mobileNumber: params.mobileNumber,
        financialClaimType: params.financialClaimType,
        claimdesc: params.claimdesc,
        unitId: params.unitId
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/multiClaimProceedResponse.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  epayMerchantFinanceDispute(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYMCDET',
        simulate: environment.isSimulate
      },
      dataValue: {
        unitId: params.unitId,
        refNo: params.referenceNo
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayMerchantClaimDispute.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getMultiClaimRecordSummary(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYMULCLMRCRDSUMMY',
        simulate: environment.isSimulate,
        sortOrder: params.sortOrder,
        sortColumn: params.sortColumn
      },
      dataValue: {
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        productName: 'CORESVS',
        subPdt: 'EPYMCD',
        functionCode: 'EPYMCDFNC',
        refNo: params.refNo
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/multiClaimRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getEPayAuthorizers(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: environment.isSimulate
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
        debitCurrency: params.debitCurrency
      }
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayAuthorizerLists.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  multiClaimSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYMULTISUBMIT',
        simulate: environment.isSimulate
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.param2,
        PARAM1: params.param1,
        SEL_PARSED_RULE_ID: params.selfParsedRuleId,
        SELECTION_FLAG: params.selectionFlag,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'EPYMCDFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'EPYMCD',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.cifNo,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: params.INPUT_REQ_COUNTRY_CODE,
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_CHANNEL_ID: '3',
        ACCNO: params.accNo,
        NICKNAME: params.nickname,
        FULLNAME: params.fullName,
        STATUS: params.status,
        BALANCE: params.balance,
        FILE_NAME: params.fileName,
        MERCHANTENGNAME: params.merchantEngName,
        MERCHANTID: params.merchantId,
        MOBILENO: params.mobileNo,
        COMMENT: params.comment,
        CLAIMDES: params.claimDescription,
        CLAIMTYPE: params.claimType,
        CURRENCY: params.currency,
        AMOUNT: params.amount,
        NORECORDS: params.noOfRecords,
        BENENAME: params.benName,
        VIOLATORID: params.violatorId,
        VIOLATIONID: params.violationId,
        RRN: params.RRN,
        REFUNDTYPE: params.REFUNDTYPE,
        REFUNDAMOUNT: params.REFUNDAMOUNT
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/multiClaimSubmitResponse.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  
  ePayDownloadRequest(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYDNLDCENTR',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: '',// Passing as empty string as OF dependency
        subProductName: '',// Passing as empty string  OF dependency
        functionCode: '',// Passing as empty string  OF dependency
        productCode: '', // Passing as empty string as  OF dependency
        documentId: params.documentId,
        createdAt: params.createdAt,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('/assets/simulateAPI/downloadStatement.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  ePayTransactionRefundAmountSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'EPYTRNSUBMIT',
        simulate: environment.isSimulate
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.PARAM2,
        PARAM1: params.PARAM1,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE,
        INPUT_PRODUCT: params.INPUT_PRODUCT,
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.INPUT_CIF_NO,
        INPUT_UNIT_ID: params.INPUT_UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_CHANNEL_ID: '3',
        ACCNO: params.ACCNO,
        NICKNAME: params.NICKNAME,
        FULLNAME: params.FULLNAME,
        STATUS: params.STATUS,
        BALANCE: params.BALANCE,
        MERCHANTENGNAME: params.MERCHANTENGNAME,
        MERCHANTID: params.MERCHANTID,
        CLAIMDES: params.CLAIMDES,
        REFUNDTYPE: params.REFUNDTYPE,
        DEDUCTIONDATE: '',
        CLAIMTYPE: params.CLAIMTYPE,
        SEQUENCE: params.SEQUENCE,
        CARDTYPE: params.CARDTYPE,
        CARDNO: params.CARDNO,
        AMOUNT: params.AMOUNT,
        TRANSDATE: params.TRANSDATE,
        REFUNDAMNT: params.REFUNDAMNT,
        MOBILENO: params.MOBILENO,
        RRN: params.RRN
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayTransactionRefundAmountSubmitResponse.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
