import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CardsService } from '../../services/cards.service';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
@Component({
  selector: 'app-link-additional-mada-card',
  templateUrl: './link-additional-mada-card.component.html',
  styleUrls: ['./link-additional-mada-card.component.scss']
})
export class LinkAdditionalMadaCardComponent implements OnInit {

  secondaryAccObj: any = {};
  isLoadingComplete: boolean = true;
  isReasonReadonly: boolean = false;
  selectReasonError: boolean = false;
  multiselectaccount: boolean = false;
  dataSource: any;
  dataSourceToPass: any;
  selection: any;
  responseHeader: any;
  norecordflag: boolean = false;
  displayedColumns: string[] = [
    'select',
    'accNumber',
    'nickName',
    'fullName',
    'status',
    'balance',
  ];
  showAuthorization: boolean = false;
  amountLimit = "10,000.00";
  currencyCode = "SAR";
  pdfData: any;
  title: string = "linkSecondaryAccountMadaCard";
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  isSelfAuth: boolean = false;
  isLoadingCompelete: boolean = false;
  receiptObject: any = {};
  debitAccObj: any = {};
  primaryAccObj: any = {};
  submitResponse:any={};
  rootScopeData: RootScopeDeclare = RootScopeData;
  filterflag: string = "";
  sortDirection: string = '';
  currentColumn: string = '';
  fromRow: any;
  toRow: any;
  selectedMadaCardObj: any;
  selectedMadaCardData: any;
  newLimit: any;
  reason: any;
  filterArray: any;
  submitSuccessful: boolean = false;
  newAmountLimit: any = [
    {
      amount: "7000",
      currency: "SAR"
    },
    {
      amount: "8000",
      currency: "SAR"
    },
    {
      amount: "9000",
      currency: "SAR"
    },
    {
      amount: "5000",
      currency: "SAR"
    },
    {
      amount: "9700",
      currency: "SAR"
    }
  ];
  comment: string = '';
  noRecordFoundInfoObj: any;
  secondaryAccLength: boolean = true;
  fromAccounts: any = [];
  fromAccountsObject: any;
  initParam: any;
  primaryAccountSection:boolean=false;
  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };

  constructor(private cardsService: CardsService, private translateService: TranslateService, private downloadAsPdf: downloadAsPdf, private route: Router) { }

  ngOnInit(): void {
    if (this.rootScopeData.selectedMada) {
      this.selectedMadaCardObj = this.rootScopeData.selectedMada;
      //console.log(this.selectedMadaCardObj,"TEST:::::")
      this.selectedMadaCardData = [
        {
          cardNum: this.selectedMadaCardObj?.maskedCardNo,
          nickName: this.selectedMadaCardObj?.name,
          expiryDate: this.selectedMadaCardObj?.expiryDate,
          status: this.selectedMadaCardObj?.statusDescription
        }
      ]
    }
    this.initParam = {
      pdroductCode: 'CORESVS',
      subPrdCode: 'LINKADDI',
      funcCode: "LKADDFNC",
      accNo: this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo :"",
      amt: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
        ccy: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };
    

    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };

    let defaultPassingObj = {
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray = [defaultPassingObj];

    this.isLoadingComplete = false;
    this.constructMadaCardTable(this.selectedMadaCardData);
    this.getPrimaryAccount();
    this.getAccountList();
  }
  onFromAccountSelection(event: any) {

  }

  getPrimaryAccount(){
    this.cardsService.getPrimaryAccount().subscribe(
      (accounts: any) => {
        this.isLoadingComplete = true;
        if (accounts.DATA?.ALL_RECORDS.length > 0) {
          const currencyPipe = new CurrencyFormatPipe();        
          this.fromAccounts = accounts.DATA.ALL_RECORDS.map((val: any) => {
            return {
              balance: currencyPipe.transform(
                val.CURRENT_BAL_AMT,
                val.OD_CCY_CODE
              ),
              ...val,
            };
          });
          if(this.fromAccounts.length > 0){
            this.fromAccounts[0].MADA_ACC_NO = this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "--" 
            this.fromAccounts[0].MADA_STATUS = this.selectedMadaCardObj?.statusDescription ? this.selectedMadaCardObj?.statusDescription : "--" 
          }
        }
        this.primaryAccountSection=true;        
        this.constructPrimaryAccountTable();
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }
  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'accNumber', fieldType: 'string' },
      { name: 'nickName', fieldType: 'string' },
      { name: 'fullName', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'balance', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
  }

  initAnotherPayment() {
    this.title = "posPurchaseLimit";
    this.route.navigate(['/cards/cardsInquiry/MADA'])
  }
  downloadPdf() {

    this.pdfData =
      [
        { type: 'setFontSize', size: 11 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
        { type: 'title', value: "Mada card Receipt", x: 90, y: 35 },
        { type: 'setFontSize', size: 10 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'setFontSize', size: 10 },
        { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
        { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: "F" },
        { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
        { type: 'setFontSize', size: 10 },
        { type: 'heading', value: 'Transaction Details', y: 55 },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
        { type: 'heading', value: this.translateService.instant('LBL_MADA_CARD'), y: 65 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        { type: 'heading', value: this.translateService.instant('LBL_CARD_HOLDER_NAME'), y: 75 },
        { type: 'heading', value: this.translateService.instant('LBL_CARD_NO'), y: 85 },
        { type: 'heading', value: this.translateService.instant('LBL_EXPIRY_DATE'), y: 95 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'heading', value: this.translateService.instant('LBL_AMOUNT_DETAILS'), y: 105 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        { type: 'heading', value: this.translateService.instant('LBL_CURRENT_LIMIT'), y: 115 },
        { type: 'heading', value: this.translateService.instant('LBL_NEW_LIMIT'), y: 125 },
        // { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
        // { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        // { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:155},
        { type: 'text', value: 'Dameer Ahsan', y: 75 }, { type: 'text', value: '1010 XXXX XXXX 0011', y: 85 },
        { type: 'text', value: '31/07/2024', y: 95 },

        { type: 'text', value: this.amountLimit ? this.amountLimit : '', y: 115 },
        { type: 'text', value: this.newLimit ? this.newLimit : '', y: 125 },
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
        // { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
        // { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
        // { type: 'text', value:this.creditObjArray[0].billerGroup? this.creditObjArray[0].billerGroup : '', y:115},
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value: this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency ?  this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency : '', y:135},
        // { type: 'text', value: this.grandTotal + ' ' + this.biller_CCY ?  this.grandTotal + ' ' + this.biller_CCY : '', y:145},
        // { type: 'text', value: this.paymentDate ?  this.paymentDate : '', y:155},
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'heading', value: this.translateService.instant('LBL_REF_NUMBER'), y: 165 },
        { type: 'text', value: '12121212121212', y: 165 },
        { type: 'heading', value: this.translateService.instant('LBL_POS_RECEIPT_LIMIT'), y: 175 },

      ]

    this.pdfData.push(
      { type: 'save', value: 'Madacard.pdf' }
    )

    this.downloadAsPdf.downloadpdf(this.pdfData);


  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceToPass.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceToPass.data.forEach((row: any) =>
        this.selection.select(row)
      );
    // console.log(this.selection, "TEST::::LL:::")
  }

  getAccountList() {
    this.isLoadingCompelete = false;
    // let params = {
    //   sortcolumn: this.currentColumn,
    //   sortDirection: this.sortDirection,
    //   fromRow: this.fromRow,
    //   toRow: this.toRow,
    //   flag: this.filterflag,
    //   "unitId": this.rootScopeData?.userInfo?.UNIT_ID
    //     ? this.rootScopeData.userInfo.UNIT_ID
    //     : ''
    // }

    this.cardsService.getAccountList().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        this.selection = new SelectionModel(true, []);
        if (res === null || res === '' || res === undefined) {
          this.norecordflag = !this.norecordflag;
        }
        if (res.headerValue !== undefined) {
          this.responseHeader = res.headerValue;
        }
        this.dataSource = res.DATA?.ALL_RECORDS;

        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
          this.norecordflag = !this.norecordflag;
        }
        if (this.dataSource) {
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => {
        this.isLoadingCompelete = true;

        this.norecordflag = true;
      }
    );
  }

constructPrimaryAccountTable(){
  this.fromAccountsObject = {
    title: 'LBL_PRIMARY_ACC',
    data: this.fromAccounts,
    fieldDetails: [
      {
        dispKey: 'LBL_ACC_NUMBER',
        dataKey: 'MADA_ACC_NO',
      },
      {
        dispKey: 'LBL_NICKNAME',
        dataKey: 'ALIAS_NAME',
      },
      {
        dispKey: 'LBL_FULL_NAME',
        dataKey: 'OD_ACC_NAME',
      },
      {
        dispKey: 'LBL_STATUS',
        dataKey: 'MADA_STATUS',
      },
      {
        dispKey: 'LBL_BALANCE',
        dataKey: 'balance',
        dataKeySupport: 'OD_CCY_CODE',
      },
    ],
  };    
}
  constructMadaCardTable(data: any) {
    
    this.debitAccObj = {
      title: 'LBL_MADA_CARD',
      data: data,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'cardNum',
        },
        {
          dispKey: 'LBL_CARD_HOLDER_NAME',
          dataKey: 'nickName',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'LBL_EXPIRY_DATE',
          dataKey: 'expiryDate',
        },
      ],
    };

  }

  onSelectednewLimit() {
    if (!this.newLimit)
      this.selectReasonError = false;
  }

  validateSpace(event: any): void {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  getData(event: any) {
    this.authDetail = event;
  }

  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      if (otpValue.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.onSubmit();
    } else {
      this.userOtpValue = '';
    }
  }

  toProceed() {
    this.isLoadingComplete = false;
    this.comment = this.comment.trim();
    this.title = "review";
    this.multiselectaccount = true;
    this.rootScopeData.changeHeading = "Review";
    this.getAuthorizationData();

    // let params = {
    //   "unitId": this.rootScopeData?.userInfo?.UNIT_ID
    //   ? this.rootScopeData.userInfo.UNIT_ID
    //   : '',
    //   "cif": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
    //   "productCode": "CORESVS",
    //   "subProdCode": "LINKADDI",
    //   "funcCode": "LKADDFNC",
    //   "amount": "", // clarification from API
    //   "accNo": this.selectedMadaCardObj?.primaryAccObj, // clarification from API
    //   "pymntCurrency": "", // clarification from API
    //   "debitCurrency": "" // clarification from API
    // }

    // this.cardsService.linkAddAccountFlexiAuth(params).subscribe(
    //   (authors: any) => {
    //     if (authors) {
    //       this.isLoadingComplete = true;
    //       this.comment = this.comment.trim();
    //       this.title = "review";
    //       this.getAuthorizationData();
    //       this.multiselectaccount = true;
    //       this.rootScopeData.changeHeading = "Review";
    //       if (authors?.data?.selfAuth == 'true') {
    //         this.showAuthorization = true;
    //         this.authOptions = authors.data.authList;
    //       }
    //     }
    //   },
    //   () => {
    //     this.isLoadingComplete = true;
    //   }
    // );
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
      accNo: this.selectedMadaCardObj?.primaryAcctNo
        ? this.selectedMadaCardObj?.primaryAcctNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'LINKADDI',
      funcCode: 'LKADDFNC',
      amount: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      pymntCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",	
      debitCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",	
    };
    this.cardsService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.authOptions = res.data.authList;
        }
        if (res.data.flexiAuth === 'true') {
          this.isSelfAuth = true;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  onSubmit() {
    // if (!this.userOtpValue) {
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    //   return;
    // } else if (this.userOtpValue.length < 4) {
    //   this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    //   return;
    // }
    //this.constructReceiptData()

    
    if (this.userOtpValue && this.userOtpValue.length === 4) {
      this.isLoadingComplete = false;
      let selectedAdditionalAccountList:any=[];
        for (const res of this.selection.selected){
          selectedAdditionalAccountList.push({'ACC_NAME':res.fullName, 'BALANCE': res.balance ? amountUnFormat(res.balance) : '', 'ACCOUNT_NUMBER':res.accNumber, 'STATUS':res.status});
        }
        
      let params = {
        "AUTH_TYPE_O": "",
        "secRef": this.secAuthRef,
        "otp": this.userOtpValue,
        "ruleId": this.authDetail && this.authDetail.selectedAprover
          ? this.authDetail.selectedAprover.PARSED_RULE_ID
          : '',
        "stnFlag": this.authDetail &&
          this.authDetail?.selectedAprover &&
          this.authDetail?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
        "entlVal": "",
        "cifNo": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
        "orgAccNo": this.selectedMadaCardObj?.primaryAcctNo,
        "custType": "",
        "reqCountryCode": "",
        "valueDate": "",
        "txtCurrency": "",
        "txnAmount": "",
        "versionNo": "1",
        "cardName": this.selectedMadaCardObj?.cardName,
        "cardNo": this.selectedMadaCardObj?.pan,
        "accountNumber": this.fromAccounts[0]?.OD_ACC_NO, //OD_ACC_NO
        "expiryDate": this.selectedMadaCardObj?.expires,
        "ACC_NAME": this.fromAccounts[0]?.OD_ACC_NAME,
        "BALANCE": this.fromAccounts[0]?.CURR_AVAIL_BAL_AMT,
        "CURRENCY": this.fromAccounts[0]?.OD_CCY_CODE,
        "STATUS": this.selectedMadaCardObj?.status,
        "LinkAddAccount": selectedAdditionalAccountList
      }

      this.cardsService
        .submitAdditionalAccount(params)
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;

            if (response.dataValue?.STATUS === 'SUCCESS') {
              this.submitResponse = response.dataValue;
              this.constructReceiptData(response?.dataValue?.INPUT_REFERENCE_NO); //.INPUT_REFERENCE_NO);
              this.submitSuccessful = true;
            } else {
              this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
  }

  constructReceiptData(referenceNumber: any) {
    // console.log(this.selection.selected,"Test:::secondry obj::")
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_LINK_SECONDARY_ACC_RECEIPT_LIMIT',
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedMadaCardObj?.name ? this.selectedMadaCardObj?.name : "",
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedMadaCardObj?.maskedCardNo ? this.selectedMadaCardObj?.maskedCardNo : "",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedMadaCardObj?.expiryDate ? this.selectedMadaCardObj?.expiryDate : "",
            }
          ],
        },
        {
          title: 'LBL_PRIMARY_ACC',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "",
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: this.fromAccounts[0]?.OD_ACC_NO ? this.fromAccounts[0]?.OD_ACC_NO : "",
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: this.fromAccounts[0]?.OD_ACC_NO ? this.fromAccounts[0]?.OD_ACC_NO : "",
            }
          ],
        },
        {
          "title": "LBL_SECONDARY_ACC",
          "isTable": "true",
          "data": this.selection.selected,
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: 'fullName',
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: 'accNumber',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'nickName',
            },
            // {
            //   dispKey: 'LBL_STATUS',
            //   dataKey: 'status',
            // }
          ]
        }
        
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: '/assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: '/assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST'
      },
    };

    if (this.isSelfAuth.toString() === 'false' || !this.isSelfAuth) {
      this.receiptObject.receiptDetails.splice(3, 0, {
        title: '',
        isTable: 'false',
        data: '',
        type: 'stopMada',
      });
    }

    (this.isSelfAuth.toString() === "true") && this.receiptObject.receiptDetails.push(
      {
        title: 'LBL_AUTHORIZATION',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_Next_Approver',
            dataKey: this.authDetail.selectedAprover?.AUTH_NAME
              ? this.authDetail.selectedAprover.AUTH_NAME
              : 'Not Provided',
          },
          {
            dispKey: 'LBL_ADD_NEXT_APROVER',
            dataKey:
              this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
                : 'Not Provided',
          },
        ]
      },
      {
        title: '',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: this.submitResponse?.STATUS
              ? this.submitResponse.STATUS
              : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: this.submitResponse?.OD_STATUS_DESC
              ? this.submitResponse.OD_STATUS_DESC
              : '--',
          },
        ],
      })
    this.title = 'receipt';
  }

  backToAcc(event: any) {
    if (event) {
      this.title = "linkSecondaryAccountMadaCard";
      this.selection.clear();
      this.multiselectaccount = false;
    }
  }

  openTermsAndCondition() { }


}
