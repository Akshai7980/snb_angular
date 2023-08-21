import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyTaskService {
  reqData: any;
  selectedElementDetails: any = {};
  constructor(public http: HttpClient) {}

  pendingActivitesCountApiCall(): Observable<any> {
    let pendingActivitiesCountReqData = {
      headerValue: {
        moduleId: 'PENDCOUNT',
        sortColumn: 'INITIATEDATE_TIME',
        sortOrder: 'asc',
      },

      dataValue: {
        fromRowNo: '0',
        toRowNo: '45',
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

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-pendingActivityCount.json');
    } else {
      return this.http.post(
        `${environment.restAPI}`,
        pendingActivitiesCountReqData
      );
    }
    //return this.http.get('/assets/simulateAPI/pa-pendingActivityCount.json');
    // return this.http.post(`${environment.restAPI}`,pendingActivitiesCountReqData);
  }

  getSinglePaymentSummary(params: any, filterarray: any) {
    this.reqData = {
      headerValue: {
        moduleId: 'PENDTRAN',
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: '0',
        toRowNo: '45',
        filterList: filterarray,
        unitId: '',
        groupBy: '',
        filterFlag: params.flag,
      },
      footerValue: {
        userNo: '202204007005',
        gcif: '10000187',
      },
    };
    // this.reqData = {
    //   headerValue: {
    //     moduleId: 'PENDTRAN',
    //     sortColumn: params.sortcolumn,
    //     sortOrder: params.sortDirection,
    //   },
    //   dataValue: {
    //     sortColumn: params.sortcolumn,
    //     sortDirection: params.sortDirection,
    //     fromRowNo: '0',
    //     toRowNo: '45',
    //     filterMap: filterarray,
    //     unitId: '',
    //     groupBy: '',
    //     languageId: 'en_US',
    //     filterFlag: params.flag,
    //   },
    //   footerValue: {},
    // };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-singlePayments.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }

    //return this.http.post(`${environment.restAPI}`, this.reqData);
    //return this.http.get('/assets/simulateAPI/pa-singlePayments.json');
    //return this.http.get('assets/simulateAPI/error_500.json');
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

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/singleTransferPaymentDetails.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqPayload);
    }
    // return this.http.post(`${environment.restAPI}`, reqPayload);
    // return this.http.get(
    //   'assets/simulateAPI/singleTransferPaymentDetails.json'
    // );
    //  return this.http.get('/assets/simulateAPI/500reponse.json');
  }

  getSadadSinglePaymentSummary(params: any) {
    this.reqData = {
      headerValue: {
        moduleId: 'MYTASKSADADTRAN',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        gcif: '',
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: '',
        filterFlag: '',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-sadadSinglePayments.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }
  }

  filePaymentsSummary(params: any): Observable<any> {
    let pendingFilePaymentsReqData = {
      headerValue: {
        moduleId: 'PENDSADUPSUM',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },

      dataValue: {
        fromRowNo: params.fromRow, //dynamic
        toRowNo: params.toRow,
        filterList: params.filterArray
          ? params.filterArray
          : [
              {
                filterField: 'ACTION_DISPVAL',
                filterConstraint: 'contains',
                filterValue: '',
              },
            ],
        unitId: params.unitId,
        groupBy: params.groupBy,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMyTaskList.json');
    } else {
      return this.http.post(
        `${environment.restAPI}`,
        pendingFilePaymentsReqData
      );
    }

    // return this.http.post(`${environment.restAPI}`, pendingFilePaymentsReqData);
    // return this.http.get('/assets/simulateAPI/pendingFilePayments.json');
  }

  serviceRequestSummaryCall(params: any): Observable<any> {
    let serviceRequestDetailsData = {
      headerValue: {
        moduleId: 'PENDSRQ',
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },

      dataValue: {
        fromRowNo: '0',
        toRowNo: '45',
        filterMap: [
          {
            filterField: 'ACTION_DISPVAL',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: params.groupBy,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-serviceRequest.json');
    } else {
      return this.http.post(
        `${environment.restAPI}`,
        serviceRequestDetailsData
      );
    }

    //  return this.http.get('/assets/simulateAPI/pa-serviceRequest.json');
    //  return this.http.get('/assets/simulateAPI/500reponse.json');
    // return this.http.post(`${environment.restAPI}`, serviceRequestDetailsData);
  }

  pendingSadadBillerSummaryApi(params: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'SADPENDQUEUE',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: '0',
        productName: 'PAYMNT',
        subProductName: 'SADLIBR',
        functionCode: 'SADLB',
        toRowNo: '45',
        filterList: params.filterArray,
        unitId: '',
        groupBy: params.groupBy,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-sadadbiller.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/pa-sadadbiller.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  getSadadGalleryDetails(obj: any): Observable<any> {
    let reqData = {
      headerValue: {
        moduleId: 'SADADBILLERDETAIL',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        userNo: '',
        gcif: '',
        txnRefNo: obj.lib_ref_no,
        unitId: '',
        nickName: obj.nickName,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadGalleryDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
    // return this.http.get('/assets/simulateAPI/sadadGalleryDetails.json');
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  sadadBillerApproveApi(DATA: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADPENDAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        // "INPUT_ACTION": "LIB_AUTH",
        // "PAGE_CODE_TYPE": "SADADFRM",
        // "PRODUCT_NAME": "PAYMNT",
        // "INPUT_PRODUCT": "PAYMNT",
        // "INPUT_SUB_PRODUCT": "SADLIBR",
        // "INPUT_REFERENCE_NO": DATA.lib_ref_no,
        // "REFERENCE_NO": DATA.lib_ref_no,
        // "OD_REF_NO": DATA.lib_ref_no,
        // "IS_REAUTH_VALIDATED": "YES",
        // "TYPE": "Authorize",
        // "INPUT_FUNCTION_CODE": DATA.functionCode,//
        // "INPUT_CUST_TYPE": "C",
        // "UTILITY_PROVIDER_CODE": DATA.BillerCode,  //BILLER_CODE
        // "UTILITY_TYPE_CODE": DATA.BillerCode, //BILLER_CODE
        // "UTILITY_PROVIDER_ID": DATA.BillerCode, //BILLER_CODE
        // "SERVICE_PROVIDER": "", // Empty
        // "SERVICE_TYPE": "", // Empty
        // "SERVICE_DESCRIPTION": "",
        // "UTILITY_PROVIDER_NAME": DATA.billerGroup, //BILLER_COMPANY
        // "PAYMENT_TYPE": "", // Empty
        // "UTILITY_ACC_NUMBER": DATA.SubscriberID, //SUBSCRIBER_ID
        // "CONSUMER_ID": "",
        // "PAYEE_NICKNAME": DATA.nickName,
        // "BILLER_GROUP_NAME": DATA.billerGroup,//groupname
        // "BILLER_GROUP_CODE": DATA.BillerGroupCode,
        // "BILLER_COMPANY": DATA.BillerName,// billername
        // "BILLER_CODE": DATA.BillerCode,
        // "SUBSCRIBER_ID": DATA.SubscriberID,
        // "NICK_NAME": DATA.nickName,
        // "AUTOPAY_ENABLED": DATA.enableAutoPay,
        // "RESTRICTED_ACCESS": DATA.cif_values,
        // "INPUT_USER_NO": DATA.userNo,
        // "INPUT_GCIF": DATA.gcif,
        // "REQUEST_TYPE": "REAUTH_VALIDATE",
        // "BILLER_ID": DATA.BillerName, //phani confirms
        // "BILLER_NAME": DATA.BillerName,
        // "CIF_NUM_LOOKUP": DATA.cif_values,
        // "SEL_PARSED_RULE_ID": DATA.PARSED_RULE_ID,
        // "SECOND_AUTH": DATA.SELECTION_FLAG,
        // "USER_NUMBER_LIST": DATA.USER_NUMBER_LIST,
        // "sefAuthFlag": DATA.sefAuthFlag,
        // "REMARKS": DATA.remarks

        AUTH_FLAG: 'Y',
        INPUT_GCIF: '', //empty - phani
        INPUT_USER_NO: '', //empty - phani
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER', //phani confirmed
        INPUT_SUB_PRODUCT: 'CUSER', //phani confirmed
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: DATA.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: DATA.selectedRec,
        },
        SEL_PARSED_RULE_ID: DATA.PARSED_RULE_ID,
        SECOND_AUTH: DATA.SELECTION_FLAG,
        USER_NUMBER_LIST: DATA.USER_NUMBER_LIST,
        sefAuthFlag: DATA.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/authorizereject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }

    // return this.http.post(`${environment.restAPI}`, reqdata);
    // return this.http.get('/assets/simulateAPI/authorizereject.json')
  }

  sadadBillerRejectApi(DATA: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADPENDREJT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        // INPUT_ACTION: 'LIB_REJECT',
        // PAGE_CODE_TYPE: 'SADADFRM',
        // PRODUCT_NAME: 'PAYMNT',
        // INPUT_PRODUCT: 'PAYMNT',
        // INPUT_SUB_PRODUCT: 'SADLIBR',
        // INPUT_REFERENCE_NO: DATA.lib_ref_no,
        // REFERENCE_NO: DATA.lib_ref_no,
        // OD_REF_NO: DATA.lib_ref_no,
        // IS_REAUTH_VALIDATED: 'YES',
        // TYPE: 'Authorize',
        // INPUT_FUNCTION_CODE: DATA.functionCode, //
        // INPUT_CUST_TYPE: 'C',
        // UTILITY_PROVIDER_CODE: DATA.BillerCode, //BILLER_CODE
        // UTILITY_TYPE_CODE: DATA.BillerCode, //BILLER_CODE
        // UTILITY_PROVIDER_ID: DATA.BillerCode, //BILLER_CODE
        // SERVICE_PROVIDER: '', // Empty
        // SERVICE_TYPE: '', // Empty
        // SERVICE_DESCRIPTION: '',
        // UTILITY_PROVIDER_NAME: DATA.billerGroup, //BILLER_COMPANY
        // PAYMENT_TYPE: '', // Empty
        // UTILITY_ACC_NUMBER: DATA.SubscriberID, //SUBSCRIBER_ID
        // CONSUMER_ID: '',
        // PAYEE_NICKNAME: DATA.nickName,
        // BILLER_GROUP_NAME: DATA.billerGroup, //billergroupname
        // BILLER_GROUP_CODE: DATA.BillerGroupCode,
        // BILLER_COMPANY: DATA.BillerName, // billername
        // BILLER_CODE: DATA.BillerCode,
        // SUBSCRIBER_ID: DATA.SubscriberID,
        // NICK_NAME: DATA.nickName,
        // AUTOPAY_ENABLED: DATA.enableAutoPay,
        // RESTRICTED_ACCESS: DATA.cif_values,
        // INPUT_USER_NO: DATA.userNo,
        // INPUT_GCIF: DATA.gcif,
        // BILLER_ID: DATA.BillerName, //phani confirms
        // BILLER_NAME: DATA.BillerName,
        // CIF_NUM_LOOKUP: DATA.cif_values,
        // REQUEST_TYPE: 'REAUTH_VALIDATE',
        // REMARKS: DATA.remarks,
        // REJECT_REASON: DATA.remarks,

        AUTH_FLAG: 'Y',
        INPUT_GCIF: '', //empty - phani
        INPUT_USER_NO: '', //empty - phani
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'LIB_REJECT',
        INPUT_FUNCTION_CODE: DATA.functionCode,
        INPUT_PRODUCT: 'PAYMNT', //phani confirmed
        INPUT_SUB_PRODUCT: 'SADLIBR', //phani confirmed
        PAGE_CODE_TYPE: 'SADADFRM',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'REAUTH_VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: DATA.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: DATA.selectedRec,
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/authorizereject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }

    // return this.http.post(`${environment.restAPI}`, reqdata);
    // return this.http.get('/assets/simulateAPI/authorizereject.json')
  }

  getSingleInprogressSummary(params: any): Observable<any> {
    this.reqData = {
      headerValue: {
        moduleId: 'PENDBEN',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterMap: [
          {
            filterField: 'ACTION_DISPVAL',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        filterList: params.filterArray,
        unitId: '',
        groupBy: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-singleInprogress.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }
    //return this.http.get('/assets/simulateAPI/error_500.json');
    // return this.http.get('/assets/simulateAPI/pa-singleInprogress.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData);
  }

  getBulkInprogressSummary(params: any) {
    this.reqData = {
      headerValue: {
        moduleId: 'CONTACTBULKIP',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        userNo: '',
        gcif: '',
        sortColumn: '',
        sortDirection: '',
        fromRowNo: '0',
        toRowNo: '45',
        groupBy: params.groupBy,
        filterMap: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        accCcy: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-bulkInprogress.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }

    // return this.http.get('/assets/simulateAPI/pa-bulkInprogress.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData);
  }

  chequeBookRequestApproveApiCall(params: any) {
    let acceptData = {
      headerValue: {
        moduleId: 'SERAUTH',
        simulate: `N`,
      },
      dataValue: {
        ACTION: 'GNSRIN',
        INPUT_HOST_CODE: 'GNSREQ',
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: params.otp,
        PARAM2: params.authRef,
        REMARKS: params.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNumber,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.versionNumber,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SECOND_AUTH: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
        sefAuthFlag: params.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approveSuccess.json');
    } else {
      return this.http.post(`${environment.restAPI}`, acceptData);
    }
    //return this.http.get('/assets/simulateAPI/approveSuccess.json')
    // return this.http.post(`${environment.restAPI}`, acceptData);
  }

  chequeBookRequestRejectApiCall(params: any) {
    let rejectData = {
      headerValue: {
        moduleId: 'SERAUTH',
        simulate: `N`,
      },
      dataValue: {
        ACTION: 'GNSRIN',
        INPUT_HOST_CODE: 'GNSREQ',
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: params.remarks,
        REJECT_REASON: params.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNumber,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.versionNumber,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approveSuccess.json');
    } else {
      return this.http.post(`${environment.restAPI}`, rejectData);
    }

    //return this.http.get('/assets/simulateAPI/approveSuccess.json')
    // return this.http.post(`${environment.restAPI}`, rejectData);
  }
  getBeneficiaryInProgressDetails(beneId: any, subprd: any) {
    this.reqData = {
      headerValue: {
        moduleId: 'CONTACTIPDET',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        userNo: '',
        gcif: '',
        sortColumn: '',
        sortDirection: '',
        fromRowNo: '0',
        toRowNo: '45',
        groupBy: '',
        filterMap: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        beneId: beneId,
        subPdtCode: subprd,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/myTaskBeneficiaryDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData);
    }
    // return this.http.post(`${environment.restAPI}`, this.reqData)
    // return this.http.get('http://localhost:4200/assets/simulateAPI/myTaskBeneficiaryDetails.json');
  }
  authorizeBeneficiaryAPICall(data: any) {
    let acceptContactData = {
      headerValue: {
        moduleId: 'BENEAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue:
        // {
        //   INPUT_USER_NO: '202118004360',
        //   INPUT_GCIF: '5000020027',
        //   INPUT_ACTION: 'LIB_AUTH',
        //   PAGE_CODE_TYPE: 'BENE_FORM',
        //   PRODUCT_NAME: 'PAYMNT',
        //   INPUT_PRODUCT: 'PAYMNT',
        //   INPUT_SUB_PRODUCT: 'BENE',
        //   REJECT_REASON: '',
        //   TYPE: 'Authorize',
        //   INPUT_FUNCTION_CODE: 'CRBENE',
        //   REQUEST_TYPE: 'REAUTH_VALIDATE',
        //   PARAM1: data.otp,
        //   PARAM2: data.authRef,
        //   INPUT_CUST_TYPE: 'C',
        //   BENE_ACC_NO: data.accNumber,
        //   REFERENCE_NO: data.refNumber,
        //   INPUT_CHANNEL_ID: '3',
        //   PAYMENT_VALUE: data.subProductCode,
        //   BENE_ID: data.beneId,
        //   BENE_NME: data.beneName,
        //   OD_REF_NO: data.refNumber,
        //   ALIAS_NAME: data.aliasName,
        //   confFlag: 'Y',
        //   INPUT_CONFIRMATION: 'C',
        //   CIF_FLAG: 'N',
        //   PAYMENT_MODE: data.subProductCode,
        //   IS_REAUTH_VALIDATED: 'YES',
        // },
        {
          AUTH_FLAG: 'Y',
          INPUT_GCIF: '', //empty - phani
          INPUT_USER_NO: '', //empty - phani
          IS_REAUTH_VALIDATED: 'YES',
          INPUT_ACTION: 'AUTH_TXN',
          INPUT_FUNCTION_CODE: 'VSBLTY',
          INPUT_PRODUCT: 'CUSER', //phani confirmed
          INPUT_SUB_PRODUCT: 'CUSER', //phani confirmed
          PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
          PRODUCT_NAME: 'CUSER',
          REQUEST_TYPE: 'VALIDATE',
          ACTION_TYPE: '',
          PARAM1: '',
          PARAM2: '',
          REMARKS: data.remarks ? data.remarks : '',
          SELECTED_RECORDS: {
            SELECTED_RECORDS: data.selectedRec,
          },
          SEL_PARSED_RULE_ID: data.PARSED_RULE_ID,
          SECOND_AUTH: data.SELECTION_FLAG,
          USER_NUMBER_LIST: data.USER_NUMBER_LIST,
          sefAuthFlag: data.sefAuthFlag,
        },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approveSuccess.json');
    } else {
      return this.http.post(`${environment.restAPI}`, acceptContactData);
    }

    // return this.http.get('/assets/simulateAPI/approveSuccess.json')
    // return this.http.post(`${environment.restAPI}`, acceptContactData);
  }

  rejectBeneficiaryAPICall(data: any) {
    let contactRejectData = {
      headerValue: {
        moduleId: 'BENEREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue:
        // {
        //   INPUT_USER_NO: '202118004360',
        //   INPUT_GCIF: '5000020027',
        //   INPUT_ACTION: 'LIB_REJECT',
        //   PAGE_CODE_TYPE: 'BENE_FORM',
        //   PRODUCT_NAME: 'PAYMNT',
        //   INPUT_PRODUCT: 'PAYMNT',
        //   INPUT_SUB_PRODUCT: 'BENE',
        //   REJECT_REASON: data.remarks,
        //   TYPE: 'Authorize',
        //   INPUT_FUNCTION_CODE: 'CRBENE',
        //   REQUEST_TYPE: 'REAUTH_VALIDATE',
        //   PARAM1: '',
        //   PARAM2: '',
        //   INPUT_CUST_TYPE: 'C',
        //   BENE_ACC_NO: data.accNumber,
        //   REFERENCE_NO: data.refNumber,
        //   INPUT_CHANNEL_ID: '3',
        //   PAYMENT_VALUE: data.subProductCode,
        //   BENE_ID: data.beneId,
        //   BENE_NME: data.beneName,
        //   OD_REF_NO: data.refNumber,
        //   ALIAS_NAME: data.aliasName,
        //   confFlag: 'Y',
        //   INPUT_CONFIRMATION: 'C',
        //   CIF_FLAG: 'N',
        //   PAYMENT_MODE: data.subProductCode,
        //   IS_REAUTH_VALIDATED: 'YES',
        // },
        {
          AUTH_FLAG: 'Y',
          INPUT_GCIF: '', //empty - phani
          INPUT_USER_NO: '', //empty - phani
          IS_REAUTH_VALIDATED: 'YES',
          INPUT_ACTION: 'REJECT_TXN',
          INPUT_FUNCTION_CODE: 'VSBLTY',
          INPUT_PRODUCT: 'CUSER', //phani confirmed
          INPUT_SUB_PRODUCT: 'CUSER', //phani confirmed
          PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
          PRODUCT_NAME: 'CUSER',
          REQUEST_TYPE: 'VALIDATE',
          ACTION_TYPE: '',
          PARAM1: '',
          PARAM2: '',
          REMARKS: '',
          SELECTED_RECORDS: {
            SELECTED_RECORDS: data.selectedRec,
          },
        },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approveSuccess.json');
    } else {
      return this.http.post(`${environment.restAPI}`, contactRejectData);
    }
    //return this.http.get('/assets/simulateAPI/approveSuccess.json')
    // return this.http.post(`${environment.restAPI}`, contactRejectData);
  }

  rejectSingleTransfer(params: any): Observable<any> {
    const payload = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: params.remarks,
        REJECT_REASON: params.rejectReason,
        RATE_REFERENCE_NO: params.refNo, //empty
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.referenceNumber,
              PRODUCT: params.product,
              SUB_PRODUCT: params.subProduct,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.version,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/singlePaymentReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payload);
    }
    //return this.http.get('/assets/simulateAPI/singlePaymentReject.json');
    // return this.http.post(`${environment.restAPI}`, payload);
  }

  authorizeSingleTransfer(params: any): Observable<any> {
    const payload = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: params.param1,
        PARAM2: params.param2,
        REMARKS: params.remarks,
        RATE_REFERENCE_NO: params.refNo,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.referenceNumber,
              PRODUCT: params.product,
              SUB_PRODUCT: params.subProduct,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.version,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SECOND_AUTH: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
        sefAuthFlag: params.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/singlePaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payload);
    }
    //return this.http.get('/assets/simulateAPI/singlePaymentAuthorize.json');
    // return this.http.post(`${environment.restAPI}`, payload);
  }

  sadadPaymentsAuthorizeApiCall(data: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN', //AUTH_TXN
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: data.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.refNumber,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProductCode,
              ACTION: data.action,
              INPUT_HOST_CODE: data.hostCode,
              INPUT_VER_NO: data.versionNumber,
            },
          ],
        },
        SEL_PARSED_RULE_ID: data.PARSED_RULE_ID,
        SECOND_AUTH: data.SELECTION_FLAG,
        USER_NUMBER_LIST: data.USER_NUMBER_LIST,
        sefAuthFlag: data.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json');
    // return this.http.post(`${environment.restAPI}`, reqdata);
  }

  sadadPaymentsRejectApiCall(data: any, remarks: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: remarks,
        REJECT_REASON: remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.refNumber,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProductCode,
              ACTION: data.action,
              INPUT_HOST_CODE: data.hostCode,
              INPUT_VER_NO: data.versionNumber,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json')
    // return this.http.post(`${environment.restAPI}`, reqdata);
  }

  sadadMoiPaymentsAuthorizeApiCall(
    data: any,
    summaryObj: any,
    authkey: any
  ): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADMOIAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        OD_SUBPROD_CODE: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: authkey.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
        SEL_PARSED_RULE_ID: authkey.PARSED_RULE_ID,
        SECOND_AUTH: authkey.SELECTION_FLAG,
        USER_NUMBER_LIST: authkey.USER_NUMBER_LIST,
        sefAuthFlag: authkey.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json')
    // return this.http.post(`${environment.restAPI}`, reqdata);
  }

  sadadMoiPaymentsRejectApiCall(data: any, rejectReason: any, summaryObj: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADMOIREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        OD_SUBPROD_CODE: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '1231',
        PARAM2: '1212123',
        REMARKS: rejectReason,
        REJECT_REASON: rejectReason,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json')
    // return this.http.post(`${environment.restAPI}`, reqdata);
  }

  aramcoPaymentsAuthorizeApiCall(data: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'ARAMCOAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: data.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.refNumber,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProductCode,
              ACTION: data.action,
              INPUT_HOST_CODE: data.hostCode,
              INPUT_VER_NO: data.versionNumber,
            },
          ],
        },
        SEL_PARSED_RULE_ID: data.PARSED_RULE_ID,
        SECOND_AUTH: data.SELECTION_FLAG,
        USER_NUMBER_LIST: data.USER_NUMBER_LIST,
        sefAuthFlag: data.sefAuthFlag,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json')
    // return this.http.post(`${environment.restAPI}`,reqdata);
  }
  aramcoPaymentsRejectApiCall(data: any, rejectReason: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'ARAMCOREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        OD_SUBPROD_CODE: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '1231',
        PARAM2: '1212123',
        REMARKS: rejectReason,
        REJECT_REASON: rejectReason,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.refNumber,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProductCode,
              ACTION: data.action,
              INPUT_HOST_CODE: data.hostCode,
              INPUT_VER_NO: data.versionNumber,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
    //return this.http.get('/assets/simulateAPI/sadadPaymentAuthorize.json')
    // return this.http.post(`${environment.restAPI}`,reqdata);
  }

  sadadMoiRefundRequestAuthorizeApiCall(
    data: any,
    summaryObj: any,
    authkey: any
  ): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADMOIREFAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        OD_SUBPROD_CODE: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: authkey.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
        SEL_PARSED_RULE_ID: authkey.PARSED_RULE_ID,
        SECOND_AUTH: authkey.SELECTION_FLAG,
        USER_NUMBER_LIST: authkey.USER_NUMBER_LIST,
        sefAuthFlag: authkey.sefAuthFlag,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  sadadMoiRefundRequestRejectApiCall(
    data: any,
    rejectReason: any,
    summaryObj: any
  ) {
    let reqdata = {
      headerValue: {
        moduleId: 'SADADMOIREFREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        OD_SUBPROD_CODE: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '1231',
        PARAM2: '1212123',
        REMARKS: rejectReason,
        REJECT_REASON: rejectReason,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  esalPaymentsAuthorizeApiCall(
    data: any,
    summaryObj: any,
    authkey: any
  ): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'ESALAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN', //AUTH_TXN
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: authkey.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
        SEL_PARSED_RULE_ID: authkey.PARSED_RULE_ID,
        SECOND_AUTH: authkey.SELECTION_FLAG,
        USER_NUMBER_LIST: authkey.USER_NUMBER_LIST,
        sefAuthFlag: authkey.sefAuthFlag,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  esalPaymentsRejectApiCall(data: any, remarks: any, summaryObj: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'ESALREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: remarks,
        REJECT_REASON: remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNo,
              PRODUCT: data.productCode,
              SUB_PRODUCT: data.subProdCode,
              ACTION: data.functionCode,
              INPUT_HOST_CODE: summaryObj.host_TXN_CODE,
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  pendingEsalBillerSummaryApi(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MYTASKESALPAYER',
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
        filterFlag: '',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/pa-esalBiller.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  esalBillerAuthorizeApiCall(data: any, authkey: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN', //AUTH_TXN
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: authkey.remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNumber,
              PRODUCT: 'PAYMNT', //Phani confirmed to hardcode the values
              SUB_PRODUCT: 'PAYRMAIN', //Phani confirmed to hardcode the values
              ACTION: 'PAYCRET', //Phani confirmed to hardcode the values
              INPUT_HOST_CODE: 'ESBI', //May change
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
        SEL_PARSED_RULE_ID: authkey.PARSED_RULE_ID,
        SECOND_AUTH: authkey.SELECTION_FLAG,
        USER_NUMBER_LIST: authkey.USER_NUMBER_LIST,
        sefAuthFlag: authkey.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  esalBillerRejectApiCall(data: any, remarks: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: remarks,
        REJECT_REASON: remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: data.referenceNumber,
              PRODUCT: 'PAYMNT', //Phani confirmed to hardcode the values
              SUB_PRODUCT: 'PAYRMAIN', //Phani confirmed to hardcode the values
              ACTION: 'PAYCRET', //Phani confirmed to hardcode the values
              INPUT_HOST_CODE: 'ESBI', //May change
              INPUT_VER_NO: data.odVersionNo,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }
  getExchangeRateApiCall(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'EXCHANGERATE',
      },
      dataValue: {
        accNo: reqObj.debitAccNo,
        productCode: 'PAYMNT',
        subProdCode: reqObj.subProduct,
        funcCode: reqObj.functionCode,
        amount: reqObj.paymentAmount,
        cmp: reqObj.transactionInputType,
        action: 'GETRATE',
        cifNo: reqObj.debitCifNo,
        unitID: reqObj.debitUnitId,
        countryCode: reqObj.debitCountryCode,
        dealRefNo: '',
        product_processor: 'default',
        baseCurrency: '',
        debitCurrency: reqObj.debitCurrencyCode,
        debitorcredit: reqObj.transactionType,
        pymntCurrency: reqObj.paymentCurrency,
      },
      footerValue: {},
    };
    //return this.http.get('/assets/simulateAPI/Payment_ExchangeRate.json');
    return this.http.post(`${environment.restAPI}`, reqData);
  }
  instantTransferManagementSummaryAPICall(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'IPSREGPENACT',
        simulate: `${environment.isSimulate}`, //currently not implemented sorting and from row & to to row from API side -confirmed by Kavithaa
      },
      dataValue: {
        languageId: 'en_US',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/pa-instantTransferManagement.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  ipsRegDeRegAndQTLAuthorizeAPICall(params: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '10000187',
        INPUT_USER_NO: '202204007003',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNumber,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.versionNumber,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SECOND_AUTH: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
        sefAuthFlag: params.sefAuthFlag,
        REMARKS: params.remarks,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ipsAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  ipsRegDeRegAndQTLRejectAPICall(params: any, remarks: any) {
    let reqdata = {
      headerValue: {
        moduleId: 'TXNAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '10000187',
        INPUT_USER_NO: '202204007003',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: remarks,
        REJECT_REASON: remarks,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNumber,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.versionNumber,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ipsAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }
  myTaskBulkSummary(params: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'PENDFUP',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterMap: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: params.unitId,
        groupBy: params.groupBy,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/myTaskBulkSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  // params needs to be passed -- not fully completed
  payrollAuthorizeApiCall(param: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'PAYFILEAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: param.functionCode, //
        INPUT_PRODUCT: param.productCode,
        INPUT_SUB_PRODUCT: param.subProductCode, //
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: param.refNumber, //
        MODE: 'FILE_AUTH',
        ACTION_KEY: param.action,
        PARAM1: '1231', //not mentioned in bulk summary response
        PARAM2: '1212123', //not mentioned in bulk summary response
        REJECT_REASON: '', // Empty
        REMARKS: '', // Empty
        SELECTED_RECORDS: param.refNumber, //not mentioned in bulk summary response so what key we have to pass
        INPUT_VER_NO: param.versionNumber, // from summary or pass empty
        IGNORE_MASKING: 'false',
        REQ_COUNTRY_CODE: param.countryCode, //
        UNIT_ID: param.unitId, //
        CIF_NO: param.cifNo, //
        VALUE_DATE: param.valueDate, //
        DEAL_AVAILABLE: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  // params needs to be passed -- not fully completed
  payrollRejectApiCAll(param: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'PAYFILEREJ',
        simulate: `${environment.restAPI}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: param.functionCode,
        INPUT_PRODUCT: param.productCode,
        INPUT_SUB_PRODUCT: param.subProductCode,
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: param.refNumber,
        MODE: 'FILE_AUTH',
        ACTION_KEY: param.action,
        PARAM1: '',
        PARAM2: '',
        REJECT_REASON: param.rejectReason,
        REMARKS: '',
        SELECTED_RECORDS: param.refNumber,
        INPUT_VER_NO: param.versionNumber,
        IGNORE_MASKING: 'false',
        REQ_COUNTRY_CODE: param.countryCode,
        UNIT_ID: param.unitId,
        CIF_NO: param.cifNo,
        VALUE_DATE: param.valueDate,
        DEAL_AVAILABLE: '',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  sadadFilePaymentsAuthorizeApiCall(data: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADUPAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: data.functionCode,
        INPUT_PRODUCT: data.productCode,
        INPUT_SUB_PRODUCT: data.subProductCode,
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: data.refNumber, //"TBC2112271518589",
        PARAM1: '', // pass empty
        PARAM2: '', // pass empty
        REJECT_REASON: '',
        SEL_PARSED_RULE_ID: data.PARSED_RULE_ID,
        SECOND_AUTH: data.SELECTION_FLAG,
        USER_NUMBER_LIST: data.USER_NUMBER_LIST,
        sefAuthFlag: data.sefAuthFlag,
        REMARKS: data.remarks,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadFilePaymentAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  sadadFilePaymentRejectApiCall(data: any): Observable<any> {
    let reqdata = {
      headerValue: {
        moduleId: 'SADUPAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: data.functionCode,
        INPUT_PRODUCT: data.productCode,
        INPUT_SUB_PRODUCT: data.subProductCode,
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: data.refNumber, //"TBC2112271518589",
        PARAM1: '', // pass empty
        PARAM2: '', // pass empty
        REJECT_REASON: data.rejectReason,
        REMARKS: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadPaymentReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqdata);
    }
  }

  setSelectedElementDetails(data: any) {
    this.selectedElementDetails = data;
  }

  getSelectedElementDetails() {
    return this.selectedElementDetails;
  }

  fetchAccountDetails(params: any) {
    const reqData = {
      MODULE_ID: 'PAYUPDETAIL',
      REQ_ACCOUNT_NUMBER: params.REQ_ACCOUNT_NUMBER,
      CIF_NO: params.CIF_NO,
      REQ_COUNTRY_CODE: params.REQ_COUNTRY_CODE,
      UNIT_ID: params.UNIT_ID,
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollAccountDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ------------ Payroll Onbording section ----------------------------------------
  selfAuthCheck(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        unitId: reqObj.debitUnitId,
        cif: reqObj.debitCifNo,
        productCode: 'PAYMNT',
        subProdCode: reqObj.subProduct,
        funcCode: reqObj.functionCode,
        amount: reqObj.paymentAmount,
        accNo: reqObj.debitPortalAccNo,
        pymntCurrency: reqObj.paymentCurrency,
        debitCurrency: reqObj.debitCurrencyCode,
      },
      footerValue: {},
    };
    // return this.http.get('/assets/simulateAPI/secFactAuth.json');
    return this.http.post(`${environment.restAPI}`, reqData);
  }

  payrollOnboardingSummary(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'MYPAYROLLONSUMY',
        sortColumn: params.sortColumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        groupBy: '',
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollOnbordingSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  payrollOnboardingSelfAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'PAYROLLONAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: params.cif,
        productCode: params.productCode,
        subProdCode: params.subProdCode,
        funcCode: params.funcCode,
        amount: '',
        accNo: '',
        pymntCurrency: '',
        debitCurrency: '',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollOnboardingSelfAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  payrollOnboardingAuthorize(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'PAYROLLUPFILEAUTH',
        simulate: `${environment.isSimulate}`,
      },
      //     "dataValue": {
      //       "AUTH_FLAG": "Y",
      //       "IS_REAUTH_VALIDATED": "YES",
      //       "INPUT_ACTION": "AUTH_TXN",
      //       "INPUT_FUNCTION_CODE": "PYMTFNC",
      //       "INPUT_PRODUCT": "PAYMNT",
      //       "INPUT_SUB_PRODUCT": "PAYONBD",
      //       "PAGE_CODE_TYPE": "FILE_AUTH",
      //       "PRODUCT_NAME": "PAYMNT",
      //       "REQUEST_TYPE": "VALIDATE",
      //       "INPUT_REFERENCE_NO": params.INPUT_REFERENCE_NO,
      //       "MODE": "FILE_AUTH",
      //       "ACTION_KEY": "ACCEPT",
      //       "PARAM1": "",
      //       "PARAM2": "",
      //       "REJECT_REASON": "",
      //       "REMARKS": "",
      //       "SELECTED_RECORDS": params.SELECTED_RECORDS,
      //       "INPUT_VER_NO": params.INPUT_VER_NO,
      //       "UNIT_ID": params.UNIT_ID,
      //       "VALUE_DATE": params.VALUE_DATE,
      //       "DEAL_AVAILABLE:": ""
      //     },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN', //AUTH_TXN
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        PARAM2: '',
        REMARKS: '',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.INPUT_REFERENCE_NO,
              PRODUCT: 'PAYMNT',
              SUB_PRODUCT: 'PAYONBD',
              ACTION: 'PYMTFNC',
              INPUT_HOST_CODE: 'PAYRON',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SECOND_AUTH: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
        // "sefAuthFlag": params.sefAuthFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/payrollOnboardingAuthorize.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  payrollOnboardingReject(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'PAYROLLONFILEREJ',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        REJECT_REASON: params.REJECT_REASON,
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.INPUT_REFERENCE_NO,
              PRODUCT: 'PAYMNT',
              SUB_PRODUCT: 'PAYONBD',
              ACTION: 'PYMTFNC',
              INPUT_HOST_CODE: 'PAYRON',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/payrollOnboardingReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getFeeDetailsPayrollOnboarding(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'PAYROLLONFEE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        accNo: params.accNo,
        subProductName: params.subProductName,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/payrollOnboardingFeeDetails.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ------------ Payroll Onbording section ----------------------------------------

  checkAuthorizationData(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        gcif: params.gcif, //
        unitId: params.unitID,
        cif: params.cif, //
        productCode: params.productCode, //
        subProdCode: params.subProdCode, //
        funcCode: params.funcCode,
        amount: params.amount,
        accNo: params.accNo, //
        pymntCurrency: params.pymntCurrency,
        debitCurrency: params.debitCurrency,
        secondAuthChk: 'Y',
        referenceNo: params.referenceNo, //
      },
      footerValue: {},
    };
    //debugger
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approvedSelfAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //----------------------------------------- Ben Upload MyTask Start----------------------------------------------------------------------------------

  //----------------------------------------My task Summary Ben Upload--------------------------------------------------

  getMytaskSummaryBenUpload(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MYBENEUPSUMY',
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: params.fromRow, //
        toRowNo: params.toRow, //
        groupBy: '',
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadMytaskSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //----------------------------------------Authorize  Ben Upload--------------------------------------------------
  benAuthorize(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'BENEUPFILEAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'BULKUP',
        INPUT_PRODUCT: 'PAYMNT',
        INPUT_SUB_PRODUCT: 'BENEUP',
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: params.INPUT_REFERENCE_NO, //
        MODE: 'FILE_AUTH',
        ACTION_KEY: 'ACCEPT',
        PARAM1: '', // ""
        PARAM2: '', // ""
        REJECT_REASON: '',
        REMARKS: '',
        SELECTED_RECORDS: params.INPUT_REFERENCE_NO, // ref no
        INPUT_VER_NO: params.INPUT_VER_NO, //
        IGNORE_MASKING: 'false',
        UNIT_ID: params.UNIT_ID, //
        VALUE_DATE: params.VALUE_DATE, //
        'DEAL_AVAILABLE:': '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //----------------------------------------Reject  Ben Upload--------------------------------------------------

  benReject(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'BENEUPFILEREJ',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'BULKUP',
        INPUT_PRODUCT: 'PAYMNT',
        INPUT_SUB_PRODUCT: 'BENEUP',
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: params.INPUT_REFERENCE_NO, //
        MODE: 'FILE_AUTH',
        ACTION_KEY: 'REJECT',
        PARAM1: '',
        PARAM2: '',
        REJECT_REASON: params.REJECT_REASON,
        REMARKS: params.REJECT_REASON,
        SELECTED_RECORDS: params.INPUT_REFERENCE_NO, //
        INPUT_VER_NO: params.INPUT_VER_NO, //
        IGNORE_MASKING: 'false',
        UNIT_ID: params.UNIT_ID, //
        VALUE_DATE: params.VALUE_DATE, //
        'DEAL_AVAILABLE:': '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/benUploadReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  //----------------------------------------- Ben Upload MyTask End---------------------------------------------------------------------------

  //----------------------------------------- Stop Payment Checker Start ---------------------------------------------------------------------------

  getStopPaymentSubmittedRecords(params: any): any {
    const reqObject = {
      headerValue: {
        moduleId: 'MYSTOPPMNTONBINQ',
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        groupBy: '',
        filterList: params.filterArray,
        filterFlag: params.filterFlag,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/stopPaymentSubmittedRecords.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqObject);
    }
  }

  getStopPaymentDetails(params: any): any {
    const reqObject = {
      headerValue: {
        moduleId: 'STOPPMNTFILEDETAILS',
        simulate: environment.isSimulate,
      },
      dataValue: {
        REFERENCE_NUM: params.referenceNo,
        subProductName: 'STPFNC',
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/stopPaymentDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObject);
    }
  }

  getRecordsToStop(params: any): any {
    const reqObject = {
      headerValue: {
        moduleId: 'STPPMNTRECSUM',
        simulate: environment.isSimulate,
      },
      dataValue: {
        productName: 'PAYMNT',
        subPdt: 'STPPMNT',
        functionCode: 'STPFNC',
        refNo: params.referenceNumber,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/recordsToStop.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObject);
    }
  }

  authorizeStopPayment(params: any): any {
    const reqObject = {
      headerValue: {
        moduleId: 'SALPAYONFILEAUTH',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'STPFNC',
        INPUT_PRODUCT: 'PAYMNT',
        INPUT_SUB_PRODUCT: 'STPPMNT',
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: params.referenceNo,
        MODE: 'FILE_AUTH',
        ACTION_KEY: 'ACCEPT',
        REMARKS: params.note,
        SELECTED_RECORDS: params.referenceNo,
        IGNORE_MASKING: 'false',
        UNIT_ID: params.unitId,
        SEL_PARSED_RULE_ID: params.authorId,
        sefAuthFlag: params.selfAuth,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/authorizeStopPayment.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObject);
    }
  }

  rejectStopPayment(params: any): any {
    const reqObject = {
      headerValue: {
        moduleId: 'SALPAYONFILEREJ',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'STPFNC',
        INPUT_PRODUCT: 'PAYMNT',
        INPUT_SUB_PRODUCT: 'STPPMNT',
        PAGE_CODE_TYPE: 'FILE_AUTH',
        PRODUCT_NAME: 'PAYMNT',
        REQUEST_TYPE: 'VALIDATE',
        INPUT_REFERENCE_NO: params.referenceNo,
        MODE: 'FILE_AUTH',
        ACTION_KEY: 'REJECT',
        REJECT_REASON: params.rejectReason,
        REMARKS: params.rejectReason,
        SELECTED_RECORDS: params.referenceNo,
        IGNORE_MASKING: 'false',
        UNIT_ID: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/rejectStopPayment.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObject);
    }
  }
  //----------------------------------------- Stop Payment Checker End ---------------------------------------------------------------------------

  getLgSummary(params: any): Observable<any> {
    const reqObj = {
      headerValue: {
        moduleId: 'MYLGSUMY',
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        groupBy: '',
        filterList: [
          {
            filterField: params.filterField,
            filterConstraint: params.filterConstraint,
            filterValue: params.filterValue,
          },
        ],
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeLgSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  getLgDetails(params: any): Observable<any> {
    const reqObj = {
      headerValue: {
        moduleId: 'LGDETAIL',
        simulate: environment.isSimulate,
      },
      dataValue: {
        REFERENCE_NUMBER: params.REFERENCE_NUMBER,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeGetLgDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  authorizeLg(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'LGAUTHORIZE',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        REMARKS: params.remarks,
        RATE_REFERENCE_NO: '',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.referenceNumber,
              PRODUCT: params.PRODUCT,
              SUB_PRODUCT: params.SUB_PRODUCT,
              ACTION: params.ACTION,
              INPUT_HOST_CODE: params.INPUT_HOST_CODE,
              INPUT_VER_NO: params.version,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.PARSED_RULE_ID,
        SECOND_AUTH: params.SELECTION_FLAG,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeAuthorizeLg.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  rejectLg(params: any): Observable<any> {
    const reqObj = {
      headerValue: {
        moduleId: 'LGREJECT',
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        REMARKS: '',
        REJECT_REASON: params.remarks,
        RATE_REFERENCE_NO: '',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.referenceNumber,
              PRODUCT: 'NBMTRD',
              SUB_PRODUCT: 'LGCSMAR',
              ACTION: 'CRRNTS',
              INPUT_HOST_CODE: 'TRLG',
              INPUT_VER_NO: params.version,
            },
          ],
        },
        SEL_PARSED_RULE_ID: '',
        SECOND_AUTH: '',
        USER_NUMBER_LIST: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/eTradeRejectLg.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  // ---------------------------------------- POS MYTASK SUMMARY STARTS HERE -----------------------------------------------------------------------------------
  getMytaskSummaryPosUpload(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MYTASKPOSUPDSUMY',
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
            filterValue: params.filterValue,
            fromAmt: params.fromAmt,
            toAmt: params.toAmt,
            fromDate: params.fromDate,
            toDate: params.toDate,
          },
        ],
        unitId: params.unitId,
        groupBy: params.groupBy,
        filterFlag: params.filterFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posUploadSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMytaskSummaryPos(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MYTASKPOSSUMY',
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
            filterValue: params.filterValue,
            fromAmt: params.fromAmt,
            toAmt: params.toAmt,
            fromDate: params.fromDate,
            toDate: params.toDate,
          },
        ],
        unitId: params.unitId,
        groupBy: params.groupBy,
        filterFlag: params.filterFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posMytaskSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransactionDetails(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        refNo: params.refNo,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posTransactionDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posRejectSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSTRANSREJ',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: params.INPUT_GCIF,
        INPUT_USER_NO: params.INPUT_USER_NO,
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        REJECT_REASON: params.REJECT_REASON,
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.PRODUCT,
              SUB_PRODUCT: params.SUB_PRODUCT,
              ACTION: params.ACTION,
              INPUT_HOST_CODE: params.INPUT_HOST_CODE,
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posRejectSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posAuthorizeSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSTRANSAUTH',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: params.INPUT_GCIF,
        INPUT_USER_NO: params.INPUT_USER_NO,
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.PRODUCT,
              SUB_PRODUCT: params.SUB_PRODUCT,
              ACTION: params.ACTION,
              INPUT_HOST_CODE: params.INPUT_HOST_CODE,
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posAuthorizeSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posRecordSummary(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'MULCLMRCRDSUMMY',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        productName: params.productName,
        subPdt: params.subPdt,
        functionCode: params.functionCode,
        refNo: params.refNo,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posRecordSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ---------------------------------------- POS MYTASK SUMMARY ENDS HERE -----------------------------------------------------------------------------------

  getMyTaskSummaryAdditionalAccount(params: any) {
    //harshita verified
    let reqData = {
      headerValue: {
        moduleId: 'MYADDACCSUMY', //harshita told to pass static value
        sortColumn: params.sortcolumn, //harshita told to pass dynamic value
        sortOrder: params.sortDirection, //harshita told to pass dynamic value
      },
      dataValue: {
        fromRowNo: params.fromRow, //harshita told to pass dynamic value
        toRowNo: params.toRow, //harshita told to pass dynamic value
        filterMap: [
          {
            filterField: 'ACTION_DISPVAL', //harshita told to pass static value
            filterConstraint: 'contains', //harshita told to pass static value
            filterValue: '', //harshita told to pass empty value
          },
        ],
        unitId: params.unitId, //harshita told to pass dynamic value
        groupBy: '', //harshita told to pass empty value
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/myTaskAdditionalAccount.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  additionalAccountAuthorize(params: any) {
    //harshita verified
    let reqData = {
      headerValue: {
        moduleId: 'ADDACCAUTH', //harshita told to pass static value
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y', // harshita told to pass static value
        INPUT_GCIF: '', // harshita told to pass empty value
        INPUT_USER_NO: '', // harshita told to pass empty value
        IS_REAUTH_VALIDATED: 'YES', // harshita told to pass static value
        INPUT_ACTION: 'AUTH_TXN', // harshita told to pass static value
        INPUT_FUNCTION_CODE: 'VSBLTY', // harshita told to pass static value
        INPUT_PRODUCT: 'CUSER', // harshita told to pass static value
        INPUT_SUB_PRODUCT: 'CUSER', // harshita told to pass static value
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW', // harshita told to pass static value
        PRODUCT_NAME: 'CUSER', // harshita told to pass static value
        REQUEST_TYPE: 'VALIDATE', // harshita told to pass static value
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.INPUT_REFERENCE_NO, // harshita told to pass dynamic value
              PRODUCT: 'CORESVS', // harshita told to pass static value
              SUB_PRODUCT: 'ACCINT', // harshita told to pass static value
              ACTION: 'ACCSUB', // harshita told to pass static value
              INPUT_HOST_CODE: 'OPNACT', // harshita told to pass static value
              INPUT_VER_NO: params.INPUT_VER_NO, // harshita told to pass dynamic value
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  additionalAccountReject(params: any) {
    // verfied by harshita
    let reqData = {
      headerValue: {
        moduleId: 'ADDACCREJ',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y', //harshita told to pass static value
        INPUT_GCIF: '10000187', //harshita told to pass static value
        INPUT_USER_NO: '202204007003', //harshita told to pass static value
        IS_REAUTH_VALIDATED: 'YES', //harshita told to pass static value
        INPUT_ACTION: 'REJECT_TXN', //harshita told to pass static value
        REJECT_REASON: params.REJECT_REASON, //harshita told to pass dynamic value
        INPUT_FUNCTION_CODE: 'VSBLTY', //harshita told to pass static value
        INPUT_PRODUCT: 'CUSER', //harshita told to pass static value
        INPUT_SUB_PRODUCT: 'CUSER', //harshita told to pass static value
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW', //harshita told to pass static value
        PRODUCT_NAME: 'CUSER', //harshita told to pass static value
        REQUEST_TYPE: 'VALIDATE', //harshita told to pass static value
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.INPUT_REFERENCE_NO, //harshita told to pass dynamic value
              PRODUCT: 'CORESVS', //harshita told to pass static value
              SUB_PRODUCT: 'ACCINT', //harshita told to pass static value
              ACTION: 'ACCSUB', //harshita told to pass static value
              INPUT_HOST_CODE: 'OPNACT', //harshita told to pass static value
              INPUT_VER_NO: params.INPUT_VER_NO, //harshita told to pass dynamic value
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/addAccReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  commonServiceSummary(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'MYNATCRSUMY',
        sortColumn: params.sortColumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        groupBy: '',
        filterList: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/commonServiceSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  approveCommonService(params: any) {
    //Need to pass values dynamically
    const reqData = {
      headerValue: {
        moduleId: 'NATADDFILEAUTH',
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        PARAM1: params.param1,
        PARAM2: params.param2,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNo,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subprcode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.version,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/approveCommonService.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  rejectCommonServices(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'NATADDFILEREJ',
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        REJECT_REASON: 'Rejected by me',
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'CUSER',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: 'VALIDATE',
        param: params.param1,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNo,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProdCode,
              ACTION: params.action,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: params.version,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/rejectCommonService.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ----------------------------------------MADA CARD STARTS From Here ----------------------------------

  getMadaCardSummary(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MYTASKMADCRDSUMY',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortcolumn,
        sortOrder: params.sortDirection,
      },
      dataValue: {
        userNo: '',
        gcif: '',
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterList: [
          {
            filterField: params.filterField,
            filterConstraint: params.filterConstraint,
            filterValue: '',
            fromAmt: '',
            toAmt: '',
            fromDate: params.fromDate,
            toDate: params.toDate,
          },
        ],
        unitId: params.unitId,
        groupBy: '',
        filterFlag: params.filterflag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/MadaCardSummaryDetail.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getMadaCardDetail(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        refNo: params.refNo,
        unitId: params.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaCardMyTaskDetails.json');
      //return this.http.get('assets/simulateAPI/madaCardMyTaskDetailsAllServiceType.json'); // local testing purpose with all service type
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  MadaCardSelfAuthCheck(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        cif: '7000020027',
        productCode: params.productCode,
        subProdCode: params.subProdCode,
        funcCode: params.funcCode,
        amount: '20.00',
        accNo: '100000002762',
        pymntCurrency: '',
        debitCurrency: 'BHD',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madacardFlexiAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  madaCardAuthorize(params: any) {
    let reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE, //
        INPUT_PRODUCT: params.INPUT_PRODUCT, //
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT, //
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: params.INPUT_FUNCTION_CODE,
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.INPUT_PRODUCT,
              SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
              ACTION: params.INPUT_FUNCTION_CODE,
              INPUT_HOST_CODE: 'NWCD',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaCardAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  madaCardReject(params: any) {
    let reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        REJECT_REASON: params.REJECT_REASON,
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE, //
        INPUT_PRODUCT: params.INPUT_PRODUCT, //
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT, //
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: params.INPUT_FUNCTION_CODE,
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.INPUT_PRODUCT,
              SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
              ACTION: params.INPUT_FUNCTION_CODE,
              INPUT_HOST_CODE: 'NWCD',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/madaCardAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  // ----------------------------------------MADA CARD End Here ----------------------------------

  getCreditCardSummary(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'MYTASKCARDSUMY',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRow,
        toRowNo: params.toRow,
        filterMap: [
          {
            filterField: params.filterField,
            filterConstraint: 'contains',
            filterValue: '',
            fromDate: params.fromDate,
            toDate: params.toDate,
          },
        ],
        unitId: params.unitId,
        groupBy: '',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/creditCardSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getServiceTypeBasedDetails(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
        refNo: params.refNo,
      },
      footerValue: {},
    };

    // change file name to get json based on service type
    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/withdrawLimitCreditCardDetails.json'
      );
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
        productCode: params.productCode,
        subProdCode: params.subProductCode,
        funcCode: params.functionCode,
        amount: '',
        accNo: params.accNo,
        pymntCurrency: params.currency,
        debitCurrency: params.currency,
      },
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/creditCardAuthorization.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  authorizeCreditCard(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: params.functionCode,
        INPUT_PRODUCT: params.productCode,
        INPUT_SUB_PRODUCT: params.subProductCode,
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: params.productCode,
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNo,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.functionCode,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: '1',
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/authorizeCreditCard.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  rejectCreditCard(params: any): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: 'N',
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        REJECT_REASON: params.rejectReason,
        INPUT_FUNCTION_CODE: 'VSBLTY',
        INPUT_PRODUCT: params.productCode,
        INPUT_SUB_PRODUCT: params.subProductCode,
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: params.productCode,
        REQUEST_TYPE: 'VALIDATE',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.refNo,
              PRODUCT: params.productCode,
              SUB_PRODUCT: params.subProductCode,
              ACTION: params.functionCode,
              INPUT_HOST_CODE: params.hostCode,
              INPUT_VER_NO: '1',
            },
          ],
        },
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/authorizeCreditCard.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ----------------------------------------PoS FInance STARTS From Here ----------------------------------

  getPosFinanceList(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MYTASKPOSFINSUMY',
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
            CrNumber: params.CrNumber,
            fromAmt: params.fromAmt,
            toAmt: params.toAmt,
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
      return this.http.get('assets/simulateAPI/posFinanceListForMyTask.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPoSFinanceDetail(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'MYTASKPOSFINDET',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        refNo: params.refNo,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceMyTaskDetail.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  posFinanceAuth(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'SELFAUTHCHECK',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        unitId: params.unitId,
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
      return this.http.get('assets/simulateAPI/posFinanceMytaskAuth.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // pos finance authorized api
  posFinanceAuthorized(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSAUTHORIZE',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: 'PFINFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSFIN',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CORESVS',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        REMARKS: '',
        RATE_REFERENCE_NO: '',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: 'CORESVS',
              SUB_PRODUCT: 'POSFIN',
              ACTION: 'CRRNTS',
              INPUT_HOST_CODE: 'STCD',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
        SEL_PARSED_RULE_ID: params.SEL_PARSED_RULE_ID,
        SECOND_AUTH: params.SECOND_AUTH,
        USER_NUMBER_LIST: params.USER_NUMBER_LIST,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceAuthorized.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  //pos finance reject api
  posFinanceReject(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'POSREJECT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '',
        INPUT_USER_NO: '',
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'REJECT_TXN',
        INPUT_FUNCTION_CODE: 'PFINFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSFIN',
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CORESVS',
        REQUEST_TYPE: 'VALIDATE',
        ACTION_TYPE: '',
        PARAM1: '',
        REMARKS: params.REJECT_REASON,
        REJECT_REASON: params.REJECT_REASON,
        RATE_REFERENCE_NO: '',
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: 'CORESVS',
              SUB_PRODUCT: 'POSFIN',
              ACTION: 'CRRNTS',
              INPUT_HOST_CODE: 'STCD',
              INPUT_VER_NO: params.INPUT_VER_NO,
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/posFinanceReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ----------------------------------------PoS FInance END Here ----------------------------------

  // ----------------------------------------ePay STARTES Here ----------------------------------

  getePayMyTaskSummaryList(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: environment.isSimulate,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        userNo: params.userNo,
        gcif: '',
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        filterList: params.filterList,
        unitId: params.unitId,
        groupBy: '',
        filterFlag: params.filterFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(`assets/simulateAPI/${params.moduleId}.json`);
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getePayMyTaskAuthorize(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '10000187',
        INPUT_USER_NO: params.INPUT_USER_NO,
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE,
        INPUT_PRODUCT: params.INPUT_PRODUCT,
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: params.REQUEST_TYPE,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.INPUT_PRODUCT,
              SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
              ACTION: params.ACTION,
              INPUT_HOST_CODE: 'ACCRD',
              INPUT_VER_NO: '1',
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayMyTaskAuthorize.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getePayMyTaskReject(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: environment.isSimulate,
      },
      dataValue: {
        AUTH_FLAG: 'Y',
        INPUT_GCIF: '10000187',
        INPUT_USER_NO: params.INPUT_USER_NO,
        IS_REAUTH_VALIDATED: 'YES',
        INPUT_ACTION: 'AUTH_TXN',
        REJECT_REASON: params.REJECT_REASON,
        INPUT_FUNCTION_CODE: params.INPUT_FUNCTION_CODE,
        INPUT_PRODUCT: params.INPUT_PRODUCT,
        INPUT_SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
        PAGE_CODE_TYPE: 'ACTVY_LIST_VIEW',
        PRODUCT_NAME: 'CUSER',
        REQUEST_TYPE: params.REQUEST_TYPE,
        SELECTED_RECORDS: {
          SELECTED_RECORDS: [
            {
              TXN_REF_NUM: params.TXN_REF_NUM,
              PRODUCT: params.INPUT_PRODUCT,
              SUB_PRODUCT: params.INPUT_SUB_PRODUCT,
              ACTION: params.ACTION,
              INPUT_HOST_CODE: 'ACCRD',
              INPUT_VER_NO: '1',
            },
          ],
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ePayMyTaskReject.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getePayMyTaskDetails(params: any) {
    const reqData = {
      headerValue: {
        moduleId: params.moduleId,
        simulate: environment.isSimulate,
      },
      dataValue: {
        refNo: params.refNo,
        unitId: params.unitId,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(`assets/simulateAPI/${params.moduleId}.json`);
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getAuthorizersList(params: any) {
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
      return this.http.get('assets/simulateAPI/authorizersList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ----------------------------------------ePay ENDS Here ----------------------------------
}
