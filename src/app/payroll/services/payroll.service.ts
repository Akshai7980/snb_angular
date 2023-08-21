import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  uploadFileDetails: any = {};
  fetchedFileDetails: any = {};

  constructor(private http: HttpClient) {}

  getAuthData(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYAUTHCHECK',
        simulate: `${environment.isSimulate}`,
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
      return this.http.get('assets/simulateAPI/fileUploadAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFileType(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PMNTSGETFLDDATA',
      },
      dataValue: {
        action: params.action,
        unitId: params.unitId,
        subPdtCode: params.subPdtCode
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileUploadType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getUploadFormat(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PMNTSGETFLDDATA',
      },
      dataValue: {
        action: params.action,
        subPdtCode: params.typeCode,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileUploadFormat.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getBusinessDaysList(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'BUSINESSDAYPAYLIST',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        transactionType: params.transactionType,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/fileUploadBusinessDaysList.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFileDetails(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYFILEDETAILS',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        REFERENCE_NUM: params.REFERENCE_NUM,
        subProductName: params.subProductName,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileUploadPayDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getDebitAccPayroll(): Observable<any> {
    let reqData = {
      MODULE_ID: 'PAYROLLACCLKP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/debitAccPayroll.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  accountNumberValidation(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYACCVALD',
      },
      dataValue: {
        accNo: params.accNo,
        unitId: params.unitId,
        SUB_TYPE: params.SUB_TYPE
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/accNumberValidate.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getVendorUpload(): Observable<any> {
    let reqData = {
      MODULE_ID: 'PAYVENDACCLKP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/vendorUpload.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  entitledDebitAccount(): Observable<any> {
    let reqData = {
      MODULE_ID: 'PAYWPSACCLKP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payWpsAccLkp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
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
        unit_ID: data.unitId,
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

  getWorkflowData(): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYWRKFLW',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        txnRefNo: 'TBC2208051359079', //
        productCode: 'PAYMNT', //
        subProductCode: 'PAYROLUP', //
        functionCode: 'BULKUP', //
        unit_ID: 'IGTBSA', //
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollWorkFlow.json');
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
        functionCode: data.functionCode,
        refNo: data.refNo,
        pageCall: data.pageName
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/TransactionSummaryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  fileUploadProceed(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PAYUPPROCEED',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        REQUEST_ID: 'ONLINE_DUPLICATE',
        PAYMENT_TYPE: params.PAYMENT_TYPE,
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
        FILE_NAME: params.FILE_NAME,
        MAKER_DATE: params.MAKER_DATE,
        TEMPLATE_ID: params.TEMPLATE_ID,
        FILE_SIZE: params.FILE_SIZE,
        FILEFORMAT_CD: params.FILEFORMAT_CD,
        ACC_NO_REM: params.ACC_NO_REM,
        CIF_NUM: params.CIF_NUM,
        ACTUAL_FILE_NAME: params.ACTUAL_FILE_NAME,
        CRC_SUM: params.CRC_SUM,
        COMMERCIAL_NO: params.COMMERCIAL_NO,
        MOL_ID: params.MOL_ID,
        UPLOAD_TYPE: params.UPLOAD_TYPE,
        SUB_TYPE: params.SUB_TYPE,
        VALUE_DATE:params.VALUEDATE        
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileUploadProceed.json');
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

  payrollSubmit(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'PAYUPSUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        REQUEST_ID: 'ONLINE_DUPLICATE',
        PAYMENT_TYPE: 'PAYROLL',
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT, //SUBPRODUCT
        FUNCTION_CODE: params.FUNCTION_CODE, //FUNCTION CODE
        FILE_NAME: params.FILE_NAME, //
        MAKER_DATE: params.MAKER_DATE, // in this format itself
        TEMPLATE_ID: params.TEMPLATE_ID, //
        FILE_SIZE: params.FILE_SIZE, //
        FILEFORMAT_CD: params.FILEFORMAT_CD, //
        ACC_NO_REM: params.ACC_NO_REM, //
        CIF_NUM: params.CIF_NUM, //
        ACTUAL_FILE_NAME: params.ACTUAL_FILE_NAME, //
        CRC_SUM: params.CRC_SUM, //
        COMMERCIAL_NO: params.COMMERCIAL_NO, //
        MOL_ID: params.MOL_ID, //
        UPLOAD_TYPE: params.UPLOAD_TYPE, //
        INPUT_TXN_STATUS: params.INPUT_TXN_STATUS, //
        IsValidateToken: params.IsValidateToken, //
        AUTH_TYPE_O: params.AUTH_TYPE_O, //
        PARAM2: params.PARAM2, //
        PARAM1: params.PARAM1, //
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID, // from flexi auth
        SELECTION_FLAG: params.SELECTION_FLAG, // if v choosing any USER THEN WE NEED TO PASS LIKE Y OR N
        USER_NUMBER_LIST: params.USER_NUMBER_LIST, // USER ID AND USER CODE
        sefAuthFlag: params.sefAuthFlag, //
        REFERENCE_NUM: params.REFERENCE_NUM, // is getting from proceed api
        odTxnCy: params.odTxnCy,
        odFileAmount: params.odFileAmount,
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE,
        VALUE_DATE:params.VALUEDATE
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getOnboardingFeeDetails(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: "PAYROLLONFEE",
        simulate: `${environment.isSimulate}`
      },
      dataValue: {
        accNo: params.OD_ACC_NO,
        subProductName: 'PAYONBD',
        unitId: params.UNIT_ID
      },
      footerValue: {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/onboardingFeeDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAccountDetails(): Observable<any> {
    const reqData = {
      MODULE_ID: "PAYROLLONACCLKP",
      simulate: `${environment.isSimulate}`
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/accountDetailsForOnboarding.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  payrollOnboardingSubmit(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: "PAYROLLONSUBMIT",
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        REQUEST_ID: params.REQUEST_ID,
        PAYMENT_TYPE: params.PAYMENT_TYPE,//SUBPRODUCT
        FUNCTION_CODE: params.FUNCTION_CODE,//FUNCTION CODE
        ACC_NO_REM: params.accountDetails.accDetails?.OD_ACC_NO,
        CIF_NUM: params.accountDetails.accDetails?.COD_CORECIF,
        INPUT_TXN_STATUS: params.INPUT_TXN_STATUS,//
        IsValidateToken: params.IsValidateToken,
        AUTH_TYPE_O: params.AUTH_TYPE_O,
        PARAM1: params.otpValue,
        PARAM2: params.secAuthRef,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.authDetail.selectedAprover?.OD_USER_NO ? params.authDetail.selectedAprover?.OD_USER_NO : "",
        sefAuthFlag: params.sefAuthFlag,
        setupFee: params.accountDetails.setupFee,
        monthlyFee: params.accountDetails.monthlyFee,
        prepaidCars: params.accountDetails.prepaidCards,
        perSNBrecord: params.accountDetails.perSNBrecord,
        perSarieRecord: params.accountDetails.perSarieRecord,
        CURRENCY: params.accountDetails.accDetails?.OD_CCY_CODE,
        OD_SUBPROD_CODE:'PAYONBD',
        INPUT_SUB_PRODUCT:'PAYONBD',
        INPUT_PRODUCT:'PAYMNT',
        OD_PRODUCT_CODE: "PAYMNT",
        PRODUCT_NAME: "PAYMNT",
      },
      footerValue: {}
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollOnboardingSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPayrollAuthData(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: "PAYROLLONAUTHCHECK",
        simulate: `${environment.isSimulate}`
      },
      dataValue: {
        userNo: params.userNo,
        gcif: params.gcif,
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
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollOnboardingAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentInquiryList(params: any): Observable<any> {
    const reqData = {
      "headerValue":{
         "moduleId":"STOPPAYMENTFILELISTFET"
      },
      "dataValue":{
         "fileType": params.fileType,
         "fromDate": params.fromDate,
         "toDate": params.toDate,
         "fromAccountId": params.fromAccountId,
         "unitId": params.unitId
      },
      "footerValue":{}
   }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentPayrollInquiryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentTransferDetails(params: any): Observable<any> {
    const reqData = {
      "headerValue": {
        "moduleId": "STOPPMNTFILEDETAILS",
        "simulate": environment.isSimulate,
      },
      "dataValue": {
        "REFERENCE_NUM": params.refNo,
        "subProductName": "STPFNC",
        "unitId": params.unitId
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentTransferDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentRecordsToStop(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: "STPPMNTRECSUM",
        simulate: environment.isSimulate
      },
      dataValue: {
        productName: "PAYMNT", // it's static as backend team said
        subPdt: "STPPMNT", // it's static as backend team said
        functionCode: "STPFNC", // it's static as backend team said
        refNo: params.refNo,
      },
      footerValue: {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentRecordsToStop.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentRecordSummary(params: any): Observable<any> {
    const reqData = {
      "headerValue": {
        "moduleId": "STOPPMNTFILETRANLIST",
        "simulate": environment.isSimulate,
       },
      "dataValue": {  
        "productName": "PAYMNT",
        "subPdt": "STPPMNT",
        "functionCode": "STPFNC",
        "refNo": params.refNo,
        "fileSeqNo": params.fileSeqNo,
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentRecordSummaryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentAuthorizationDetails(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: "STOPPMNTFLEAUTH",
        simulate: environment.isSimulate
      },
      dataValue: {
        unitId: params.unitId,
        productCode: "PAYMNT",
        subProdCode: "STPPMNT",
        funcCode: "STPFNC",
        accNo: params.accNo,
      }
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentFlexAuthDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  stopPaymentSubmit(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: "STOPPMNTSUBMIT",
        simulate: environment.isSimulate
      },
      dataValue: {
        PAYMENTTYPE: "PAYMENT",
        FUNCTIONCODE: "STPFNC",
        odRefNo: params.odRefNo,
        FILENAME: params.FILENAME,
        FILEFORMATE: params.FILEFORMATE,
        CAL: params.CAL,
        SNBRECORDS: params.SNBRECORDS,
        SNBAMT: params.SNBAMT,
        OTHERBANKREC: params.OTHERBANKREC,
        BANKAMT: params.BANKAMT,
        FEE: params.FEE,
        TOTALRECS: params.TOTALRECS,
        TOTALAMT: params.TOTALAMT,
        TOTALFEE: params.TOTALFEE,
        PARAM2: params.otp,
        PARAM1: params.secRefAuth,
        recordList: params.RECORDLIST,     
        fileSeqNo: params.fileSeqNo,
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SELECTION_FLAG: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
        sefAuthFlag: params.sefAuthFlag,
        level: params.LEVEL,
        AUTH_TYPE_O: params.AUTH_TYPE_O,
      },
      footerValue: {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getStopPaymentAccounts(): any {
    const reqObj = {
      "MODULE_ID": "STPPMNTACCUP",
      "simulate": environment.isSimulate,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentAccounts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }
}
