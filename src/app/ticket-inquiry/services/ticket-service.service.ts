import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TicketServiceService {
  constructor(public http: HttpClient) {}
  getComplaintsList(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'TICKETINQ',
      },
      dataValue: {
        requestType: params.reqType ? params.reqType : '',
        cif: params.cifNo ? params.cifNo : '',
        SRNumber: params.srNo ? params.srNo : '',
        createdFrom: params.createdFrom ? params.createdFrom : '',
        createdTo: params.createdTo ? params.createdTo : '',
        status: params.status ? params.status : '',
        type: params.type ? params.type : '',
        area: params.area ? params.area : '',
        subArea: params.subArea ? params.subArea : '',
        service: params.service ? params.service : '',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ticketInquiryList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  raiseComplaintSubmit(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'RCSUBMIT',
      },
      dataValue: {
        //  "referenceNum": params.refNumber ? params.refNumber : "",
        //  "mobileNo": params.mobNum ? params.mobNum : "",
        //  "transDir": params.direction ? params.direction : "",
        //  "DOB": params.dob ? params.dob : "",
        //  "Amt": params.amount ? params.amount : "",
        //  "transRefNum": params.refnum ? params.refnum : "",
        //  "claimDisc": params.claimdesc ? params.claimdesc : "",
        //  "heldAmt": params.type ? params.type : "",
        //  "rentData": params.area ? params.area : "",
        //  "fileName": params.filename ? params.filename : "",
        //  "complaintType":params.type ? params.type : ""

        AUTH_TYPE_O: '',
        PARAM2: '121',
        PARAM1: '2121',
        SEL_PARSED_RULE_ID: '4980',
        SELECTION_FLAG: 'Y',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: params.functionCode,
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'RSECMPT',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: '',
        INPUT_UNIT_ID: params.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '15/12/2022',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'RCMT',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        MOBILE_NUMBER: params.mobNum ? params.mobNum : '',
        TRANSFER_DIRECTION: params.direction ? params.direction : '',
        TRANSFER_DATE: params.dot ? params.dot : '',
        AMOUNT: params.amount ? params.amount : '',
        TRANSFER_NUMBER: params.refnum ? params.refnum : '',
        CLAIM_DESCRIPTION: params.claimdesc ? params.claimdesc : '',
        HELD_AMOUNT: params.heldamount ? params.heldamount : '',
        RETENSION_DATE: params.retentionDate ? params.retentionDate : '',
        FILE_NAME: params.filename ? params.filename : '',
        COMPLAINT_TYPE: params.type ? params.type : '',
        ACCNO: params.accNo,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/rcSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransferDetails() {
    let reqObj = {
      MODULE_ID: 'RCACCLKPUP',
      simulate: `${environment.isSimulate}`,
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/Payment_DebitLookup.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  getComplaintsSummary(reqObj: any) {
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/complaintsSummary.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPosFinanceTicketInquiryList() {
    let reqData = {};

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/posFinanceTicketInquiryList.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPosFinanceTicketInquirySummaryDetails() {
    let reqData = {};

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/posFinanceTicketInquirySummaryDetails.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getTransferDirections(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'RCDRPDOWN',
      },
      dataValue: {
        action: 'GET_RAISE_COMPT_DP_DWM',
        unitId: params.UNIT_ID,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/transferDirectionData.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCifLookUP(params: any) {
    let payLoad = {
      headerValue: {
        moduleId: 'RCCIFLKP',
        simulate: 'N',
      },
      dataValue: {
        productName: params.productName,
        subProductName: params.subProductName,
        functionCode: params.functionCode,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/rcCifLkup.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payLoad);
    }
  }

  getRaiseComplaintTabs(params: any) {
    let payLoad = {
      headerValue: {
        moduleId: 'RCENTLTABS',
      },
      dataValue: {
        action: 'GET_RAISE_CMPT_TABS',
        unitId: params.UNIT_ID,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/rcEntitleTabs.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payLoad);
    }
  }

  // ecorp general issue
  getAccountList() {
    let reqData = {
      MODULE_ID: 'GENCOMACCLKUP',
      simulate: `${environment.isSimulate}`,
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ecorpAccList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // params are verified by harshita
  submitApi(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'GENERALCOMPLIENTREQUEST',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: params.param2,
        PARAM1: params.param1,
        SEL_PARSED_RULE_ID: '',
        SELECTION_FLAG: '',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'POSMCDFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'POSMCD',
        INPUT_ENTL_VALUE: params.accNo,
        INPUT_CIF_NO: params.COD_CORECIF,
        INPUT_UNIT_ID: params.unitId,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'STCD',
        INPUT_VERSION_NO: '',
        INPUT_SERVICE: 'PAYMNT_FT',
        INPUT_CHANNEL_ID: '3',

        mobileNo: params.mobileNo,
        description: params.description,
        fileDetails: {
          fileName: params.fileName,
          fileExt: params.fileExt,
          fileData: params.fileData,
        },
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/ecorpGeneralIssueSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ecorp general issue ticket inquiry
  getecorpGeneralIssueTicketInquirySummaryDetails() {
    let reqData = {};

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/ecorpGeneralIssueTicketInquiry.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
