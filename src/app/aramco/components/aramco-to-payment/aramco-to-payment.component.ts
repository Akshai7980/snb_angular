import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { AramcoService } from '../../services/aramco.service';

@Component({
  selector: 'app-aramco-to-payment',
  templateUrl: './aramco-to-payment.component.html',
  styleUrls: ['./aramco-to-payment.component.scss']
})
export class AramcoToPaymentComponent implements OnInit {

  selectedDebitObj: any;
  isLoadingCompelete = false;
  displayedContent = "credit";
  oneTimePaymentDisplay = false;
  isProceed = false;
  dataSource: any = [];
  creditSource: any = [];
  invoiceSource: any = [];
  selectedCash: any;
  selectedCredit: any
  receiptData: any;
  authDataObj: any
  aramcoId = '';
  aramcoData: any
  aramcoDetailsOnId: any;
  displayAramcoData = false;
  showProceed: boolean = false;
  checkedAlways = true;
  total = 0;
  oneTimePayData: any = []
  displayedColumns = ["aramcoID", "name"];
  creditColumns = ["remitterId","action"];
  cashColumn = ["checkBox", "invNo", "date", "dueDate", "invAmt", "amtSAR"];
  creditColumn = ["checkBox", "invNo", "date", "dueDate", "invAmt", "amtSAR"];
  selectedRows: any = [];
  formatType = '';
  invoiceId!: string;
  @Output() onAccountSelect = new EventEmitter()
  @Output() remitterId = new EventEmitter()
  @Output() paymentToType = new EventEmitter();
  @Output() resetAll = new EventEmitter()
  @Input() debitData: any;
  @Input() creditTabs: any;
  noRecordFoundInfoObj!: { msg: string; btnLabel: string; btnLink: string; showBtn: string; showMsg: string; showIcon: string; };
  norecordflag: boolean = false;
  cashSource: any = [];
  showInputError!: string;
  displayInvoiceTable: boolean = false;
  isCashInvoice!: boolean;
  setCheck: boolean = false;
  allRemitterData: any;
  cashSelectedRemitterId: any;
  creditSelectedRemitterId: any;
  invoiceNumberContainer: boolean = false;
  debitCcy: any;
  customerName: any
  customerShortName: any;
  isShownCustomerName: boolean = false;
  remittetId: any;
  remitterIdinvalidError!: string;
  isShownCheckbox = false;
  addtoLibCheckBox: any;
  addtoLibrary: string = 'N';
  creditTabEntitlement: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  filterflag: string = "";
  filterconstraint: any;
  filterfield: any;
  filterValue: any;
  filterArray: any = [];
  showFileErrMsg: boolean = false;
  // insufficientErrMsg : boolean = false;

  constructor(private aramcoService: AramcoService) {
    this.rootScopeData.advSearchCurrentPage = 'aramcoInvoiceInquiry'
  }

  ngOnInit(): void {
    this.getCreditLookUpDetails();
    this.debitCcy = this.debitData.OD_CCY_CODE;
    this.showInputError = "";
    this.creditTabEntitlement = this.creditTabs;
    this.paymentToType.emit(this.displayedContent);
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_RECORDS_FOUND",
      "btnLabel": "",
      "btnLink": "",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
  }

  getCreditLookUpDetails() {
    this.aramcoService.getCreditLookUp(this.debitData).subscribe((res: any) => {
      if (res) {
        this.creditSource = res.data;
        this.allRemitterData = res.data;
      }
    }, (error: any) => {
    });
  }

  getAramcoData() {
    // this.aramcoService.getAramcoData().subscribe((aramco: any) => {
    //   if (aramco) {
    //     this.dataSource = aramco.DATA.ALL_RECORDS;
    //     this.aramcoData = aramco.DATA.ALL_RECORDS;

    //     if (aramco.DATA.ALL_RECORDS.length === 0) {
    //       this.isLoadingCompelete = false;
    //       this.norecordflag = !this.norecordflag;
    //       return;
    //     }

    //     if (aramco.status === 500) {
    //       this.isLoadingCompelete = false;
    //       this.norecordflag = !this.norecordflag;
    //       return;
    //     }

    //   } else {
    //     this.isLoadingCompelete = false;
    //     this.norecordflag = !this.norecordflag;
    //   }

    // }, error => {
    //   this.isLoadingCompelete = false;
    //   this.norecordflag = !this.norecordflag;
    // });
  }

  getInvoiceDetailsById() {
    if(this.invoiceId) {
      this.isLoadingCompelete = true;
      let params = {   
        filterArray: this.filterArray,
        flag :this.filterflag
      };
      this.aramcoService.getCashLookUp(this.invoiceId, this.cashSelectedRemitterId,params).subscribe((res: any) => {
        this.isLoadingCompelete = false;
        if(res && res.data && res.data.length>0 && Object.keys(res.data[0]).length != 0) {
          this.invoiceSource = res.data;
          this.invoiceSource.forEach((element: any) => {
            this.total = this.total + (Number(element.amount)?Number(element.amount):0);
          });
          if(this.invoiceSource.length > 0) {
            this.norecordflag = false;
            this.displayInvoiceTable = true;
            this.showProceed = true;
          } else {
            this.norecordflag = true;
            this.displayInvoiceTable = false;
          }
        }else {
          this.norecordflag = true;
        }
      }, (error: any) => {
        this.isLoadingCompelete = false;
      });
    } else {
      this.norecordflag = false;
      this.showInputError = "LBL_ENTER_INVOICE_NUMBER";
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  displayContent(content: any) {
    this.displayedContent = content
    this.paymentToType.emit(this.displayedContent);
    this.displayInvoiceTable = false;
    this.creditSource = this.allRemitterData;
    this.invoiceId = "";
    this.norecordflag=false
  }
  displayOneTimePayment() {
    this.oneTimePaymentDisplay = true
  }
  triggerSearchFilter(event: any, field: any): void {
    showFilteredRows(field, event.target.value);
  }
  selectedData(element: any) {
    this.creditSource = [element];
    element.IS_ALL_SELECTED = true;
    this.creditSelectedRemitterId = element.remitterId;
    this.fetchInvoiceOnRemitterId(element.remitterId)
  }

  fetchInvoiceOnRemitterId(remitterId: any) { /// re-checked
    let params = {   
      filterArray: this.filterArray,
      flag :this.filterflag
    };
    let fromAmount = this.advancedSearchAmount ? this.advancedSearchAmount : '';
    let toAmount = this.advancedSearchTo ? this.advancedSearchTo : '';
    let fromDate = this.advancedSearchFromDate ? this.advancedSearchFromDate : '';
    let toDate = this.advancedSearchFromTo ? this.advancedSearchFromTo :'';
    this.aramcoService.getInvoiceData(remitterId,params,fromAmount,toAmount,fromDate,toDate).subscribe((res: any) => {
      if(res && res.data && res.data.length>0 && Object.keys(res.data[0]).length != 0) {
        this.invoiceSource = res.data;
        if(this.invoiceSource.length > 0) {
          this.norecordflag=false;
          this.advancedSearchAmount = '';
          this.advancedSearchTo ='';
          this.advancedSearchFromDate ='';
          this.advancedSearchFromTo = '';
          this.displayInvoiceTable = true;
          this.creditSource.length = 1;
          this.invoiceSource.forEach((element: any) => {
            element.IS_SELECTED = false;
          });
        }
      }else{
        this.advancedSearchAmount = '';
          this.advancedSearchTo ='';
          this.advancedSearchFromDate ='';
          this.advancedSearchFromTo = '';
        this.norecordflag=true
      }
    }, (error: any) => {
    });
  }

  selectedRow(row: any, container?: any) {
    if (row === 'iconClick') {
     this.resetAll.emit(true)
      if(container==="cash"){
        this.displayedColumns = ["aramcoID", "name"];
      }
      else if(container==="card"){
        this.selectedRows=[]
        this.getCreditLookUpDetails();
        this.creditColumns = ["remitterId", "action"];
        this.total = 0;
        // this.insufficientErrMsg = false;
      this.showFileErrMsg = false;
      }else if(container==="invoice"){
        this.cashColumn = ["checkBox", "invNo", "date", "dueDate","amtSAR","invAmt"];
        this.creditColumn = ["checkBox", "invNo", "date", "dueDate","amtSAR","invAmt"];
        this.selectedRows=[]
        this.isProceed===false;
        this.total = 0;
      }
      // this.getAramcoData();
      this.isProceed = false;
      this.oneTimePaymentDisplay=false
      this.selectedCash=null;
      event?.stopPropagation();
    }
    else if (row != 'iconClick' && container === "cash") {
      this.dataSource = []
      this.selectedCash = row;
      this.dataSource = [row];
      this.displayedColumns = ["aramcoID", "name","action"];
      this.onAccountSelect.emit([this.selectedCash])
    } else if (row != 'iconClick' && container === "credit") {
      this.dataSource = []
      this.selectedCredit = row;
      this.creditSource = [row]
      this.creditColumns = ["remitterId"];
      this.invoiceSource = this.selectedCredit.INV_DATA;
      this.showFileErrMsg = false;
      // this.insufficientErrMsg = false;
      
    }
  }
  getAramcoDetailsById() {

    if (this.aramcoId != '') {

      this.aramcoData.forEach((element: any) => {

        if (element.ARM_ID === this.aramcoId) {
          this.oneTimePayData=element;
          this.aramcoData=element
        }
      });
      if (this.oneTimePayData) {
        this.displayAramcoData = true
      }
    }
  }
  back() {
    // this.getAramcoData()
    this.oneTimePaymentDisplay = false
  }
  assignData() {
    let element = <HTMLInputElement>document.getElementById('checkBox');
    let checked = element.checked;
    if (checked) {
      //add to remitter id
    }
  }

  proceedNext() {
    if(this.displayedContent === 'credit' && this.total <= 0){
      this.showFileErrMsg = true;
      // this.insufficientErrMsg = false;
      return;
    }
    if(this.displayedContent === 'credit' && this.total > Number(amountUnFormat(this.debitData.CURR_AVAIL_BAL_AMT))){
      // this.insufficientErrMsg = true;
      this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
      this.showFileErrMsg = false;
      return;
    }
    if (this.displayedContent === 'cash') {
      this.isProceed = true;
      this.showProceed = false;
      this.invoiceSource = [{
        EQU_AMT_CUR: "",
        OD_ACC_NO: this.invoiceId,
        COD_CORECIF: "",
        amount: '',
        shortName: this.customerShortName,
        addtoLibrary: this.addtoLibrary
      }]
      this.cashSelectedRemitterId = this.invoiceId;
      this.onAccountSelect.emit(this.invoiceSource);
      // if(this.invoiceSource.length > 0) {
      //   this.isProceed = true;
      //   this.showProceed = false;
      //   this.onAccountSelect.emit(this.invoiceSource);
      // }
    } else if (this.displayedContent === 'credit') {
      if (this.invoiceSource.length > 0) {
        this.isProceed = true;
        this.showProceed = false;
        this.invoiceSource = this.selectedRows;
        this.onAccountSelect.emit(this.invoiceSource);
      }
    }
    let remitterID = this.cashSelectedRemitterId ? this.cashSelectedRemitterId : this.creditSelectedRemitterId;
    this.remitterId.emit(remitterID)
  }

  selectAll(val: any) {
    if (this.displayedContent === 'credit') {
      this.total = 0;
      this.selectedRows = [];
      if (val) {
        let i = 0;
        
        if (this.selectedCredit !== undefined) {
          this.selectedCredit.IS_ALL_SELECTED = true;
        } else {
          this.selectedCredit = this.invoiceSource;
          this.selectedCredit.IS_ALL_SELECTED = true;
        }
        this.invoiceSource.forEach((element: any) => {
          let amt : any;
          if(element.equivalentCurrency === this.debitCcy){
            amt = element.equivalentAmount;
          }else if(element.invoiceCurrency === this.debitCcy){
            amt = element.amount;
          }
          // let amt = element.amount;
          element.IS_SELECTED = this.selectedCredit.IS_ALL_SELECTED;
          if (element.IS_SELECTED === true) {
            this.selectedRows.push(element);
            this.total = this.total + Number(amt);
            this.showProceed = true;
          } else {
            this.selectedCredit.IS_ALL_SELECTED = false;
            this.selectedRows.splice(i, 1);
            this.total = this.total - Number(amt);
          }
          i = i + 1;
        });
      } else {
        this.selectedCredit.IS_ALL_SELECTED = false;
        this.invoiceSource.forEach((element: any) => {
          let amt = element.equivalentAmount;
          element.IS_SELECTED = this.selectedCredit.IS_ALL_SELECTED;
        })
        this.selectedRows = [];
        this.total = 0;
      }
    }
  }

  checked(index: any) {
    if (this.displayedContent === 'credit') {
      this.invoiceSource[index].IS_SELECTED = !this.invoiceSource[index].IS_SELECTED;      
      // condition
      // if debit amount is SAR means u can take the amount in SAR only either in invoice amount or equivalent amount 
      let amt : any;
      if(this.invoiceSource[index].equivalentCurrency === this.debitCcy){
        amt = this.invoiceSource[index].equivalentAmount;
      }else if(this.invoiceSource[index].invoiceCurrency === this.debitCcy){
        amt = this.invoiceSource[index].amount;
      }
      if (this.invoiceSource[index].IS_SELECTED === true) {
        this.total = this.total + Number(amt);
        this.selectedRows[index] = this.invoiceSource[index];
        this.showProceed = true;
      } else {
        this.showFileErrMsg = false;
        // this.insufficientErrMsg = false;
        this.setCheck = false;
        this.total = this.total - Number(amt);
        this.total = Number(this.total.toFixed(2));  
      }
      let i = 0;
      this.selectedRows = [];
      this.invoiceSource.forEach((element: any) => {
        if (element.IS_SELECTED) {
          i = i + 1;
          this.selectedRows.push(element);
          this.selectedRows.IS_ALL_SELECTED = true;
        }
      });
      if (i == this.invoiceSource.length) {
        this.setCheck = true;
      }
    }
  }

  inputChange() {
    this.selectedRows.forEach((element: any) => {
      let amt = element.DUE_AMT_SAR.replace(',', '');
      if (element.DUE_AMT_SAR) {
        this.total = this.total + Number(amt)
      }
    });
  }

  cashRemitterId(element: any) {
    this.cashSelectedRemitterId = element.remitterId;
    this.creditSource = [element];
    element.IS_ALL_SELECTED = true;
    this.invoiceNumberContainer = true;
  }


  getRemitterIdValidate() {
    let remitterId = this.invoiceId;
    if (remitterId.length > 0) {
      this.isShownCustomerName = false;
      this.isLoadingCompelete = false;
      this.aramcoService.getremitterValidate(remitterId).subscribe((res: any) => {
        this.isShownCustomerName = true;
        if (res && res.dataValue) {
          this.customerName = res.dataValue.englishName;
          this.customerShortName = res.dataValue.shortName;
          if (res.dataValue.IsLinked === 'Y') {
            this.isShownCheckbox = true;
          }

          this.showProceed = true;
          this.remitterIdinvalidError = "";
        }
        else {
          this.remitterIdinvalidError = "LBL_REMITTER_ID_INVALID";
          this.isShownCustomerName = false;
        }
      }, (error: any) => {
        this.isLoadingCompelete = false;
      });
    }
    else {
      this.isShownCustomerName = false;
    }

  }

  checkAddtoLibrary(value: any) {
    let selectedValue = value.target.checked;
    if (selectedValue) {
      this.addtoLibrary = 'Y';
    }
    else {
      this.addtoLibrary = 'N';
    }
  }

  advancedSearchApply(event: any) {
    this.filterflag = 'Y';
    this.filterValue = "";
    //debugger;
    this.advancedSearchFromDate = event.fromDate;
    this.advancedSearchFromTo = event.toDate;
    this.advancedSearchAmount = event.fromAmt;
    this.advancedSearchTo = event.toAmnt;

    this.filterArray = [];

    if (this.advancedSearchFromDate && this.advancedSearchFromTo) {
      let passingObj = {
        "filterField": "date",
        "filterConstraint": "date",
        "filterValue": "",
        "fromAmt": "",
        "toAmt": "",
        "fromDate": this.advancedSearchFromDate,
        "toDate": this.advancedSearchFromTo
      }

      this.filterArray.push(passingObj);
    }

    if (this.advancedSearchAmount && this.advancedSearchTo) {
      let passingObj1 = {
        "filterField": "amount",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }

      this.filterArray.push(passingObj1);
    }

    if ((this.advancedSearchFromDate && this.advancedSearchFromTo) || (this.advancedSearchAmount && this.advancedSearchTo)) {
      this.invoiceSource = [];
      this.fetchInvoiceOnRemitterId(this.creditSelectedRemitterId)
    }


  }


}


