import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { PaymentsServiceService } from 'src/app/payments/services/payments-service.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-cheque-book-request',
  templateUrl: './cheque-book-request.component.html',
  styleUrls: ['./cheque-book-request.component.scss']
})
export class ChequeBookRequestComponent implements OnInit {
  displayedColumns: string[] = ['nickName', 'accNumber', 'accStatus', 'balance', 'action'];
  dataSource: any;
  chequeBookInfo: any;
  chequeBookRequest = true;
  rowLength = 0;
  receiptForm = false;
  dataSourceToPass: any = [];
  numberCheque = "";
  numberofChequeBooks = "1";
  collectionOption = "";
  isnumberofchequevalid = true;
  isnumberofbookvalid = true;
  isCollectionBranchValid = true;
  branchLookup: any = [];
  chequeaddressCharge: any;
  chequeaddressCCY: any;
  chequeaddressTax: any;
  accountnumber: any;
  accountName: any;
  currency: any;
  country: any;
  unitId: any;
  isLoadingCompelete = false;
  showChequeBookDetails = false;
  fromAccountDetails: any = [];
  debitAccountDetailsObj: any;
  receiptData: any;
  clearFlag = false;
  searchShownFlag = true;
  secAuthRef: any;
  userOtpValue: any;
  otpError: string = "";
  chequebookPersonalDetails: any = [];
  autherizationDetailsObj: any;
  authListArray: any = [];
  showAuthorization = false;
  showAuthentication = false;
  authError: string = "";
  authType: any
  rootScopeData: RootScopeDeclare = RootScopeData
  portalAccNumber: any;
  fromAccData: any;
  showChequeBookReview: boolean = false;
  chequeBookTyp_en_us: any;
  chequeBookTyp_ar: any;
  chequeBookTypeCode: any;
  isChqBookTypeReadOnly = false;
  isChqBookBranchCodeReadOnly = false;
  pdfData: any;
  

  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  refNo:any
  saveReceiptObject: any;
  rejectMsg: boolean = false;
  constructor(private translateService: TranslateService,private accountService: AccountDetailsService, private router: Router, private paymentService: PaymentsServiceService, private downloadAsPdf:downloadAsPdf ) {
    this.rootScopeData.lhsActiveComp = 'chequeBook';
    // if(this.rootScopeData.dataFromContextMenu) {
    //   alert(this.rootScopeData.dataFromContextMenu.OD_ACC_NO);
    // }
  }

  ngOnInit(): void {
    // this.isLoadingCompelete = true;
    // Context Menu Select Functionality Start // 
    if (this.rootScopeData.dataFromContextMenu) {
      let selectedData: any = [];
      Object.assign(this.rootScopeData.dataFromContextMenu,{"HIDDEN":this.translateService.instant('LBL_HIDDEN')})
      selectedData.push(this.rootScopeData.dataFromContextMenu);
      this.debitAccountDetailsObj = {
        "title": "LBL_FROM",
        "data": selectedData,
        "fieldDetails": [
          {
            "dispKey": "LBL_NICKNAME",
            "dataKey": "ALIAS_NAME"
          },
          {
            "dispKey": "LBL_ACC_NUMBER",
            "dataKey": "OD_ACC_NO"
          },
          {
            "dispKey": "LBL_STATUS",
            "dataKey": "STATUS"
          },
          {
            "dispKey": "LBL_BALANCE",
            "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
            "dataKeySupport": "OD_CCY_CODE"
          }
        ]
      };
      this.showChequeBookDetails = true;
      this.fromAccountDetails[0] = this.rootScopeData.dataFromContextMenu;
      this.fromAccData = this.fromAccountDetails[0];
      this.searchShownFlag = false;

      this.accountnumber = selectedData[0].OD_ACC_NO;
      this.accountName = selectedData[0].OD_ACC_NAME;
      this.currency = selectedData[0].OD_CCY_CODE;
      this.country = selectedData[0].REQ_COUNTRY_DESC;
      this.unitId = selectedData[0].UNIT_ID;
      this.portalAccNumber = selectedData[0].OD_PORTAL_ACC_NO;
      this.getchequeBookPersonlization();
      this.getbooks();
      this.getbranchlookupsummary();
      this.getchequebookcharges();
    }
    else {
      this.getChequeInfo();
    }

  }


  afterFromAccountSelection(fromAccount: any) {
    this.fromAccData = fromAccount;
    if (fromAccount === 'iconClick') {
      if(this.rootScopeData.accountsSummaryObject){
        this.debitAccountDetailsObj ='';
        this.getChequeInfo();
      } 
      this.showChequeBookDetails = false;     
    } else {
      this.showChequeBookDetails = true;
      this.fromAccountDetails[0] = fromAccount;
      this.getchequeBookPersonlization();
      this.getchequebookcharges();
    }
  }
  // new Auuth added
  getAuthType(val: any) {
    this.authType = val
  }

  // triggerSearchFilter(event:any) {
  //   showFilteredRows('chequeRequestInquirytable', event.target.value); 
  // }

  getchequeBookPersonlization() {
    this.isLoadingCompelete = false;
    this.accountService.getcheckbookpersonlization(this.fromAccData).subscribe(
      data => {
        this.isLoadingCompelete = true;
        let chequeBookpersonlDetails: any = [];
        chequeBookpersonlDetails = data;
        this.chequebookPersonalDetails = data;
        this.getbooks();
        this.getbranchlookupsummary();

      }, error => {
        this.isLoadingCompelete = true;
        this.getbooks();
        this.getbranchlookupsummary();
      }
    )
  }

  getChequeInfo() {
    this.isLoadingCompelete = false;
    this.accountService.getChequeBookRequest().subscribe((chequeBookData: any) => {
      if (chequeBookData) {
        this.isLoadingCompelete = true;
        this.chequeBookInfo = chequeBookData.DATA.ALL_RECORDS;
        this.dataSource = this.chequeBookInfo;

        for (let i in this.dataSource) {
          let crntAvail_amount = this.dataSource[i].CURR_AVAIL_BAL_AMOUNT_NEW;
          let convtd_ccy = this.dataSource[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.dataSource[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            this.dataSource[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        // Method-ascending
        // this.dataSource.sort((a:any, b:any) => a.CURR_AVAIL_BAL_AMOUNT_NEW.localeCompare(b.CURR_AVAIL_BAL_AMOUNT_NEW));
        // Method-descending
        // this.dataSource.sort((a:any, b:any) => (a.CURR_AVAIL_BAL_AMOUNT_NEW > b.CURR_AVAIL_BAL_AMOUNT_NEW ? -1 : 1));
        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
          "data": this.chequeBookInfo,
          "fieldDetails": [
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
      }

    }, error => {
      this.isLoadingCompelete = true;
    })
  }

  getbooks() {
    this.isLoadingCompelete = false;
    this.accountService.getcheckbooksize(this.fromAccData).subscribe(
      data => {
        this.isLoadingCompelete = true;
        let chequeBookDetails: any = [];
        chequeBookDetails = data;
        this.dataSourceToPass = this.localdataSource = chequeBookDetails.data[0].chequeBookSize;
        if (this.chequebookPersonalDetails.data) {
          for (let i = 0; i < this.dataSourceToPass.length; i++) {
            if (this.chequebookPersonalDetails.data.chequeBookTypeCode == this.dataSourceToPass[i].CHEQUEBOOKTYPE) {
              this.isChqBookTypeReadOnly = true;
              this.numberCheque = this.dataSourceToPass[i].CHEQUECOUNT;
              this.chequeBookTyp_en_us = this.dataSourceToPass[i].ENGLISHNAME;
              this.chequeBookTyp_ar = this.dataSourceToPass[i].ARABICNAME;
              this.chequeBookTypeCode = this.dataSourceToPass[i].CHEQUEBOOKTYPE;
            }
          }

        }
        else {
          this.numberCheque = this.dataSourceToPass[0].CHEQUECOUNT;
          this.chequeBookTyp_en_us = this.dataSourceToPass[0].ENGLISHNAME;
          this.chequeBookTyp_ar = this.dataSourceToPass[0].ARABICNAME;
          this.chequeBookTypeCode = this.dataSourceToPass[0].CHEQUEBOOKTYPE;
        }

      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  getbranchlookupsummary() {
    this.isLoadingCompelete = false;
    this.accountService.getbranchlookup(this.fromAccData).subscribe(
      data => {
        this.isLoadingCompelete = true;
        let branchdetails = data
        this.branchLookup  = this.localbranchlookup = branchdetails.data;

        if (this.chequebookPersonalDetails.data) {
          for (let i = 0; i < this.branchLookup.length; i++) {
            if (this.chequebookPersonalDetails.data.pickupBranchCode == this.branchLookup[i].branchCode) {
              this.isChqBookBranchCodeReadOnly = true;
              this.collectionOption = this.branchLookup[i].branchDesc;
            }
          }

        }
        else {
          this.collectionOption = this.branchLookup[0].branchDesc;
        }
      },
      error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  getchequebookcharges() {
    this.isLoadingCompelete = false;
    this.accountService.getchequecharges(this.fromAccData).subscribe(
      data => {
        this.isLoadingCompelete = true;
        let chequecharges: any = [];
        chequecharges = data;
        //debugger;
        this.chequeaddressCharge = chequecharges.data[0].chargeInfo[0].charge;
        this.chequeaddressCCY = chequecharges.data[0].chargeInfo[0].ccy;
        this.chequeaddressTax = chequecharges.data[0].chargeInfo[0].tax;

      }, error => {
        this.isLoadingCompelete = true;
      }

    )
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  // servicecheque() {
  //   this.isnumberofchequevalid = this.numberCheque ? true : false;
  // }

  // servicebook() {
  //   this.isnumberofbookvalid = this.numberofChequeBooks ? true : false;
  // }

  // selectedRow(row: any) {
  //   if (this.dataSource.length > 1) {

  //     this.accountnumber = row.OD_ACC_NO;
  //     this.accountName = row.OD_ACC_NAME;
  //     this.currency = row.OD_CCY_CODE;
  //     this.country = row.REQ_COUNTRY_DESC;
  //     this.unitId =row.UNIT_ID;

  //     this.dataSource = [row]
  //     this.rowLength = this.dataSource.length;
  //     this.getbooks();
  //     this.getbranchlookupsummary();
  //     this.getchequebookcharges();
  //   }
  //   else {
  //     this.dataSource = this.chequeBookInfo;
  //     this.rowLength = this.dataSource.length;
  //   }
  // }
  onNumberOfChequeBooksSelect() {
    this.isnumberofbookvalid = this.numberofChequeBooks ? true : false;
  }

  oncollectionBranchSelect() {
    this.isCollectionBranchValid = this.collectionOption ? true : false;
  }
  onNumberOfChequesSelect() {
    if (this.rootScopeData.userInfo.mLanguage === 'en_US') {
      this.isnumberofchequevalid = this.chequeBookTyp_en_us ? true : false;
    } else {
      this.isnumberofchequevalid = this.chequeBookTyp_ar ? true : false;
    }
  }

  selectCurrentChqueBook(selectedChqueBook: any) {
    this.chequeBookTypeCode = selectedChqueBook.CHEQUEBOOKTYPE;
  }
  submit() {
    if (this.showAuthentication) {
      if (this.authType === 'sftToken') {
        if (!this.userOtpValue || this.userOtpValue.length !== 6) {
          this.otpError = "LBL_PLS_ENTER_SFT_TOKEN";
          return;
        }
      } else if (this.authType === 'Token') {
        if (!this.userOtpValue || this.userOtpValue.length !== 4) {
          this.otpError = "LBL_PVN_TOKEN_ERR";
          return;
        }
      } else {
        if (!this.userOtpValue || this.userOtpValue.length !== 4) {
          this.otpError = "LBL_PLS_ENTER_OTP";
          return;
        }
      }
    }

    // for (let i = 0; i < this.dataSourceToPass.length; i++) {
    //   if (this.chequeBookTyp_en_us && this.chequeBookTyp_en_us === this.dataSourceToPass[i].ENGLISHNAME) {
    //     this.chequeBookTypeCode = this.dataSourceToPass[i].CHEQUEBOOKTYPE;
    //   }
    //   if (this.chequeBookTyp_ar && this.chequeBookTyp_ar === this.dataSourceToPass[i].ARABICNAME) {
    //     this.chequeBookTypeCode = this.dataSourceToPass[i].CHEQUEBOOKTYPE;
    //   }
    // }

    let vaccno = this.fromAccountDetails[0].OD_ACC_NO;
    let vcurrency = this.fromAccountDetails[0].OD_CCY_CODE;
    let vcountry = this.fromAccountDetails[0].REQ_COUNTRY_CODE;
    let vchecksize = this.numberCheque;
    let vnumofbooks = this.numberofChequeBooks;
    let vbymailsend = ""; //TBD
    let vholderid = ""; //TBD
    let vholdername = ""; //TBD
    let vmodeofdelivery = "Collect From branch"; //TBD
    let vbranchselection = this.collectionOption;
    this.isLoadingCompelete = false;
    let vsecAuthCode = this.secAuthRef;
    let vOtpValue = this.userOtpValue;
    let chequeBookTypeCode = this.chequeBookTypeCode;
    let AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    let params = { vaccno, vchecksize, vnumofbooks, vmodeofdelivery, vbymailsend, vbranchselection, vholderid, vholdername, vcurrency, vcountry, vsecAuthCode, vOtpValue, chequeBookTypeCode, AUTH_TYPE_O };
    this.accountService.getsubmitsuccess(params).subscribe(
      data => {
        let vdata: any;
        vdata = data;
        this.isLoadingCompelete = true;
        if (vdata.dataValue.OD_STATUS_DESC === "Success") {
          this.chequeBookRequest = false;
          this.rootScopeData.dataFromContextMenu = '';
          this.refNo=vdata.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(vdata.dataValue.INPUT_REFERENCE_NO,vdata.dataValue);
          this.receiptForm = true;
        } if (vdata.dataValue.OD_STATUS_DESC === "Failed") {
          this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
        }
      },
      error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  cancelClick() {
    this.numberCheque = '';
    this.numberofChequeBooks = '1';
    this.chequeBookTyp_ar = '';
    this.chequeBookTyp_en_us = '';
    this.collectionOption = '';
    this.accountnumber = '';
    this.currency = '';
    this.country = '';
    this.dataSource = this.chequeBookInfo;
    //  this.rowLength = this.dataSource.length;
    this.clearFlag = true;
    this.rootScopeData.dataFromContextMenu = '';
    this.receiptForm = false;
    this.chequeBookRequest = true;
    this.showChequeBookDetails = false;
    this.showChequeBookReview = false;
    this.rootScopeData.changeHeading = " ";
    this.userOtpValue = "";

  }

  clearData() {
    this.chequeBookTyp_ar = '';
    this.chequeBookTyp_en_us = '';
    this.numberCheque = '';
    this.numberofChequeBooks = '';
    this.collectionOption = '';
    this.accountnumber = '';
    this.currency = '';
    this.country = '';
    this.debitAccountDetailsObj ='';
    this.getChequeInfo();
    this.showChequeBookDetails = false;
  }

  // finish() {
  //   this.chequeBookRequest = true;
  //   this.receiptForm = false;
  //   this.clear();
  // }

  // initGenerateStatement() {
  //   this.receiptForm = false;
  //   this.chequeBookRequest = true;
  //   this.showChequeBookDetails = false;
  // }

  constructReceiptData(refNumber: any,data:any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0], { USER_ID: userId })
    let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": approver
        },
        {
          "dispKey": "LBL_NOTES_NEXT_APROVER",
          "dataKey": approverNote
        }
      ]
    }
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_CHQ_REQ_SUCCESS"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_CHEQUE_BOOK_UNSUCCESS"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg=true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_CHQ_REQ_SUCCESS"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(data.TXN_STATUS=== "RN"){
      message1 = "LBL_CHEQUE_BOOK_UNSUCCESS";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_CHQ_REQ_SUCCESS";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_CHQ_REQ_SUCCESS"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }
    this.receiptData = {
      "msg1": message1,
      // "msg2": "LBL_CHEQUE_APPROVAL_REQUEST",
      "msg2": message2,
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": "USER_ID"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            }
          ]
        },
        {
          "title": "LBL_CHEQUE_BOOK_DETAILS",
          "isTable": "false",
          "data": "this.dataSource",
          "fieldDetails": [
            {
              "dispKey": "LBL_CHEQUE_BOOK_TYPE",
              "dataKey": this.rootScopeData.userInfo.mLanguage === 'en_US' ? this.chequeBookTyp_en_us : this.chequeBookTyp_ar,
            },
            {
              "dispKey": "LBL_NO_OF_BOOKS",
              "dataKey": this.numberofChequeBooks
            },
            {
              "dispKey": "LBL_COLLECTION_BRANCH",
              "dataKey": this.collectionOption
            }
          ]
        }
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "initiateButton": {
        "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };

    if(approver && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant(message1),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : "--"
        },
        {
          "subHead": "Cheque Book Details",
          "subValue": ""
        },
        {
          "subHead": "Cheque Book Type",
          "subValue": this.rootScopeData.userInfo.mLanguage === 'en_US' ? this.chequeBookTyp_en_us : this.chequeBookTyp_ar
        },
        {
          "subHead": "Number of books",
          "subValue": this.numberofChequeBooks ? this.numberofChequeBooks : "--"
        },
        {
          "subHead": "Collection Branch",
          "subValue": this.collectionOption ? this.collectionOption : "--"
        },
      ],
      "pagecall":"chequebookrequest",
      "refNo":refNumber
    }
  }

  initiateAnotherRequest() {
    this.cancelClick();
    this.numberofChequeBooks = "1";
  }

  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      debitCurrencyCode: "",
      beneCurrencyCode: "", //?????
      subProduct: ""
    }
    reqObj.paymentAmount = this.chequeaddressCharge ? this.chequeaddressCharge : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    reqObj.beneCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    reqObj.subProduct = "CHEQUES";

    this.paymentService.selfAuthCheck(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        if (response.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authListArray = response.data.authList;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    }

    )
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = "";
      this.otpError = "LBL_PLS_ENTER_OTP";

    }
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  proceed() {
    this.initReqParam.accNo=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    this.initReqParam.amt=this.chequeaddressCharge ? this.chequeaddressCharge : "0";
    this.initReqParam.pdroductCode="PAYMNT";
    this.initReqParam.subPrdCode="CHEQUES";
    this.initReqParam.cif=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    this.initReqParam.unitId=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";

    if (this.chequebookPersonalDetails.data && (this.chequebookPersonalDetails.data.res_ErrorCode === '00000' || this.chequebookPersonalDetails.data.res_ErrorCode === '0')) {
      if (this.rootScopeData.userInfo.mLanguage === 'en_US') {
        this.isnumberofchequevalid = this.chequeBookTyp_en_us ? true : false;
      } else {
        this.isnumberofchequevalid = this.chequeBookTyp_ar ? true : false;
      }
      this.isCollectionBranchValid = this.collectionOption ? true : false;
      this.isnumberofbookvalid = this.numberofChequeBooks ? true : false;
      if (this.isnumberofchequevalid && this.isnumberofbookvalid && this.collectionOption) {
        this.showChequeBookDetails = false;
        this.rootScopeData.changeHeading = "Review";
        this.showChequeBookReview = true;
        this.checkSecfactorAuth();
      }
    }
    else {
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_CHEQUE_BOOK_CANT_INITIATE";
      return;
    }
  }
  cancel() {
    this.cancelClick();
    this.ngOnInit();
  }

  // downloadPdf()
  // {      
/* 
      let PDF = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = PDF.internal.pageSize.getWidth();
      let img = new Image()
      img.src = "assets/images/snb-logo-print.png";
      PDF.addImage(img, 'png', 90, 3, 30, 20);

      PDF.setFontSize(11);
      PDF.setFont("helvetica", "bold");
      PDF.text("ChequeBook Request Receipt", 70, 35);

      PDF.rect(10, 38, 190, 160);
      PDF.rect(15, 60, 180, 130);

      PDF.setFontSize(10);
      PDF.setFont("helvetica", "bold");

      PDF.setDrawColor(128);
      PDF.setFillColor(128, 128, 128);
      PDF.rect(15, 51, 90, 6, "F");

      PDF.setFontSize(10);
      PDF.setTextColor(255,255,255);
      PDF.setFont("helvetica", "bold");
      PDF.text("Transaction Details", (pdfWidth/2 - 85), 55);
      if(true){  
        PDF.setFontSize(9);
        PDF.setTextColor(0,0,0);
        PDF.setFont("helvetica", "normal");
        PDF.text('Action by', (pdfWidth/2 - 85), 65,);
        PDF.text('Account Number', (pdfWidth/2 - 85), 75);
        PDF.text('Nickname', (pdfWidth/2 - 85), 85);
        PDF.text('Cheque Book Type', (pdfWidth/2 - 85), 95);
        PDF.text('Number of book(s)', (pdfWidth/2 - 85), 105);
        PDF.text('Collection Branch', (pdfWidth/2 - 85), 115);
      }
      PDF.text(this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '', (pdfWidth/2 - 33), 115);
      PDF.text(this.fromAccData.OD_ACC_NO ? this.fromAccData.OD_ACC_NO : '', (pdfWidth/2 - 33), 65);
      PDF.text(this.fromAccData.ALIAS_NAME ? this.fromAccData.ALIAS_NAME : '', (pdfWidth/2 - 33), 75);
      PDF.text(this.chequeBookTyp_en_us? this.chequeBookTyp_en_us : '', (pdfWidth/2 - 33), 85, { maxWidth: 110 });
      PDF.text(this.numberofChequeBooks ? this.numberofChequeBooks : '', (pdfWidth/2 - 33), 95);
      PDF.text(this.collectionOption ? this.collectionOption : '', (pdfWidth/2 - 33), 105);

      PDF.setFontSize(6);
      PDF.setTextColor(63, 153, 124);
      PDF.text("The Saudi National Bank | A Saudi Joint Stock Company | Paid-up Capital SAR 44,780,000,000 | VAT Number 300002471110003 | C.R. 4030001588", 30,220);
      PDF.text("Under the supervision and control of The Saudi Central Bank | Licensed pursuant to Royal Decree No. 3737 issued on 20/4/1373H (corresponding to 26/12/1953G",23,227)
      PDF.text("Head Office The Saudi National Bank Tower King Abdullah Financial District | King Fahd Road | 3208 - Al Aqeeq District | Unit No. 778 | Riyadh 13519 – 6676 | 920001000 | www.alahli.com | Any reference ",10,234)
      PDF.text("to the National Commercial Bank, NCB or the Bank shall mean the Saudi National Bank",60,237)
      PDF.save('ChequeBookRequest.pdf');
 */
      downloadPdf(values:any)
      { 
        let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_CHEQUEBOOK_REQUEST_RECEIPT'), x:80, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_INQUIRY_ACCOUNT_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_DETAILS'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_TYPE'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_NO_OF_BOOKS'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_COLLECTION_BRANCH'), y:135},
        { type: 'text', value:this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '', y:75},
        { type: 'text', value:this.fromAccData.OD_ACC_NO ? this.fromAccData.OD_ACC_NO : '', y:85},
        { type: 'text', value:this.fromAccData.ALIAS_NAME ? this.fromAccData.ALIAS_NAME : '', y:95},
        { type: 'text', value:this.chequeBookTyp_en_us? this.chequeBookTyp_en_us : '', y:115},
        { type: 'text', value:this.numberofChequeBooks ? this.numberofChequeBooks : '', y:125},
        { type: 'text', value:this.collectionOption ? this.collectionOption : '', y:135},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
        { type: 'text', value:this.refNo ? this.refNo : '', y:145},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_APPROVAL_REQUEST_IS_INT_SUCCESS'), y:155},
        
      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'chequeBookRequest.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'chequeBookRequest.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
     
  
  }

  localdataSource : any =[];
  searchEnglishType(event : any) {
    const searchValue: string = event?.target?.value;
    this.dataSourceToPass = this.localdataSource;
    this.dataSourceToPass = this.dataSourceToPass.filter((res: any) =>
      (res?.ENGLISHNAME as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }

  EnglishInput(event :any){
    const blurredValue: string = event?.target?.value;
    const accFound = this.dataSourceToPass.filter((res: any) =>
      (res?.ENGLISHNAME as string)?.toLowerCase() === blurredValue?.toLowerCase());
    if (accFound?.length > 0) {
      this.chequeBookTyp_en_us = accFound[0].ENGLISHNAME;
      if (this.rootScopeData.userInfo.mLanguage === 'en_US') {
        this.isnumberofchequevalid = this.chequeBookTyp_en_us ? true : false;
      } else {
        this.isnumberofchequevalid = this.chequeBookTyp_ar ? true : false;
      }
      // this.setCurrency();
    } else {
      this.chequeBookTyp_en_us = "";
      // this.setCurrency();
    }
    // this.onNumberOfChequesSelect();
  }

  searchArabicType(event : any){
    const searchValue: string = event?.target?.value;
    this.dataSourceToPass = this.localdataSource;
    this.dataSourceToPass = this.dataSourceToPass.filter((res: any) =>
      (res?.ARABICNAME as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }

  arabicInput(event :any){
    const blurredValue: string = event?.target?.value;
    const accFound = this.dataSourceToPass.filter((res: any) =>
      (res?.ARABICNAME as string)?.toLowerCase() === blurredValue?.toLowerCase());
    if (accFound?.length > 0) {
      this.chequeBookTyp_en_us = accFound[0].ARABICNAME;
      if (this.rootScopeData.userInfo.mLanguage === 'en_US') {
        this.isnumberofchequevalid = this.chequeBookTyp_en_us ? true : false;
      } else {
        this.isnumberofchequevalid = this.chequeBookTyp_ar ? true : false;
      }
      // this.setCurrency();
    } else {
      this.chequeBookTyp_en_us = "";
      // this.setCurrency();
    }
    // this.onNumberOfChequesSelect();
  }


  localbranchlookup : any =[];
  searchCollectionOption(event : any){
    const searchValue: string = event?.target?.value;
    this.branchLookup = this.localbranchlookup;
    this.branchLookup = this.branchLookup.filter((res: any) =>
      (res?.branchDesc as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }
  collectionOptionInput(event :any){
    const blurredValue: string = event?.target?.value;
    const accFound = this.branchLookup.filter((res: any) =>
      (res?.branchDesc as string)?.toLowerCase() === blurredValue?.toLowerCase());
    if (accFound?.length > 0) {
      this.collectionOption = accFound[0].branchDesc;
      this.isCollectionBranchValid = this.collectionOption ? true : false;
      // this.setCurrency();
    } else {
      this.collectionOption = "";
      // this.setCurrency();
    }
  }



}
