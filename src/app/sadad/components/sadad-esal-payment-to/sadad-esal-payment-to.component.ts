import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { SadadPaymentService } from '../../services/sadad-payment.service';

@Component({
  selector: 'app-sadad-esal-payment-to',
  templateUrl: './sadad-esal-payment-to.component.html',
  styleUrls: ['./sadad-esal-payment-to.component.scss'],
})
export class SadadEsalPaymentToComponent implements OnInit {
  displayedContent = 'beneficiary';
  checkedAlways = true;
  selectedBeneficiary: any;
  @Output() resetAll = new EventEmitter();
  beneficiaryData: any = [];
  beniInvoiceData: any = [];
  beneInvoiceSource: any = [];
  isProceed = false;
  showProceed = false;
  totalAmount = 0;
  selectedRows: any = [];
  formatType = 'SAR';
  selectedInvoiceData: any = [];
  displayInvoiceTable = false;
  invoiceId = '';
  invoiceData: any;
  invoiceSource: any = [];
  payerId = '';
  payerInvoiceData: any = [];
  payerInvoiceSource: any = [];
  beneficiaryCoulmns = ['payerId', 'nickname', 'fullName', 'action'];
  BeneinvoiceColumns = [
    'checkbox',
    'invNO',
    'biller',
    'buyer',
    'dueDate',
    'minAmt',
    'maxAmt',
    'dueAmt',
  ];
  invoiceColumns = [
    'checkbox',
    'invNO',
    'biller',
    'buyer',
    'dueDate',
    'minAmt',
    'dueAmt',
  ];
  setAllInvoicesChecked: boolean = false;
  noRecordFlag = false;
  errorMessage: any = [];
  noInvoiceSelectedError: string = '';
  @Output() onAccountSelect = new EventEmitter();
  @Output() paymentToType = new EventEmitter();
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: '',
    btnLink: '',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };
  isErrorIndex: boolean = false;
  isLoadingComplete: boolean = true;
  isSearched: boolean = false;
  subProductCode = 'ESALPAY';
  functionCode = "ESALTXN";
  rootScopeData: RootScopeDeclare = RootScopeData;
  showInvoiceErrorMsg : boolean = false;
  @Input() creditTabs:any;
  @Input() selectedDebitObj :any;
  constructor(private readonly sadadService: SadadPaymentService, private translateService: TranslateService) {}

  /**
   * @description load beneficiary details, set selected tab details
   */
  ngOnInit(): void {
    this.getBeneficiaryData();
    this.paymentToType.emit(this.displayedContent);
  }

  /**
   * @description set selected tab details and required data
   * @param tab selected tab
   */
  displayContent(tab: any) {
    this.displayedContent = tab;
    this.paymentToType.emit(this.displayedContent);
    this.reset();
    if (tab === 'beneficiary') {
      this.getBeneficiaryData();
      this.noInvoiceSelectedError = '';
    }
  }

  /**
   * @description get beneficiary list
   */
  getBeneficiaryData() {
    this.isLoadingComplete = false;
    this.sadadService.getEsalBeneficiaryData().subscribe(
      (beneficiaries: any) => {
        this.isLoadingComplete = true;
        if (beneficiaries.data && beneficiaries.data.length) {
          this.beneficiaryData = beneficiaries.data;
        } else {
          this.beneficiaryData = [];
          this.noRecordFlag = true;
        }
      },
      () => {
        this.isLoadingComplete = true;
        this.noRecordFlag = true;
      }
    );
  }

  resetErrorMessage(length: number): void {
    while (length < 0) {
      this.errorMessage.push({
        isValid: true,
        message: '',
      });
      length--;
    }
  }

  searchBeneficiaries(event: any, field: string): void {
    showFilteredRows(field, event.target.value);
  }

  triggerSearchFilter(event: any, field: any): void {
    const columnsToSearch = [
      { name: 'invoiceNumber', fieldType: 'string' },
      { name: 'billerName', fieldType: 'string' },
      { name: 'buyerName', fieldType: 'string'},
      { name: 'dueDate', fieldType: 'date' },
      { name: 'lowerRange', fieldType: 'amount1' },
      { name: 'upperRange', fieldType: 'amount1' },
      { name: 'dueAmount', fieldType: 'amount1' },
    ];
    if (event.target.value) {
      this.isSearched = true;
      const selectedInvoices =
        field === 'payerInvoiceData'
          ? this.payerInvoiceSource
          : this.beneInvoiceSource;
      let tableData = showFilteredRecords(
        selectedInvoices.map((invoice: any) => {
          return {
            ...invoice,
            lowerRange: invoice.PaymentRange.range.lowerRange,
          };
        }),
        columnsToSearch,
        event.target.value
      );
      field === 'payerInvoiceData'
        ? (this.payerInvoiceData = tableData)
        : (this.beniInvoiceData = tableData);
      if (tableData.length) {
        this.noRecordFlag = false;
      } else {
        this.noRecordFlag = true;
      }
    } else {
      this.isSearched = false;
      field === 'payerInvoiceData'
        ? (this.payerInvoiceData = this.payerInvoiceSource)
        : (this.beniInvoiceData = this.beneInvoiceSource);
      this.noRecordFlag = false;
    }
  }

  selectAllInvoices(selected: boolean): void {
    this.totalAmount = 0;
    this.selectedRows = [];
    if (selected) {
      const rows =
        this.displayedContent === 'beneficiary'
          ? this.beniInvoiceData
          : this.displayedContent === 'payer'
          ? this.payerInvoiceData
          : [];

      rows.forEach((row: any) => {
        row.IS_SELECTED = selected;
        const amt = row.dueAmount.replaceAll(',', '');
        if (selected) {
          this.selectedRows.push(row);
          this.totalAmount = this.totalAmount + Number(amt);
        }
      });
      this.displayedContent === 'beneficiary'
        ? (this.beneInvoiceSource = this.beniInvoiceData)
        : this.displayedContent === 'payer'
        ? (this.payerInvoiceSource = this.payerInvoiceData)
        : [];
      this.resetErrorMessage(rows.length);
      this.selectedRows.forEach((invoice: any, index: number) => {
        this.checkIfDueAmountValid(index, invoice);
      });
      this.noInvoiceSelectedError = '';
    } else {
      this.totalAmount = 0;
      this.errorMessage = [];
      this.beniInvoiceData.forEach((invoice: any) => {
        invoice.IS_SELECTED = false;
      });
      this.payerInvoiceData.forEach((invoice: any) => {
        invoice.IS_SELECTED = false;
      });
      this.invoiceSource.forEach((invoice: any) => {
        invoice.IS_SELECTED = false;
      });
      this.beneInvoiceSource = this.beniInvoiceData;
      this.payerInvoiceSource = this.payerInvoiceData;
      this.errorMessage = [];
      this.noInvoiceSelectedError = 'LBL_ATLEAST_ONE_INVOICE_SELECTION_ERROR';
    }
  }

  transformCurrency(index: number, selectedInvoice: any): void {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    const currencyFormatPipe = new CurrencyFormatPipe();
    if (selectedInvoice && selectedInvoice.dueAmount) {
      const transformedAmount = currencyFormatPipe.transform(
        unformattedAmountPipeFilter.transform(selectedInvoice.dueAmount, 'SAR'),
        'SAR'
      );
      this.selectedRows[
        this.selectedRows
          .map((invoice: any) => invoice.billerID)
          .indexOf(selectedInvoice.billerID)
      ].dueAmount = transformedAmount;
      this.totalAmount = 0;
      this.selectedRows.forEach((element: any) => {
        if (element.dueAmount) {
          this.totalAmount =
            this.totalAmount +
            Number(
              unformattedAmountPipeFilter.transform(element.dueAmount, 'SAR')
            );
        }
      });
      this.checkIfDueAmountValid(index, selectedInvoice);
    } else {
      const invoiceIndex = this.selectedRows
        .map((invoice: any) => invoice.billerID)
        .indexOf(selectedInvoice.billerID);
      this.selectedRows[invoiceIndex].dueAmount = currencyFormatPipe.transform(
        unformattedAmountPipeFilter.transform('0', 'SAR'),
        'SAR'
      );
      this.transformCurrency(index, this.selectedRows[invoiceIndex]);
    }
  }

  checkIfDueAmountValid(index: number, selectedInvoice: any): void {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    // this.errorMessage[index] = {
    //   isValid: true,
    //   message: '',
    // };
    if (
      selectedInvoice.PaymentRange &&
      selectedInvoice.PaymentRange.range &&
      selectedInvoice.PaymentRange.range.lowerRange &&
      selectedInvoice.dueAmount &&
      Number(
        unformattedAmountPipeFilter
          .transform(selectedInvoice.dueAmount, 'SAR')
          .split('.')[0]
      ) < Number(selectedInvoice.PaymentRange.range.lowerRange.split('.')[0])
    ) {
      let convertedMsg = this.translateService.instant('LBL_AMOUNT_MUST_BE_BETWEEN_MIN_AND_MAX_RANGE');
      let convertToMsg = this.translateService.instant('LBL_SMALL_TO');
      let convertRangeMsg = this.translateService.instant('LBL_RANGE');
      let concateErrorMsg = convertedMsg + ' ' + selectedInvoice.PaymentRange.range.lowerRange + ' '+ convertToMsg +' ' + selectedInvoice.PaymentRange.range.upperRange + ' '+ convertRangeMsg;
      //error message in top//
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage =concateErrorMsg;
      //error message in top//
      this.errorMessage[index] = {
        isValid: false,
        // message: 'LBL_LOW_DUE_AMOUNT'
        message : concateErrorMsg         
      };
    } else if (
      selectedInvoice.PaymentRange &&
      selectedInvoice.PaymentRange.range &&
      selectedInvoice.PaymentRange.range.upperRange &&
      selectedInvoice.dueAmount &&
      Number(
        unformattedAmountPipeFilter
          .transform(selectedInvoice.dueAmount, 'SAR')
          .split('.')[0]
      ) > Number(selectedInvoice.PaymentRange.range.upperRange.split('.')[0])
    ) {
      let convertedMsg = this.translateService.instant('LBL_AMOUNT_MUST_BE_BETWEEN_MIN_AND_MAX_RANGE');
      let convertToMsg = this.translateService.instant('LBL_SMALL_TO');
      let convertRangeMsg = this.translateService.instant('LBL_RANGE');
      let concateErrorMsg = convertedMsg + ' ' + selectedInvoice.PaymentRange.range.lowerRange + ' '+ convertToMsg +' ' + selectedInvoice.PaymentRange.range.upperRange + ' '+ convertRangeMsg;
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage =concateErrorMsg;
      this.errorMessage[index] = {
        isValid: false,
        // message: 'LBL_HIGH_DUE_AMOUNT',
        message: concateErrorMsg
      };
    } else {
      this.errorMessage[index] = {
        isValid: true,
        message: '',
      };
    }
  }

  proceedNext() {
    if(this.displayedContent === 'beneficiary' ){
      if(this.selectedDebitObj && this.totalAmount > Number(amountUnFormat(this.selectedDebitObj.CURR_AVAIL_BAL_AMT))){
        this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
        return;
      }
    }else if(this.displayedContent === 'invoice'){
      let total = 0 ;
      this.invoiceSource.forEach((ele: any) => {
        let amt = ele.dueAmount?.replaceAll(',', '');
        total =total + Number(amt);
      });
      if(this.selectedDebitObj  && (total >Number(amountUnFormat(this.selectedDebitObj.CURR_AVAIL_BAL_AMT)) )){
        this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
        return;
      }
    }else if(this.displayedContent === 'payer'){
      if(this.selectedDebitObj && this.totalAmount > Number(amountUnFormat(this.selectedDebitObj.CURR_AVAIL_BAL_AMT))){
        this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
        return;
      }
    }
    const selectedRows =
      this.displayedContent === 'beneficiary' ||
      this.displayedContent === 'payer'
        ? this.selectedRows
        : this.invoiceSource;
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    const isDueAmountValid: boolean = selectedRows.every(
      (invoice: any) =>
        invoice.dueAmount &&
        Number(
          unformattedAmountPipeFilter.transform(invoice.dueAmount, 'SAR')
        ) > 0
    );
    const noErrors = this.errorMessage.every((errors: any) => {
      return errors && errors.isValid;
    });
    const validTotal: boolean = isDueAmountValid && noErrors;
    // console.log(
    //   'Selected Rows:',
    //   selectedRows,
    //   '\nError Message:',
    //   this.errorMessage,
    //   '\nDue amount valid',
    //   isDueAmountValid,
    //   '\nNo Errors',
    //   noErrors,
    //   '\nProceed:',
    //   isDueAmountValid && noErrors
    // );
    if (selectedRows.length && validTotal) {
      this.isProceed = true;
      this.BeneinvoiceColumns = [
        'checkbox',
        'invNO',
        'biller',
        'buyer',
        'dueDate',
        'minAmt',
        'maxAmt',
        'dueAmt',
      ];
      this.invoiceColumns = [
        'invNO',
        'biller',
        'buyer',
        'dueDate',
        'minAmt',
        'dueAmt',
        'action',
      ];
    }
    if (this.displayedContent === 'beneficiary' && validTotal) {
      if (this.selectedRows.length > 0) {
        this.isProceed = true;
        this.selectedRows.forEach((element: any) => {
          if (element) {
            this.selectedInvoiceData.push(element);
            element.IS_SELECTED = false;
          }
        });
        this.beniInvoiceData = this.selectedInvoiceData;
        this.beneInvoiceSource = this.beniInvoiceData;
        this.onAccountSelect.emit({
          selectedInvoices: this.beniInvoiceData,
          payerId: this.payerId,
          subProdCode : this.subProductCode,
          funcCode : this.functionCode
        });
      } else {
        this.noInvoiceSelectedError = 'LBL_ATLEAST_ONE_INVOICE_SELECTION_ERROR';
      }
    } else if (this.displayedContent === 'invoice' && validTotal) {
      this.invoiceSource.forEach((element: any) => {
        element.IS_SELECTED = false;
      });
      this.isProceed = true;
      this.onAccountSelect.emit({
        selectedInvoices: this.invoiceSource,
        payerId: this.payerId,
        subProdCode : this.subProductCode,
        funcCode : this.functionCode
      });
    } else if (this.displayedContent === 'payer' && validTotal) {
      if (this.selectedRows.length > 0) {
        this.isProceed = true;
        this.selectedRows.forEach((element: any) => {
          if (element) {
            this.selectedInvoiceData.push(element);
            element.IS_SELECTED = false;
          }
        });
        this.payerInvoiceData = this.selectedInvoiceData;
        this.payerInvoiceSource = this.payerInvoiceData;
        this.onAccountSelect.emit({
          selectedInvoices: this.payerInvoiceData,
          payerId: this.payerId,
          subProdCode : "ESALONEPAY",
          funcCode : "ESLONTXN"
        });
      } else {
        this.noInvoiceSelectedError = 'LBL_ATLEAST_ONE_INVOICE_SELECTION_ERROR';
      }
    }
  }

  reset() {
    this.beneficiaryCoulmns = ['payerId', 'nickname', 'fullName'];
    this.selectedRows = [];
    this.invoiceData = [];
    this.selectedInvoiceData = [];
    this.totalAmount = 0;
    this.beniInvoiceData = [];
    this.beneInvoiceSource = [];
    this.noRecordFlag = false;
    this.displayInvoiceTable = false;
    this.invoiceSource = [];
    this.invoiceId = '';
    this.payerId = '';
    this.isProceed = false;
    this.showProceed = false;
    this.payerInvoiceData = [];
    this.payerInvoiceSource = [];
    this.setAllInvoicesChecked = false;
    this.errorMessage = [];
  }

  numberOnly(event: any): boolean {
    return NumberValidation_Omit_Char(event);
  }
  getInvoiceDetailsByPayerId(): void { 
    this.invoiceSource = [];
    this.payerInvoiceData = [];
    if (this.payerId.trim().length) {
      this.isLoadingComplete = false;
      this.sadadService.getPayerIdBasedInvoices(this.payerId.trim()).subscribe(
        (invoices: any) => {
          this.isLoadingComplete = true;

          if(invoices.data.length > 0){
            this.payerInvoiceData = invoices.data ? invoices.data : [];
            const currencyFormatPipe = new CurrencyFormatPipe();
            this.payerInvoiceData.forEach((element: any) => {
              element.IS_SELECTED = false;
              element.dueAmount = currencyFormatPipe.transform(
                element.dueAmount,
                'SAR'
              ) ;
            });
            this.payerInvoiceSource = this.payerInvoiceData;
            this.resetErrorMessage(this.payerInvoiceData.length);
            this.displayInvoiceTable = true;
            this.showProceed = true;
            this.noRecordFlag = false;
          }
          else{
            this.displayInvoiceTable = false;
            this.showProceed = false;
            this.noRecordFlag = true;
          }
          
        },
        () => {
          this.isLoadingComplete = true;
          this.displayInvoiceTable = false;
          this.noRecordFlag = true;
          this.showProceed = false;
        }
      );
    }
  }

  getInvoiceDetailsByInvoiceId(): void {
    this.invoiceSource = [];
    this.payerInvoiceData = [];
    if (this.invoiceId.trim().length) {
      this.isLoadingComplete = false;
      this.sadadService.getInvoiceIdBasedInvoices(this.invoiceId).subscribe(
        (invoices: any) => {
          this.isLoadingComplete = true;
          if(invoices && invoices.data && invoices.data.res_ErrorMessage === 'Failed')
           {
              this.showInvoiceErrorMsg = true;
           }
          else if (invoices.data) {
            this.showInvoiceErrorMsg = false;
            this.invoiceData = invoices.data;
            const currencyFormatPipe = new CurrencyFormatPipe();
            this.invoiceSource = [
              {
                ...invoices.data,
                dueAmount: currencyFormatPipe.transform(
                  invoices.data.dueAmount,
                  'SAR'
                ),
                IS_SELECTED: true,
              },
            ];
            this.resetErrorMessage(1);
            this.selectedRows = this.invoiceSource;
            this.setAllInvoicesChecked = true;
            this.displayInvoiceTable = true;
            this.showProceed = true;
            this.noRecordFlag = false;
          } else {
            this.showInvoiceErrorMsg = false;
            this.noRecordFlag = true;
            this.selectedRows = [];
            this.invoiceSource = [];
          }
        },
        () => {
          this.isLoadingComplete = true;
          this.noRecordFlag = true;
          this.displayInvoiceTable = false;
          this.showProceed = false;
        }
      );
    }
  }

  singleInvoiceChecked(index: number, invoice: any): void {
    this.showProceed = true;
    let rows =
      this.displayedContent === 'beneficiary'
        ? this.beniInvoiceData
        : this.displayedContent === 'payer'
        ? this.payerInvoiceData
        : [];
    if (rows.length) {
      this.errorMessage[index] = {
        isValid: true,
        message: '',
      };
      rows[index].IS_SELECTED = !rows[index].IS_SELECTED;
      const amt = rows[index].dueAmount.replaceAll(',', '');
      if (rows[index].IS_SELECTED) {
        this.totalAmount = this.totalAmount + Number(amt);
        this.checkIfDueAmountValid(index, invoice);
      } else {
        this.totalAmount = this.totalAmount - Number(amt);
      }

      this.setAllInvoicesChecked = rows.every(
        (row: any) => row.IS_SELECTED === true
      );
      this.selectedRows = [];
      if (this.displayedContent === 'beneficiary') {
        this.beniInvoiceData = rows;
        // this.beneInvoiceSource = this.beneficiaryData;
        this.beniInvoiceData.forEach((element: any) => {
          if (element.IS_SELECTED) {
            this.selectedRows.push(element);
          }
        });
      } else if (this.displayedContent === 'payer') {
        this.payerInvoiceData = rows;
        this.payerInvoiceSource = this.payerInvoiceData;
        this.payerInvoiceData.forEach((element: any) => {
          if (element.IS_SELECTED) {
            this.selectedRows.push(element);
          }
        });
      }
    }
    if (!this.selectedRows.length) {
      this.noInvoiceSelectedError = 'LBL_ATLEAST_ONE_INVOICE_SELECTION_ERROR';
    } else {
      this.noInvoiceSelectedError = '';
    }
  }

  selectedRow(row: any, container?: any) {
    if (row === 'iconClick') {
      this.setAllInvoicesChecked = false;
      this.resetAll.emit(true);
      this.BeneinvoiceColumns = [
        'checkbox',
        'invNO',
        'biller',
        'buyer',
        'dueDate',
        'minAmt',
        'maxAmt',
        'dueAmt',
      ];
      this.invoiceColumns = [
        'checkbox',
        'invNO',
        'biller',
        'buyer',
        'dueDate',
        'minAmt',
        'dueAmt',
      ];
      this.reset();
      if (container === 'beneficiary') {
        this.beneficiaryCoulmns = ['payerId', 'nickname', 'fullName', 'action'];
      }
      this.getBeneficiaryData();
      this.selectedBeneficiary = null;
      event?.stopPropagation();
    } else if (row !== 'iconClick' && container === 'beneficiary') {
      this.isLoadingComplete = false;
      this.sadadService.getPayerIdBasedInvoices(row.payerId).subscribe(
        (invoices: any) => {
          this.isLoadingComplete = true;
          this.payerId = row.payerId;
          this.beneficiaryData = [];
          this.selectedBeneficiary = row;
          this.beneficiaryData = [row];
          this.showProceed = true;
          this.beneficiaryCoulmns = [
            'payerId',
            'nickname',
            'fullName',
            'action',
          ];
          this.beniInvoiceData = invoices.data ? invoices.data : [];
          const currencyFormatPipe = new CurrencyFormatPipe();
          this.beniInvoiceData.forEach((element: any) => {
            element.IS_SELECTED = false;
            if(element.dueAmount){
              let formatdueAmount = Number(element.dueAmount);
              element.dueAmount = currencyFormatPipe.transform(
                formatdueAmount,
                'SAR'
              );
            }
          });
          this.beneInvoiceSource = this.beniInvoiceData;
          this.resetErrorMessage(this.beniInvoiceData.length);
          if (this.beniInvoiceData.length === 0) {
            this.noRecordFlag = true;
          }
        },
        () => {
          this.isLoadingComplete = true;
          this.noRecordFlag = true;
          this.showProceed = false;
        }
      );
    }
  }
}
