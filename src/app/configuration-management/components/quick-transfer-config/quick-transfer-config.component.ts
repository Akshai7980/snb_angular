import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { ConfigurationManagementService } from '../../services/configuration-management.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-quick-transfer-config',
  templateUrl: './quick-transfer-config.component.html',
  styleUrls: ['./quick-transfer-config.component.scss'],
})
export class QuickTransferConfigComponent implements OnInit, OnDestroy {
  debitDataObj: any;
  selectedDebitObj: any;
  isLoadingCompelete = false;
  isProceed = false;
  selectedQuickTransferTo: any;
  resetRemain = false;
  amountDetailsObj: any;
  amount = 0;
  pmtType: any;
  amountToPass = '';
  authDataObj: any;
  total = '';
  receiptData: any;
  fieldSet: any;
  hideAll = false;
  hideAddtional = false;
  errorCode: any;
  otpError: string = '';
  userOtpValue: any;
  // addtionalData = { date: null, paymentDetails: '', customerRef: '' }
  secAuthRef: any;
  authOptions: any;
  toggleHide: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;

  isModify: boolean = false;
  selectedModifyProxy: any = '';
  modifyDebitObject: any;
  showAuthorization = false;
  showAuthentication = false;
  proxyModifyData: any;
  deregister: boolean = false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  viewRegistrationData: any;
  checkFlexiAuth: boolean = false;
  authType: any;
  refNo: any;
  pdfData:any;
  isDeRegistration: boolean = false;
  proxyDataForSaveReceipt: any;
  saveReceiptObject:any;
  rejectMsg: boolean = false;
  constructor(
    private translateService: TranslateService,
    private configManagement: ConfigurationManagementService,
    private readonly router: Router, 
    private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.isIpsRegistration) {
      this.getDebitData();
    } else {
      this.isModify = true;
      this.getDataForModify();
    }
  }
  initQuickTransferConfig() {
    if(this.isModify){
      this.modifyRecordSelected('iconClick');
    } else {
      this.reset();
    }
  }
  getDatas(val: any, field: any) {
    switch (field) {
      case 'debitTo':
        if (val === 'iconClick') {
          this.reset();
        } else {
          this.selectedDebitObj = val;
        this.initReqParam.accNo=this.selectedDebitObj.OD_ACC_NO;
        this.initReqParam.amt="0";
        this.initReqParam.pdroductCode="PAYMNT";
        this.initReqParam.subPrdCode='IPSREG';
        this.initReqParam.cif=this.selectedDebitObj.COD_CORECIF;
        this.initReqParam.unitId=this.selectedDebitObj.UNIT_ID;
        
        }
        break;
      case 'proxyIdentifier':
        this.selectedQuickTransferTo = val;
        this.resetRemain = false;
        this.isProceed = true;
        this.getAuthApproverDetails();
        break;
      case 'paymentType':
        this.pmtType = val;
        break;
      case 'reset':
        this.resetRemain = val;
        if (this.resetRemain) {
          this.isProceed = false;
          this.selectedQuickTransferTo = null;
          this.amountDetailsObj = null;
          this.amount = 0;
        }
        break;
      case 'authorization':
        this.authDataObj = val;
        break;
      case 'amountObj':
        this.amountDetailsObj = val;
        break;
    }
  }
  getDebitData() {
    // debugger
    this.configManagement.fetchAccounts().subscribe(
      (debData: any) => {
        if (debData) {
          // console.log(debData)
          this.isLoadingCompelete = true;
          let debitData = debData.DATA.ALL_RECORDS;
          for (let i in debitData) {         
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount ='';
            if(crntAvail_amount && convtd_ccy){
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
               convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
               debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
               debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
            }               
          } 
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: debitData,
            fieldDetails: [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'LIAS_NAME',
              },
              {
                dispKey: 'LBL_ACCOUNT_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
                dataKeySupport:"OD_CCY_CODE"
              },
            ],
          };
        }
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getDataForModify(): void {
    this.isLoadingCompelete = false;
    const selectedProxy = this.rootScopeData.selectedProxy;
    this.configManagement.fetchAccounts().subscribe((debData: any) => {
    this.isLoadingCompelete = true;
      if (debData.DATA)
        this.selectedModifyProxy = debData.DATA.ALL_RECORDS.filter(
          (data: any) => data.OD_ACC_NO === selectedProxy.ACC_NO
        );
        this.initReqParam.accNo=this.selectedModifyProxy[0].OD_ACC_NO;
        this.initReqParam.amt="0";
        this.initReqParam.pdroductCode="PAYMNT";
        this.initReqParam.subPrdCode='IPSDRG';
        this.initReqParam.cif=this.selectedModifyProxy[0].COD_CORECIF;
        this.initReqParam.unitId=this.selectedModifyProxy[0].UNIT_ID;
        let crntAvail_amount = this.selectedModifyProxy[0].CURR_AVAIL_BAL_AMT;
        let convtd_ccy = this.selectedModifyProxy[0].OD_CCY_CODE;
        let currencyFormatPipeFilter = new CurrencyFormatPipe();
        let convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
        this.selectedModifyProxy[0].CURR_AVAIL_BAL_AMT = convtd_amount;
        this.selectedModifyProxy[0].HIDDEN = this.translateService.instant('LBL_HIDDEN');

      if (this.selectedModifyProxy) {
        this.modifyDebitObject = {
          title: 'LBL_FROM',
          data: this.selectedModifyProxy,
          fieldDetails: [
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'ALIAS_NAME',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: 'LIAS_NAME',
            },
            {
              dispKey: 'LBL_ACCOUNT_STATUS',
              dataKey: 'STATUS',
            },
            {
              dispKey: 'LBL_BALANCE',
              dataKey: this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              dataKeySupport:"OD_CCY_CODE"
            },
          ],
        };
      }
    });
  }

  modifyRecordSelected(action: any): void {
    if (action === 'iconClick') {
      this.rootScopeData.isIpsRegistration = false;
      this.rootScopeData.selectedProxy = '';
      this.router.navigate(['/configurationManagement/configurationInquiry']);
    }
  }

  setDeRegistrationData(details: any): void {
    this.proxyModifyData = details;
    this.getAuthorsForDeRegistration();
    this.isProceed = true;
  }

  getAuthorsForDeRegistration(): void {
    this.checkFlexiAuth = false;
    this.configManagement
      .selfAuthCheck({
        unitId: this.selectedDebitObj.UNIT_ID,
        cif: this.selectedDebitObj.COD_CORECIF,
        productCode: 'PAYMNT',
        subProdCode: 'IPSDRG',
        funcCode: 'CRDRGI',
        amount: '',
        accNo: this.selectedDebitObj.OD_ACC_NO,
        pymntCurrency: '',
        paymentAmount: "0",
        debitCurrency: this.selectedDebitObj.OD_CCY_CODE,
      })
      .subscribe((authors: any) => {
        this.isLoadingCompelete = true;
        if (authors) {
          if (authors.data.selfAuth == 'true') {
            this.showAuthentication = true;
          }
          if (authors.data.flexiAuth == 'true') {
            this.showAuthorization = true;
            this.checkFlexiAuth = true;
            this.authOptions = authors.data.authList;
          }
        }
      }, error => {
        this.isLoadingCompelete = true;
      });
  }

  reset() {
    this.selectedDebitObj = null;
    this.selectedQuickTransferTo = null;
    this.debitDataObj = null;
    this.isProceed = false;
    this.amountToPass = '';
    this.amount = 0;
    this.hideAll = false;
    this.getDebitData();
  }
  proceedNext() {
    this.isProceed = true;
    this.hideAddtional = true;
  }
  modify() {
    this.hideAddtional = false;
  }
  submit() {
    if (!this.userOtpValue || this.userOtpValue.length !== 4) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    }
    this.isLoadingCompelete = false;
    let selectedDataValues: any = [];
    if (this.selectedQuickTransferTo) {
      let selectedValues = {
        MOBILE_NUMBER: String(this.selectedQuickTransferTo.mobile),
        EMAIL_ID: this.selectedQuickTransferTo.email,
        NATIONAL_ID: String(this.selectedQuickTransferTo.nationalID),
        MOBILE_NUMBER_FLAG: this.selectedQuickTransferTo.mobileFlag ? "Y":"N",
        EMAIL_ID_FLAG: this.selectedQuickTransferTo.emailFlag ? "Y" : "N",
        NATIONAL_ID_FLAG: this.selectedQuickTransferTo.nationalIDFlag ? "Y" : "N",
      };
      selectedDataValues.push(selectedValues);
    }
    let AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
  //  debugger
    if (this.viewRegistrationData.deregisterFlag === 'N') {
      this.configManagement
        .getQuickTransferConfigSubmit(selectedDataValues, this.selectedDebitObj,this.rootScopeData.userInfo,this.userOtpValue,this.secAuthRef,AUTH_TYPE_O)
        .subscribe((data: any) => {
          this.isLoadingCompelete = true;
          if (data.dataValue.OD_STATUS_DESC === 'Success') {
            this.refNo = data.dataValue.INPUT_REFERENCE_NO;
            this.constructReceiptData(data.dataValue.INPUT_REFERENCE_NO ,data.dataValue);
            this.hideAll = true;
          }else{
            this.hideAll = false;
            this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          }
        }, () => {
          this.isLoadingCompelete = true;
          this.rootScopeData.showSystemError = true;
        });
    } else if(this.viewRegistrationData.deregisterFlag === 'Y'){
      // const proxyData = {
      //   mobile:this.proxyModifyData.mobile? this.proxyModifyData.proxy.mobile: '',
      //   email:this.proxyModifyData.email? this.proxyModifyData.proxy.email: '',
      //   nationalId:this.proxyModifyData.nationalId? this.proxyModifyData.proxy.nationalId: '',
      //   reasonCode: this.proxyModifyData.deregister? this.proxyModifyData.proxy.reasonCode: '',
      //   reasonDescription: this.proxyModifyData.deregister && this.proxyModifyData.proxy.reasonCode == "4"? this.proxyModifyData.proxy.reasonDescription: '',
      // }

      // POWN CONFIRMED - 23-02-2023
      // debugger
      const proxyData = {
        mobile:this.viewRegistrationData.mobile? this.viewRegistrationData.mobile: '',
        email:this.viewRegistrationData.email? this.viewRegistrationData.email: '',
        nationalId:this.viewRegistrationData.nationalID? this.viewRegistrationData.nationalID: '',
        reasonCode: this.viewRegistrationData.deregisterFlag? this.viewRegistrationData.reasonCode: '',
        reasonDescription: this.viewRegistrationData.deregisterFlag && this.viewRegistrationData.reasonCode == "4"?  this.viewRegistrationData.reasonDescription: '',
        mobileDeregFlag : this.viewRegistrationData.mobileFlag ? "Y" : "N",
        emailDeregFlag : this.viewRegistrationData.emailFlag ? "Y" : "N",
        nationalIdDeregFlag : this.viewRegistrationData.nationalIDFlag ? "Y" : "N"
      }
      // debugger;
      this.configManagement.submitIpsDeRegistration(proxyData, this.selectedDebitObj,this.rootScopeData.userInfo,this.userOtpValue,this.secAuthRef).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response.dataValue.OD_STATUS_DESC === 'Success') {
          this.refNo = response.dataValue.INPUT_REFERENCE_NO;
          this.constructDeRegistrationReceipt(response.dataValue.INPUT_REFERENCE_NO, proxyData,response.dataValue);
          this.hideAll = true;
          this.isLoadingCompelete = true;
        } else {
          this.hideAll = false;
          this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }
      }, () => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
      })
    }
  }

  constructDeRegistrationReceipt(refNum: any, proxyData: any ,dataValue :any): void {
    this.isDeRegistration = true;
    this.proxyDataForSaveReceipt = proxyData;
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedDebitObj, { USER_ID: userId })

    let flexiAuth = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey: this.authDataObj ? this.authDataObj.selectedAprover.AUTH_NAME : 'Not Provided',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey: 
          (!this.authDataObj || this.authDataObj.aproveNote === '')
              ? 'Not Provided'
              : this.authDataObj.aproveNote,
        },
      ],
    }
    
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let checkAuth : boolean = false;
    if(dataValue.TXN_STATUS=== "AH"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }else if(dataValue.TXN_STATUS=== "RH" || dataValue.TXN_STATUS=== "RE"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_UNSUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = dataValue.OD_REJECT_REASON;
      this.rejectMsg=true;
    }else if(dataValue.TXN_STATUS=== "RA"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(dataValue.TXN_STATUS=== "RN"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(dataValue.TXN_STATUS=== "AO"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }

    this.receiptData = {
      msg1: message1,
      msg2: message2,
      referenceNumber: refNum,
      accountDeregistered : this.translateService.instant("LBL_ACCOUNT_DEREGISTERED"),
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedDebitObj],

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'USER_ID',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'ALIAS_NAME',
            },
          ],
        },
        {
          title: proxyData.reasonCode? '': 'LBL_PROXY_IDENTIFIER',
          isTable: 'true',
          data: proxyData.reasonCode? [{action: this.translateService.instant("LBL_ACCOUNT_DEREGISTERED")}]: [proxyData],
          fieldDetails: proxyData.reasonCode? [
            {
              dispKey: "LBL_ACTION",
              dataKey: 'action'
            }
          ]: [
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: 'mobile',
            },
            {
              dispKey: 'LBL_EMAIL',
              dataKey: 'email',
            },
            {
              dispKey: 'LBL_NATIONAL_ID',
              dataKey: 'nationalId',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    if(checkAuth && this.showAuthorization){
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
          "subValue": this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : "--"
        },
        {
          "subHead": "Proxy Identifier",
          "subValue": ""
        },
        {
          "subHead": "Mobile Number",
          "subValue": proxyData.mobile!=''?proxyData.mobile:'Not Provided'
        },
        {
          "subHead": "Email",
          "subValue": proxyData.email!=''?proxyData.email:'Not Provided'
        },
        {
          "subHead": "National ID Number",
          "subValue": proxyData.nationalID!=''?proxyData.nationalID:'Not Provided'
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"IPSRegistration",
      "refNo":refNum
    }
  }

  constructReceiptData(refNumber: any,data :any) {
    this.isDeRegistration = false;
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedDebitObj, { USER_ID: userId })
    if (this.amountDetailsObj) {
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      let convrtd_amt = currencyFormatPipeFilter.transform(
        this.amountDetailsObj.debitAmount,
        this.amountDetailsObj.currencyCode
      );
      this.total = convrtd_amt + ' ' + this.amountDetailsObj.currencyCode;
    }
    let flexiAuth = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": this.authDataObj ? this.authDataObj.selectedAprover.AUTH_NAME : 'Not Provided'
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
          (!this.authDataObj || this.authDataObj.aproveNote === '')
              ? 'Not Provided'
              : this.authDataObj.aproveNote,
        },
      ],
    }
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let journalId :any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      journalId = data.JOURNAL_ID;
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(data.TXN_STATUS=== "RN"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }

    this.receiptData = {
      msg1: message1,
      msg2: message2,
      rejectReason: rejectReasonFromAPi ? rejectReasonFromAPi : "",
      referenceNumber: refNumber,
      journalId:journalId ? journalId : "",
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedDebitObj],

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'USER_ID',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'LIAS_NAME',
            },
          ],
        },
        {
          title: 'LBL_PROXY_IDENTIFIER',
          isTable: 'false',
          data: [this.selectedQuickTransferTo],
          fieldDetails: [
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.selectedQuickTransferTo.mobile!=''?this.selectedQuickTransferTo.mobile:'Not Provided',
            },
            {
              dispKey: 'LBL_EMAIL',
              dataKey: this.selectedQuickTransferTo.email!=''?this.selectedQuickTransferTo.email:'Not Provided',
            },
            {
              dispKey: 'LBL_NATIONAL_ID',
              dataKey: this.selectedQuickTransferTo.nationalID!=''?this.selectedQuickTransferTo.nationalID:'Not Provided',
            },
          ],
        },
        // {
        //   title: 'LBL_AUTHORIZATION',
        //   isTable: 'false',
        //   data: '',
        //   fieldDetails: [
        //     {
        //       "dispKey": "LBL_Next_Approver",
        //       "dataKey": this.authDataObj ? this.authDataObj.selectedAprover.AUTH_NAME : 'Not Provided'
        //     },
        //     {
        //       dispKey: 'LBL_ADD_NEXT_APROVER',
        //       dataKey:
        //       (!this.authDataObj || this.authDataObj.aproveNote === '')
        //           ? 'Not Provided'
        //           : this.authDataObj.aproveNote,
        //     },
        //   ],
        // },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_INITIATE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if(this.checkFlexiAuth && checkAuth){
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
          "subValue": this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.selectedDebitObj.LIAS_NAME ? this.selectedDebitObj.LIAS_NAME : "--"
        },
        {
          "subHead": "Proxy Identifier",
          "subValue": ""
        },
        {
          "subHead": "Mobile Number",
          "subValue": this.selectedQuickTransferTo.mobile!=''?this.selectedQuickTransferTo.mobile:'Not Provided'
        },
        {
          "subHead": "Email",
          "subValue": this.selectedQuickTransferTo.email!=''?this.selectedQuickTransferTo.email:'Not Provided'
        },
        {
          "subHead": "National ID Number",
          "subValue": this.selectedQuickTransferTo.nationalID!=''?this.selectedQuickTransferTo.nationalID:'Not Provided'
        },
        {
          "subHead": "Journal ID",
          "subValue": journalId ? journalId : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"IPSRegistration",
      "refNo":refNumber
    }
  }

  downloadPdf(values:any)
  { 
    let SelectedType = values;
    if(this.isDeRegistration === false){
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_INSTANT_TRANSFER_REGISTRATION_RECEIPT'), x:90, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_PROXY_IDENTIFIER'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_MOBILE_NUMBER'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_EMAIL'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ID'), y:135},
        { type: 'text', value:this.selectedDebitObj.USER_ID? this.selectedDebitObj.USER_ID : "", y:75},
        { type: 'text', value:this.selectedDebitObj.OD_ACC_NO?this.selectedDebitObj.OD_ACC_NO:'', y:85},
        { type: 'text', value:this.selectedDebitObj.LIAS_NAME?this.selectedDebitObj.LIAS_NAME:'', y:95},
        { type: 'text', value:this.selectedQuickTransferTo.mobile!=''?this.selectedQuickTransferTo.mobile:'Not Provided', y:115},
        { type: 'text', value: this.selectedQuickTransferTo.email!=''?this.selectedQuickTransferTo.email:'Not Provided', y:125},
        { type: 'text', value:this.selectedQuickTransferTo.nationalID!=''?this.selectedQuickTransferTo.nationalID:'Not Provided', y:135},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
        { type: 'text', value: this.refNo ? this.refNo : '', y:145},
        { type: 'heading', value:this.translateService.instant('LBL_CONFIG_MANAGEMNT_PNDNG_FR_APPROVAL_MSG'), y:155},
      ]
    
      //   this.pdfData.push(
      //     { type: 'save', value:'SadadMOIrefund.pdf'}
      //  )
    
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'InstantTransferRegistrationReceipt.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'InstantTransferRegistrationReceipt.pdf'}
       )
      }
    }else{
      this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_INSTANT_TRANSFER_DEREGISTRATION_RECEIPT"), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_PROXY_IDENTIFIER'), y:105},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_MOBILE_NUMBER'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_EMAIL'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ID'), y:135},
    { type: 'text', value:this.selectedDebitObj.USER_ID? this.selectedDebitObj.USER_ID : "--", y:75},
    { type: 'text', value:this.selectedDebitObj.OD_ACC_NO?this.selectedDebitObj.OD_ACC_NO:'--', y:85},
    { type: 'text', value:this.selectedDebitObj.ALIAS_NAME?this.selectedDebitObj.ALIAS_NAME:'--', y:95},
    { type: 'text', value:this.proxyDataForSaveReceipt.mobile ? this.proxyDataForSaveReceipt.mobile : "--", y:115},
    { type: 'text', value: this.proxyDataForSaveReceipt.email ? this.proxyDataForSaveReceipt.email : "--", y:125},
    { type: 'text', value:this.proxyDataForSaveReceipt.nationalId ? this.proxyDataForSaveReceipt.nationalId : "--", y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo ? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_CONFIG_MANAGEMNT_PNDNG_FR_APPROVAL_MSG'), y:155},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'DeRegistrationReceipt.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'DeRegistrationReceipt.pdf'}
   )
  }
    }
  

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

  getAuthApproverDetails() {
    // function executes when proxy details are added. add details of debit account
    let data = {
      cifNumber : this.selectedDebitObj.COD_CORECIF,
      unitId : this.selectedDebitObj.UNIT_ID,
      debitPortalAccNo : this.selectedDebitObj.OD_PORTAL_ACC_NO,
      paymentAmount: "0",
      beneCurrencyCode : this.selectedDebitObj.OD_CCY_CODE,
      subProdCode: 'IPSREG',
      funcCode: 'CRREGI',
      accNo: this.selectedDebitObj.OD_ACC_NO,
    }
    this.checkFlexiAuth = false;
    this.configManagement.selfAuthCheck(data).subscribe((response: any) => {
      // check logic in other components for selfAuth condition
      this.isLoadingCompelete = true;
      if(response){
        if (response.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.checkFlexiAuth = true;
          this.authOptions = response.data.authList;
        }
      }
    }, () => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
    });
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = '';
      this.otpError = 'LBL_PLS_ENTER_OTP';
    }
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.authDataObj = autherizationDetailsObj;
  }

  ngOnDestroy(): void {
    this.rootScopeData.selectedProxy = '';
    this.rootScopeData.isIpsRegistration = true;
  }

  onlyViewRegistrationData(event:any){
    //debugger
    this.viewRegistrationData = event;
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
