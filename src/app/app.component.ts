import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import defaultToEnglish from './../assets/i18n/en.json';
import defaultToArabic from './../assets/i18n/ar.json';
import { environment } from 'src/environments/environment';
import { RootScopeDeclare } from './rootscope-declare';
import { RootScopeData } from './rootscope-data';

import { CommonService } from './common-components/services/common.service';
import { TimeoutPopupComponent } from './common-components/components/timeout-popup/timeout-popup.component';
import { MatDialog } from '@angular/material/dialog';
import {
  deleteDOMandShowReloginOPtion,
  applyRightTheme,
  CommonUtility,
} from './utility/common-utility';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'snb-original';
  showLoader = true;
  idleTime = 0;
  pageBackground = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove() {
    this.idleTime = 0;
  }
  @HostListener('document:keypress', ['$event'])
  onKeyPress() {
    this.idleTime = 0;
  }
  @HostListener('window:beforeunload')
  onBeforeUnloadApp() {
    document.cookie = 'JSESSIONID' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigator.sendBeacon(
      `${environment.logoutAPIPath}`,
      '{"transactionCode": "logout", "__PIGGYBACKREQUEST": "Y"}'
    );
  }
  @HostListener('window:unload')
  onUnloadApp() {
    document.cookie = 'JSESSIONID' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    navigator.sendBeacon(
      `${environment.logoutAPIPath}`,
      '{"transactionCode": "logout", "__PIGGYBACKREQUEST": "Y"}'
    );
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }
  constructor(
    private translateService: TranslateService,
    private commonService: CommonService,
    router: Router,
    public dialog: MatDialog,
    private route: Router,
    private commonutil :CommonUtility
  ) {
    translateService.addLangs(['en', 'ar']);
    //translateService.use('en');
    this.rootScopeData.urlMapping = {
      HOME: '/dashboard',
      ACCOUNT_INQ: '/accounts/accounts-inquiry',
      SERVICE_INQ: '/accounts/service-request',
      CHEQUE_BOOK_REQUEST: '/accounts/chequebook-request',
      GENERATE_STATEMENT: '/accounts/generate-statement',
      ADDITIONAL_ACCOUNT:"/accounts/additional-account",
      'VIEW_E-STATEMENT': '/accounts/view-estatement',
      MY_TASK: '/mytask',
      SADAD: 'sadad/sadadPayments',
      SADAD_MOI: 'sadad/sadadMoi',
      NOTIFICATIONS: '/notifications',
      PREFERENCES: '/settings/preferences',
      ADD_BENEFICIARY: '/payments/addBeneficiary',
      UPLOAD_BUILK_BENEFICIARY: '/payments/uploadBulkBeneficiary',
      ADD_BILLER_SADAD: '/sadad/addSadadBiller',
      ADD_PAYER_ESAL: '/sadad/addEsalPayer',
      BULK_PAYMENT: '/sadad/bulkPayment',
      BILLER_INQUIRY: '/sadad/billsInquiry',
      TRANSACTION_INQUIRY: '/transactionInquiry',
      MAKE_A_PAYMENT: '/payments/fundTransfer/ownAccount',
      BKSIFT: '/payments/fundTransfer/ownAccount',
      BKSIBT: '/payments/fundTransfer/withinBank',
      BKSRNT: '/payments/fundTransfer/LocalTransfer',
      TELTRF: '/payments/fundTransfer/international',
      SADAD_ESAL: '/sadad/sadadEsal',
      BENEFICIARY_INQUIRY: '/payments/beneficiaryInquiry',
      MAKE_PAYMENT: '/payments/fundTransfer',
      ARAMCO_MAKE_PAYMENT: '/aramco/makePayment',
      TRADE_SSO: 'https://google.com',
      CONFIGURATION_INQUIRY: '/configurationManagement/configurationInquiry',
      QUICK_TRANSFER_CONFIGURATION:
        '/configurationManagement/quickTransferConfig',
      QUICK_TRANSFER_LIMIT: '/configurationManagement/quickTransferLimit',
      CANCEL_TRANSACTION: '/transactionInquiry/cancelSingleTransfer',
      SINGLE_TRANSFER_DETAILS:
        '/transactionInquiry/singleTransferDetailsLayout',
      STANDING_ORDER: '/standingOrders',
      FILE_UPLOAD: '/payroll/fileUpload',
      ONBOARDING: '/payroll/onboarding',
      STOP_PAYMENT: '/payroll/stop-payment',
      CARDS_INQUIRY: '/cards/cardsInquiry',
      CREDIT_CARD_PAYMENT: '/cards/creditCardPayment',
      CARDS_LIMIT: '/cards/cardLimitMultiple',
      CARDS_SERVICE_INQUIRY: '/cards/serviceInquiry',
      ADD_MADA_CARD: '/cards/addMadaCard',
      VIEW_PIN: '/cards/creditViewPin',
      CHANGE_CARD_LIMIT: '/cards/creditCardLimit',
      RE_ISSUE_CARD: '/cards/reIssueCreditCard',
      STOP_CARD: '/cards/stopCard',
      CHANGE_WITHDRAWAL_LIMIT: '/cards/changeWithdrawalLimit',
      EP_APPLY_FR:'epay/applyEpay',
      EP_SERVICE_INQUIRY:'epay/epayServiceInquiry',
      E_TRADE_INQUIRY: 'eTrade/inquiry',
      E_TRADE_ISSUE_LG_MARGIN: 'eTrade/issueLg',
      E_TRADE_REGISTRATION: 'eTrade/registration',
      E_TRADE_AMEND: 'eTrade/amend',
      EP_TRANSACTION:'epay/epayTransactions',
      EP_STATEMENTS:'epay/epayStatements',
      UPDATE_NATIONAL_ID:'settings/updateNID',
      ACTIVATE_CARD: 'cards/activateCard',
      POS_STATEMENT:'/pos/posStatement',
      POS_SERVICE_REQUEST:'/pos/posServiceRequest',
      POS_TERMINAL_MANAGEMENT : '/pos/posTerminalManagement',
      POS_TRANSACTIONS:'/pos/posTransactions',
      POS_MULTI_CLAIM_REQUEST:'/pos/posMultiClaimRequest',
      MERCHANT_FINANCE_DISPUTE:'/pos/merchantFinaceDispute',
      REFUND_REQUEST:'/pos/refundRequest',
      FEE_DEBIT_INQUIRY:'/pos/feeDebitInquiry',
      MADSTOP: '/cards/stopMadaCard',
      MADPOSLIM: '/cards/posPurchaseLimit',
      LINKADDI: '/cards/linkAdditionalAcc',
      MADREISS: '/cards/reissueMada',
      UPDATE_NATIONAL_ADDRESS:'settings/updateNationalAddress',
      UPDATE_CR_EXPIRY :'settings/updateCrExpiry',
      Merchant_View:'/pos/merchnat_view',
      Merchant_Edit:'/pos/merchnat_edit',
      BALANCE_CERTIFICATE:'accounts/balance-certificate',
      FATCA:'settings/fatca',
      Terminal_View:'/pos/terminal_view',
      Terminal_Delete:'/pos/terminal_delete',
      Terminal_Request_For_Stand:'/pos/terminal_request_for-stand',
      Terminal_Pos_Maintenance:'/pos/terminal_pos_maintenance',
      Terminal_Pos_Paper_Roll:'/pos/terminal_pos_paper_roll',
      Terminal_Mada_Material:'/pos/terminal_mada_material',
      CHANGE_PVN:'settings/authentication/changePVN',
      VAT_INVOICE_INQUIRY:'/accounts/vat-invoice',
      TOKEN_INQUIRY:'settings/tokenInquiry',
      TICKET_INQUIRY:'ticketInquiry/complaints',
      TOKEN_REQUEST:'settings/tokenRequest',
      SWIFTGPI_ACCOUNTS_SUMMARY :'/accounts/transferSummary',
      RAISE_COMPLAINT : 'ticketInquiry/RaiseComplaint',
      eCorp_General_Issue:'/ticketInquiry/ecorp_general_issue',
      RAISE_COMPLAINT_TYPE: 'ticketInquiry/RaiseComplaintType',
      USER_PROFILE :'settings/userProfile',
      APPEARANCE:'settings/appearance',
      MANAGE_ALERTS:'settings/manageAlerts',
      CHANGE_PASSWORD:'settings/changePassword',
      POS_FINANCE_REQUEST:'/posFinance/posRequest',
      POS_FINANCE_INQUIRY:'/posFinance/posInquiry',
      FUNDING_FACILITY:'/eFinance/fundingFacility',
      POS_FINANCE_SUMMARY: '/posFinance/posFinanceSummary',
      POS_TICKET_INQUIRY: '/ticketInquiry/inquiry',
      TICKET_INQUIRY_SUMMARY: '/ticketInquiry/summary',
      ARAMCO_INVOICE_INQUIRY:'/aramco/invoiceInquiry',
      VENDOR_PAYMENT: '/payroll/vendorPayment',
      VENDOR_STOP_PAYMENT: '/payroll/vendor-stop-payment',
      CANCEL_SI_TRANSACTION: '/transactionInquiry/cancelSITransfer',
      STANDING_AMEND_OWN:'/standingOrders/ownAccount',
      STANDING_AMEND_INTERNATIONAL:'/standingOrders/internationalTransfer',
      STANDING_AMEND_WITHIN:'/standingOrders/withinBank',
      STANDING_AMEND_LOCAL:'/standingOrders/localTransfer',
      ACCOUNT_INQ_LOAN : '/accounts/accounts-inquiry/loans',
      SERVICE_INQ_OTHER_REQ: '/accounts/service-request/otherrequest',
      SERVICE_INQ_ADDITIONAL_REQ: '/accounts/service-request/additionalrequest',
      ADD_BENEFICIARY_LOCAL: '/payments/addBeneficiary/beneficiaryLocal',
      ADD_BENEFICIARY_INTERNATIONAL: '/payments/addBeneficiary/beneficiaryInternational',
      SADAD_MOI_REFUND: 'sadad/sadadRefund',
      BILLER_INQUIRY_ESAL: '/sadad/billsInquiry/esalBillerInquiry',
      MY_TASK_PYMNT: '/mytask/payment',
      MY_TASK_FILE_PYMNT: '/mytask/payment/file-payment',
      MY_TASK_SERVICE_REQ: '/mytask/serviceRequest',
      MY_TASK_SERVICE_ADD_ACC: '/mytask/serviceRequest/additionalAccount',
      MY_TASK_BENE_SINGLE: '/mytask/beneficiary',
      MY_TASK_BENE_BULK: '/mytask/beneficiary',
      MY_TASK_SADAD_BILLER: '/mytask/billerManagement',
      MY_TASK_ESAL_BILLER: '/mytask/esal-biller',
      MY_TASK_INSTANT_TRANSFER_MNGMNT: '/mytask/instantTransferManagement',
      MY_TASK_PAYROLL: '/mytask/Payroll',
      MY_TASK_PAYROLL_STOP_PYMNT: '/mytask/Payroll/stop-payment',
      MY_TASK_ONBOARDING: '/mytask/Onboarding',
      MY_TASK_CARDS: '/mytask/cards',
      MY_TASK_MADA_CARD: '/mytask/madaCardMyTask',
      MY_TASK_ETRADE: '/mytask/eTrade',
      MY_TASK_POS: '/mytask/posTransaction',
      MY_TASK_POS_FINANCE: '/mytask/posFinance',
      MY_TASK_POS_COMMON_SERVICES: '/mytask/commonServices',
      MADA_CARDS: '/cards/MADA',
      POS_DOWNLOAD_CENTER:'/pos/downloadcenter',
      ALERTS: '/notifications/notification/alerts',
      NOTIFICATION:'/notifications/notification/notifications',
      ANNOUNCEMENT:'/notifications/notification/announcements',
      MAILBOX_INBOX:'/notifications/mailbox/inbox',
      MAILBOX_SENT:'/notifications/mailbox/sent',
      MAILBOX_DRAFT:'/notifications/mailbox/drafts',
      TRASH:'/notifications/trash',
      TRANSACTION_INQ_BULK_TRANSFER: '/transactionInquiry/bulkTransfer',
      TRANSACTION_INQ_STANDING_ORDER: '/transactionInquiry/standingOrder',
      TRANSACTION_INQ_SADAD_TRANSFER: '/transactionInquiry/sadadTransfer',
      TRANSACTION_INQ_ARAMCO_TRANSFER: '/transactionInquiry/aramcoTransfer',
      TRANSACTION_INQ_PAYROLL: '/transactionInquiry/payroll',
      TRANSACTION_INQ_BULK_DIVIDENDS: '/transactionInquiry/dividends',
      EP_SERVICE_INQ_DOWNLOAD_CENTER:'epay/epayServiceInquiry/epayDownload',
      EP_MULTI_CLAIM_REQ:'epay/multiClaimReq',
      DIGITAL_HUB: 'digitalHub',
      QUICK_TRANSFER_CONFIGURATION_DETAILS_PAGE:'configurationManagement/configurationInquiryDetailsLayout',
      EPAY_MERCHANT_FINANCE_DISPUTE:'epay/epayMerchantFinaceDispute',
      EPAY_REFUND_REQUEST:'epay/epayRefundrequest'
    };

    let checklocalStorage = localStorage.getItem('sessionID');
    // if(!checklocalStorage){
    commonService.callRestControllerServlet().subscribe(
      (response: any) => {

        if(checklocalStorage === response.GET_SESSION_ID.sessionId){
          let lan = response.GET_SESSION_ID.mLanguage;
          commonutil.logoutClick(lan);  
        }
        else{
        this.rootScopeData.userInfo = response.GET_SESSION_ID;
        this.setCallBackOTPAndWorkflowEntitlement();
        this.rootScopeData.userEntitlements = response.userEntitlements;
        this.rootScopeData.callBackTimerSeconds = response.callBackTimerSeconds;
        this.rootScopeData.equivalentCurrency = response.equivalentCurrency;
        this.rootScopeData.userInfo.mLanguage = this.rootScopeData.userInfo
          .mLanguage
          ? this.rootScopeData.userInfo.mLanguage
          : 'en_US';
        this.setLanguage();
        this.showLoader = false;
        let isDarkMode =
          this.rootScopeData.userInfo.darkMode === 'true' ? true : false;
        this.pageBackground = response.backgroundImage;
        applyRightTheme(this.rootScopeData.userInfo.themeColour, isDarkMode);
        localStorage.setItem('sessionID', response.GET_SESSION_ID.sessionId);
        }

        this.watchIdleTime();
      },
      (error) => {
        this.showLoader = false;
        // Add logout code here
      }
    );
  // }
  // else{
  //   commonutil.logoutClick();  
  // }
       

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        //  console.log("APPEVENT==>",event);
        // this.showLoader = true;
        this.rootScopeData.hideBeneficiaryToggle = false;
        this.rootScopeData.changeAddBeneficiaryHeading = false;
        this.rootScopeData.addSadadBillerReviewMode = false;
        this.rootScopeData.changeAddBeneficiaryReviewMode = false;
      }
      if (event instanceof NavigationEnd) {
        if (router.url != '/accounts/chequebook-request') {
          this.rootScopeData.dataFromContextMenu = '';
        }
        if (router.url != '/payments/fundTransfer/ownAccount') {
          this.rootScopeData.ownAccountCloneTransactionObject = '';
        }
        // if (router.url != '/payments/fundTransfer/ownAccount') {
        //   this.rootScopeData.SelectedaccountsSummaryObject = '';
        // }
        if (router.url != '/payments/fundTransfer/LocalTransfer') {
          this.rootScopeData.localCloneTransactionObject = '';
        }
        if (router.url != '/payments/fundTransfer/international') {
          this.rootScopeData.internationalCloneTransactionObject = '';
        }
        if (router.url != '/payments/fundTransfer/withinBank') {
          this.rootScopeData.withinBankCloneTransactionObject = '';
        }
        if(router.url != '/payments/fundTransfer/ownAccount' && router.url != '/payments/fundTransfer/LocalTransfer' && router.url != '/payments/fundTransfer/international' && router.url != '/payments/fundTransfer/withinBank')
        {
          this.rootScopeData.SelectedaccountsSummaryObject = '';
        }
        if (router.url != '/accounts/generate-statement') {
          this.rootScopeData.generateAccountsSummaryObject = '';
        }
        if(router.url != '/standingOrders/localTransfer'){
          this.rootScopeData.localSITransactionObject ='';
        }
        if(router.url != '/standingOrders/internationalTransfer'){
          this.rootScopeData.internationalSITransactionObject ='';
        }
        if(router.url != '/standingOrders/ownAccount'){
          this.rootScopeData.ownAccountSITransactionObject ='';
        }
        if(router.url != '/standingOrders/withinBank'){
          this.rootScopeData.withinBankSITransactionObject ='';
        }
        
       

        // console.log("APPEVENTEND==>",event);
        // this.showLoader = false;
        // this.rootScopeData.hideBeneficiaryToggle = false;
        // this.rootScopeData.changeAddBeneficiaryHeading=false;
        this.rootScopeData.currentUrl = router.url;
      }
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });

   
  }

  setCallBackOTPAndWorkflowEntitlement() {
    let isSoloCorp = this.rootScopeData.userInfo.isSoloCorporate
      ? this.rootScopeData.userInfo.isSoloCorporate
      : 'N';
    let isSingleUser = this.rootScopeData.userInfo.isSingleUser
      ? this.rootScopeData.userInfo.isSingleUser
      : 'N';
    this.rootScopeData.callBackOTPEntitlement = {
      beneRegistrationCallBack:
        isSoloCorp === 'Y' || (isSoloCorp === 'N' && isSingleUser === 'N')
          ? 'Y'
          : 'N',
      beneRegistrationOTPToken:
        isSoloCorp === 'Y' || (isSoloCorp === 'N' && isSingleUser === 'N')
          ? 'Y'
          : 'N',
      beneRegistrationWorkflow:
        (isSoloCorp === 'Y' && isSingleUser === 'N') ||
        (isSoloCorp === 'N' && isSingleUser === 'N')
          ? 'Y'
          : 'N',
    };
  }

  watchIdleTime() {
    let that = this;
    let sessiontimeOut : any = +(that.rootScopeData.userInfo.sessionTO ? that.rootScopeData.userInfo.sessionTO : 400)
    let intr = window.setInterval(function () {
      that.idleTime = that.idleTime + 10;
      if (that.idleTime > sessiontimeOut * 60) {
        window.clearInterval(intr);
        that.popupFunction();
        // alert('logout')
      }
    }, 10000);
  }

  popupFunction() {
    let dialogRef = this.dialog.open(TimeoutPopupComponent, {
      width: '400px',
    });
    const sub = dialogRef.componentInstance.ontimeoutInterval.subscribe((data:any) => {
      if(data ==='N'){
        this.dialog.closeAll();
      }
      else{
        this.dialog.closeAll();
        deleteDOMandShowReloginOPtion(this.translateService);
        window.location.href = '../iportal/jsps/orbilogin.jsp';
      }      
    });
  }

  setLanguage() {
    let selectedLanguate = this.rootScopeData.userInfo.mLanguage;
    if (selectedLanguate == 'en_US') {
      this.translateService.setTranslation('en', defaultToEnglish);
      this.translateService.use('en');
      document.body.classList.remove('rtl');
    } else if (selectedLanguate == 'ar_SA') {
      this.translateService.setTranslation('ar', defaultToArabic);
      this.translateService.use('ar');
      document.body.classList.add('rtl');
    }
    this.rootScopeData.ofLabel= this.translateService.instant("LBL_OF")
    // this.route.navigate(['/dashboard']);
  }

  ngOnInit() {
    // alert(performance.navigation.type === performance.navigation.TYPE_RELOAD);
  }

  langSelected() {
    this.setLanguage();
    this.route.navigate(['/dashboard']);
  }


  // deleteAllCookies() {
  //   sessionStorage.clear();   
  //   let cookies = document.cookie.split(";");
  //   for (let i = 0; i < cookies.length; i++) {
  //     let cookie = cookies[i];
  //     let eqPos = cookie.indexOf("=");
  //     let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
  //   }
  // }
}
