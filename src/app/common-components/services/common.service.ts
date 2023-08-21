import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private reqData: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private http: HttpClient, private readonly translateService: TranslateService) { }

  callRestControllerServlet() {
    // return this.http.get('http://localhost:4200/assets/simulateAPI/RestControllerServlet.json');
    // return this.http.get(`${environment.CXO_WORKSPACE_URL}`);

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/RestControllerServlet.json');
    } else {
      return this.http.get(`${environment.CXO_WORKSPACE_URL}`);
    }
  }
  logOutApiCall() {
    //return this.http.get('')
    let reqData = {
      "transactionCode": "logout",
      "__PIGGYBACKREQUEST": "Y"
    }

    if (environment.localURL) {
      return this.http.post(`${environment.logoutAPIPath}`, reqData);
    } else {
      return this.http.post(`${environment.logoutAPIPath}`, reqData);
    }

    // return this.http.post(`${environment.logoutAPIPath}`,reqData);
    // return this.http.get(`${environment.logoutAPIPath}` + '?transactionCode=logout&__PIGGYBACKREQUEST=Y');
  }

  exportDocumentPost(params: any) {
    // return this.http.get(url, { observe: 'response' });

    let reqData = {
      "headerValue": {
        "moduleId": params.moduleId,
        "exportType": params.exportType,
        "export": "Y",
        "simulate": "N",
        "REQ_ACCOUNT_NUMBER": params.REQ_ACCOUNT_NUMBER,
        "SELECTED_RANGE": params.SELECTED_RANGE,
        "FILTER_DATE_VALUE_DATE": params.FILTER_DATE_VALUE_DATE,
        "FILTER_DATE_VALUE_DATE2": params.FILTER_DATE_VALUE_DATE2,
        "res_Flag" : params.res_flag

      },
      "dataValue": {

      },
      "footerValue": {}
    }
    return this.http.post(`${environment.restAPI}`, reqData);
  
  }

  exportDocumentGet(params: any) {
    // return this.http.get(url, { observe: 'response' });
    
    return this.http.get(`${environment.restDownloadAPI}?moduleId=${params.moduleId}&fileToRename=${params.fileToRename}&originalFileName=${params.originalFileName}&attachmentRefNumber=${params.attachmentRefNumber}`);    
  
  }

  exportDocument(url: any) {
    return this.http.get(url, { observe: 'response' });

  }

  downloadDocument(params: any) {
    // return this.http.post(url, { observe: 'response' });
    let reqData = {
      "headerValue": {
        "moduleId": params.moduleId,
        "simulate": "N",
        "export": "Y",
        "exportType": params.exportType
      },
      "dataValue": {
        "refNo": params.refNo ? params.refNo : undefined,
        "subPdt":params.beneSubprod ? params.beneSubprod : undefined,
        "productName": params.productName ? params.productName : undefined,
        "functionCode": params.functionCode ? params.functionCode :undefined,
        "pageCall": params.pageName ? params.pageName :undefined,
        "fromRowNo": params.fromRow ? params.fromRow : undefined,
        "toRowNo": params.toRow ? params.toRow : undefined,
        //keys for aramcoInquiry
        "aramcoId": params.aramcoId,
        "invoiceNumber": params.invoiceNumber,
        "currency": params.currency,
        "fromDate": params.fromDate,
        "toDate": params.toDate,
        "status": params.status,
        "amountFrom": params.amountFrom,
        "amountTo": params.amountTo
      },
      "footerValue": {}
    }
    
    return this.http.post(`${environment.restAPI}`, reqData);
    // return this.http.get('assets/simulateAPI/sampleBase64.json');

  }
  viewEStmtDownloadDocument(params: any) {
    // return this.http.post(url, { observe: 'response' });
    let reqData = {
      "headerValue": {
        "moduleId": params.moduleId,
        "export": "Y",
        "simulate": "N",
        "exportType": params.exportType,
        "statement": params.statement,
        "statementDate": params.statementDate,
        "accountNum": params.accountNum,
        "refNo": params.refNo
      },
      "dataValue": {

      },
      "footerValue": {}
    }
    return this.http.post(`${environment.restAPI}`, reqData);
  }
  downloadDocumentPost(params: any) {
    // return this.http.post(url, { observe: 'response' });
    let reqData = {
      "headerValue": {
        "moduleId": params.moduleId,
        "exportFormat": "PDF",
        "reqId": params.reqId,
        "filePath": params.filePath,
        "simulate": "N",
        "statementPeriod": params.statementPeriod
      },
      "dataValue": {

      },
      "footerValue": {}
    }
    return this.http.post(`${environment.restDownloadAPI}`, reqData);
  }

  chequeBookDetailsApiCall(refNum: any) {
    this.reqData = {
      "headerValue": {
        "moduleId": "CHEQUESDETAIL",
        "simulate": `N`
      },
      "dataValue": {
        "cif": "3114",
        "pdt": "CORESVS",
        "subPdt": "CHEQUES",
        "function": "CHQREQ",
        "refNo": refNum,
        "attachDocRefNo": "",
        "inputMode": "VIEW",
        "ignoreMasking": ""
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/chequeBookDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    //return this.http.get('http://localhost:4200/assets/simulateAPI/chequeBookDetails.json', this.reqData);
    // return this.http.get('http://localhost:4200/assets/simulateAPI/error_500.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData)
  }

  getHistoryDetails(data: any) {
    let historydata = {
      "headerValue": {
        "moduleId": "GETHISTORY",
        "simulate": `N`
      },

      "dataValue": {
        "txnRefNo": data.refNum,
        "productCode": data.productCode,
        "subProductCode": data.subProductCode,
        "functionCode": data.functionCode,
        "gcif": "",
        "unit_ID": "",
        "language_ID": "en_US"
      }

    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/history.json');
    } else {
      return this.http.post(`${environment.restAPI}`, historydata)
    }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/history.json');
    // return this.http.post(`${environment.restAPI}`,historydata);
  }

  getWorkFlowDetails(data: any) {
    let workFlowdata = {
      "headerValue": {
        "moduleId": "GETWRKFLW",
        "simulate": `N`
      },

      "dataValue": {
        "txnRefNo": data.refNum,
        "productCode": data.productCode,
        "subProductCode": data.subProductCode,
        "functionCode": data.functionCode,
        "gcif": "",
        "unit_ID": "",
        "language_ID": "en_US"
      }
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/workFlow.json');
    } else {
      return this.http.post(`${environment.restAPI}`, workFlowdata)
    }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/workFlow.json');
    // return this.http.post(`${environment.restAPI}`,workFlowdata);
  }

  secondFactorAuthApiCall(params: any) {
    this.reqData =
    {
      "headerValue": {
        "moduleId": "SECFACINIT",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "action": params.type,
        "pdt": params.pdroductCode,
        "subPdt": params.subPrdCode,
        "amount": params.amt,
        "accNo": params.accNo,
        "unitId": params.unitId,
        "cif": params.cif,
        "ccy": params.ccy
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/secFactInit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    // return this.http.post(`${environment.restAPI}`, this.reqData);
    //return this.http.get('http://localhost:4200/assets/simulateAPI/secFactAuth.json', this.reqData);
  }


  logOutSecFacAuthCheck(otpvalue: any, secAuthRef: any) {
    this.reqData =
    {
      "headerValue": {
        "moduleId": "OTPVALIDATION",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "AuthType": "O",
        "PARAM1": otpvalue,
        "PARAM2": secAuthRef,
        "languageId": ""
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/otpResponse.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    // return this.http.post(`${environment.restAPI}`, this.reqData);
    // return this.http.get('http://localhost:4200/assets/simulateAPI/otpResponse.json', this.reqData);
  }

  generateIVRCall(params: any) {
    this.reqData =
    {
      "headerValue": {
        "moduleId": "GENERATEIVR",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "req_UnitID": params.unitId,
        "cif": params.cif,
        "mobile": params.mobileNo,
        "language": "1",
        "parameter1": params.loginId,
        "PageCall":params.PageCall
      },
      "footerValue": {
        "channelId":params.ChannelId
      }
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/generateIVR.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    // return this.http.post(`${environment.restAPI}`, this.reqData);
    //return this.http.get('http://localhost:4200/assets/simulateAPI/generateIVR.json', this.reqData);
  }

  inquireIVRCallBack(uniqueId: any, unitId: any, ChannelId:any,params:any) {
    this.reqData =
    {
      "headerValue": {
        "moduleId": "INQUIREIVRCALLBACK",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "req_UnitID": unitId,
        "uniqueId": uniqueId,
        "PageCall":params.PageCall
      },
      "footerValue": {
        "channelId": ChannelId
      }
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/inquireIVR.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    // return this.http.post(`${environment.restAPI}`, this.reqData);
    //return this.http.get('http://localhost:4200/assets/simulateAPI/inquireIVR.json', this.reqData);
  }

  beneActivation(params: any) {
    this.reqData = {
      "headerValue": {
        "moduleId": "BENEACTIVATION"
      },
      "dataValue": params,
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/beneActivation.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }
    // return this.http.post(`${environment.restAPI}`, this.reqData);
    //return this.http.get('http://localhost:4200/assets/simulateAPI/beneActivation.json', this.reqData);
  }

  generateMtStatement(mttype: any, params: any) {
    var mtype = mttype;
    var mid = "GENERATE" + '' + mtype;
    this.reqData = {
      "headerValue": {
        "moduleId": mid,
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "mtType": mtype,
        "unitId": params.unitId,
        "accNo": params.accNumber,
        "cif": params.cifNum,
        "fromDate": params.fromDate,
        "toDate": params.toDate
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/generatemt940.json');
    } else {
      return this.http.post(`${environment.restAPI}`, this.reqData)
    }

    //return this.http.get('http://localhost:4200/assets/simulateAPI/generatemt940.json');
    // return this.http.post(`${environment.restAPI}`, this.reqData)

  }

  downloadPdf(elementId: string, pdfName: string): void {
    let receiptCntr: any = document.getElementById(elementId);

    let receiptCntrHeight: any = receiptCntr?.clientHeight;
    let receiptCntrWidth: any = receiptCntr?.clientWidth;
    const options = {
      background: 'white',
      width: receiptCntrWidth,
      height: receiptCntrHeight,
    };

    domtoimage.toPng(receiptCntr, options).then((imgData: any) => {
      const doc = new jsPDF(
        receiptCntrWidth > receiptCntrHeight ? 'l' : 'p',
        'mm',
        [receiptCntrWidth, receiptCntrHeight + 150]
      );
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let img = new Image();
      img.src = 'assets/images/snb-logo-print.png';
      doc.addImage(img, 'png', pdfWidth / 2 - 50, 0, 100, 100);
      doc.addImage(imgData, 'PNG', 0, 100, pdfWidth, pdfHeight);
      doc.setFontSize(40);
      let footer = this.translateService.instant('LBL_PRINT_FOOTER_CONTENT_1');
      doc.text(footer, 400, receiptCntrHeight + 120);
      doc.save(`${pdfName}.pdf`);
    });
  }

  generateTradeTicket(params: any) {

    let requestData = {
      "headerValue": {
        "moduleId": "TRADETKT",
      },
      "dataValue": {
        "killFlag": params.killFlag,
        "loginId": params.loginId,
        "gcif": params.Gcif
      }
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/tradeSSO.json');
    } else {
      return this.http.post(`${environment.restAPI}`, requestData)
    }

    // return this.http.get('http://localhost:4200/assets/simulateAPI/tradeSSO.json');
    // return this.http.post(`${environment.restAPI}`, requestData);
  }

  sadadDetailsAPICall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADDETAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "txnRefNo": refNum,
        "unitId": "",
        "languageId": ""
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }

    //return this.http.get('http://localhost:4200/assets/simulateAPI/sadadDetails.json');
    //  return this.http.post(`${environment.restAPI}`, reqData);
  }

  sadadBillerdetailsDetailsApiCall(refNum: any, nickName: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADBILLERDETAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "txnRefNo": refNum,
        "unitId": "",
        "nickName": nickName
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadBillerDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }

    //return this.http.get('http://localhost:4200/assets/simulateAPI/sadadBillerDetails.json');    
    // return this.http.post(`${environment.restAPI}`, reqData)
  }

  sadadMOIDetailsAPICall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADMOIDETAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "refNo": refNum,
        "unitId": ""
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMOIDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/sadadMOIDetails.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  aramcoDetailsAPICall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "ARMCOPAYDET",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "txnRefNo": refNum,
        "unitId": ""
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/aramcoTransactionInquiryDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
    //return this.http.get('http://localhost:4200/assets/simulateAPI/aramcoTransactionInquiryDetails.json');
    // return this.http.post(`${environment.restAPI}`, reqData);
  }

  sadadMOIRefundReqDetailsAPICall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "SADADMOIREFDETAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "refNo": refNum,
        "unitId": ""
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadMoiRefundRequestDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  esalDetailsAPICall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "ESALPAYDETAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "txnRefNo": refNum,
        "unitId": ""
      },
      "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/esalPaymentDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  // Start - For file-upload component
  fileUpload(formdata: any): Observable<any> {
    let reqData = formdata;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileUploadResponse.json')
    } else {
      return this.http.post(`${environment.fileUploadApi}`, reqData);
    }
  }
  selfAuthCheck(reqObj: any){
    let reqData = {
      "headerValue": {
        "moduleId": "SELFAUTHCHECK"
      },
      "dataValue": {
        //"userNo": "",
        //"gcif": "",
        "unitId": reqObj.debitUnitId,
        "cif": reqObj.debitCifNo,
        "productCode": reqObj.productCode,
        "subProdCode": reqObj.subProduct,
        "funcCode": reqObj.functionCode,
        "amount": reqObj.paymentAmount,
        "accNo": reqObj.debitPortalAccNo,
        "pymntCurrency": reqObj.paymentCurrency,
        "debitCurrency":reqObj.debitCurrencyCode
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/secFactAuth.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
  }
  deleteFile(requestObj: any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "DELETEFILE"
      },
      "dataValue": {
        "originalFileName": requestObj?.originalFileName,
        "fileToRename": requestObj?.fileToRename,
        "lChecksum": requestObj?.lChecksum,
        "attachmentRefNumber": requestObj?.attachmentRefNumber
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/deleteFile.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }
  // End - For file-upload component


  generateMT940(params: any,mtype:any) {

    let requestData = {
      headerValue: {
        moduleId: "EXPORTFILE",
        simulate: `${environment.isSimulate}`
      },
      dataValue: {
        RequestType: mtype,
        RequestFormat: "",
        AccountNo: params.accNumber,
        fromDate: params.fromDate,
        toDate: params.toDate,
        ProductCode: "",
        SubProductCode: "",
        accountId: params.accNumber,
        journalId: "",
        valueDate: "",
        FunctionCode: "",
        ChannelId: "DESKTOP",
        SELECTED_RANGE: params.selectRange,
        FILTER_DATE_VALUE_DATE: params.fromDate,
        FILTER_DATE_VALUE_DATE2: params.toDate
      },
      footerValue: {
        channelId: "DESKTOP"
      }
    }

    if (environment.localURL) {
      return this.http.post(`${environment.restAPI}`, requestData);
    } else {
      return this.http.post(`${environment.restAPI}`, requestData)
    }

    // return this.http.get('assets/simulateAPI/tradeSSO.json');
    // return this.http.post(`${environment.restAPI}`, requestData);
  }

  downloadTemplate(params: any,moduleId:any) {

    let requestData = {
      headerValue: {
        moduleId: moduleId,
        simulate: `${environment.isSimulate}`
      },
      dataValue: params,
      footerValue: {
        
      }
    }
    //console.log(requestData)
    if (environment.localURL) {
      return this.http.post(`${environment.restAPI}`, requestData);
    } else {
      return this.http.post(`${environment.restAPI}`, requestData)
    }

    // return this.http.get('assets/simulateAPI/tradeSSO.json');
    // return this.http.post(`${environment.restAPI}`, requestData);
  }

  deleteDuplicateFileRecord(reqObj:any){
    let reqData ={
      headerValue: {
      "moduleId": "FILERECDELETE", 
      "simulate": "",
      },
      dataValue: {
      "userNo": "", //pass it as empty string
      "odGcif": "", //pass it as empty string
      "accountNumber": reqObj.accNo,   //fromAccountId
      "sequenceNumber": reqObj.row, //fileSeqNo
      "date": reqObj.valueDate, //valueDate
      "totalValue": reqObj.amount, //totalAmount
      "cancelReason":""  //pass it as empty string
      },
      footerValue: {}
      }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fileRecordDelete.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
  }

  getDuplicateRecordsDetails(data:any){
    let reqData = {
      headerValue: {
        moduleId: 'DUPTXNS',
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
        functionCode: data.func,
        refNo: data.refNo,
        pageCall: 'Inquiry',
        fileType : data.filetype,
        seqNo : data.seqNo,
        fromAccountId : data.accNo
      },
      footerValue: {},
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/dupilcateDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  
  }


  getTransactionTypeAPICall() {
    let reqData = {
      "headerValue": {
        "moduleId": "GETTRANSACTIONTYPE",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "languageId": this.rootScopeData.userInfo.mLanguage
      },
      "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/transactionType.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData)
    }
    
  }

  saveReceiptScreenAPI(params:any) {
   let currentDate = new Date().toLocaleString();

    let reqData = {
      "headerValue": {
        "moduleId": 'SAVERECEIPT',
        "exportFlag": 'Y'
      },
      "dataValue": {
        "pageheading": params.pageheading,
        "subHeading": params.subHeading,
        "Description": params.Description,
        "keyvalues": params.keyValues,
        "pageCall":params.Pagecall,
        'referenceNo': params.refNo,
        "languageId": this.rootScopeData.userInfo.mLanguage,
        "addDynamicHead": params.addDynamicHead,
        "addDynamicValue": params.addDynamicValue,
        "date":currentDate,
        "arrayList":params.arrayList
      },
      "footerValue": {}
    }
   
      return this.http.post(`${environment.restAPI}`, reqData)
    
  }
}
