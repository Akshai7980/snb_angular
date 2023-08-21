
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { omit_special_char } from 'src/app/utility/common-utility';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-credited-to',
  templateUrl: './credited-to.component.html',
  styleUrls: ['./credited-to.component.scss'],
})
export class CreditedToComponent implements OnInit {
  //oneTime Object
  oneTimeObj = { billerGroup: '', billerCompany: '', SUBID: '', NICK_NAME: '', DUE_AMT_SAR: '1,000.00', FULL_NAME: 'Dameer Ashan', DUE_DATE: '30/12/2022', MINI_AMT: '400.00 SAR' }
  //to display oneTimePayment
  oneTimePaymentDisplay = false;
  //Display and hide components
  @Output() displayDetals = new EventEmitter()
  @Output() grandTotal = new EventEmitter()
  // dummy data for addtional details
  ref = 'Not Provided';
  selectedRows: any = [];
  billerGroupSelected: any;
  displayedColumns: string[] = [
    'checkbox',
    'nickName',
    'name',
    'subcriberId',
    'paymentType',
    'dueDate',
    'billStatus',
    'mininmumAmt',
    'maximumAmt',
    'dueAmt'
    
  ];
  footerColumn = ['mininmumAmt','dueAmt']
  dataSource: any=[];
  creditInfo: any;
  total = 0;
  formatType = '';
  // to render the components based on click
  isProced = false;
  // hide proceed button
  hideProceed = false;
  rowLength = 0;
  @Input() regBillerDetails: any;
  @Input() billerGroupData: any;
  @Output() billergroupSelect = new EventEmitter();
  @Input() billerNameData: any;
  @Input() searchSadad:any;
  dataSource_billerInq: any = [];
  BillerGroupInvalid: boolean = false;
  BillerNameInvalid: boolean = false;
  SubcriberIdInvalid: boolean = false;
  NickNameInvalid: boolean = false;
  BillerNameSelected: any;
  billerMinamount: any;
  billerCode: any;
  billerId: any;
  billerPaymentType: any;
  billerName: any;
  billerGroup:any
  ccy:any;
  //  selectedRow = 0.00;
  totalAmount: any = 0.00;
  isLoadingCompelete = false;
  minamtvalid: boolean = false;

  filterflag:string ="";
  filterconstraint:any;
  filterfield:any;
  filterValue:any;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  advancedSearchBillerName: any;
  advancedSearchSubscriberId: any;
  advancedSearchPeriod: any;
  type:any;
  advancedSearchType: any;
  filterArray: any = [];

  @Output() billerNameSelect = new EventEmitter();
  @Output() cancel_Click = new EventEmitter();
  @Output() one_Time_Pay_Click = new EventEmitter();
  @Output() clearCredit = new EventEmitter();
  @Output() filterDatas = new EventEmitter();
  rootScopeData: RootScopeDeclare = RootScopeData;
  amountValidError: boolean = false;
  errorMessage: any = [];
  readOnlyValidation: boolean = false;
  negativeAmountValidError: boolean = false;
  SubcriberIdvalid: boolean = false;
  oneTimebillerInquiryCall:any;
  // insufAmtErrMsg : boolean = false;
  @Input() selectedDebitObj : any;
  constructor(
    private sadadPaymentService: SadadPaymentService,
    public currencyPipe: CurrencyFormatPipe,private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.isLoadingCompelete = true;
    this.getcreditinfo();
  }
  triggerSearchFilter(event: any): void {
    showFilteredRows('creditData', event.target.value);
  }
  displayOneTimePayment() {
    this.oneTimePaymentDisplay = true;
    this.SubcriberIdvalid = false;
    this.hideProceed = true;
    this.one_Time_Pay_Click.emit();
  }
  hideOneTimePayment() {
    this.oneTimePaymentDisplay = false;
    this.SubcriberIdvalid = false;
    this.hideProceed = false;
    this.dataSource.forEach((element: any) => {
      element.IS_SELECTED = false;
      element.billerdueDate = "";
      element.billerAmount = "";
      element.blurSelected = false;
    })
    this.cancel_Click.emit(false);
  }
  //need to get data of credit
  getcreditinfo() {

    this.dataSource = this.regBillerDetails.data;
    this.ccy = this.dataSource.currency;
    this.formatType = this.dataSource[0].minAmount?this.dataSource[0].minAmount.slice(-3):"";
  }
  selectedRow(row: any) {
    if (row == 'iconClick') {
      this.dataSource.forEach((element: any) => {
        element.IS_SELECTED = false;
        element.blurSelected = false;
        // element.billerdueDate = "";
        // element.billerAmount = "";
      })
      this.displayDetals.emit()
      this.getcreditinfo();
      this.selectedRows = []
      this.totalAmount = 0.00;
      this.displayedColumns = [
        'checkbox',
        'nickName',
        'name',
        'subcriberId',
        'paymentType',
        'dueDate',
        'billStatus',
        'mininmumAmt',
        'maximumAmt',
        'dueAmt',
        
      ];
      this.isProced = false
      this.readOnlyValidation = false;
    }
  }

  checked(value: any, index: any) {
    this.amountValidError = false;
    this.negativeAmountValidError = false;
    // this.insufAmtErrMsg = false;
    let billeraccount = value.billAccount;
    let billerId = value.billerId;
    // this.billerGroup = value.billerGroup;
    this.billerGroup = value.billerGroupName;
    let billerIndex = index;
    // this.isLoadingCompelete = false;
    if(this.dataSource[index].blurSelected === true){

      this.dataSource[index].IS_SELECTED = true;
      this.dataSource[index].blurSelected = false;
      
      for(let i=0; i<this.selectedRows.length; i++){
        if (this.dataSource[billerIndex].refNo == this.selectedRows[i].refNo) {
          this.selectedRows.splice(i, 1);
          let billervalue = this.dataSource[billerIndex].amountDue;
          let amt = billervalue.replace(/,/g, '');
          let amount = Number(this.totalAmount) - Number(amt);
          this.totalAmount = Number(amount);
        }
      }
    }else{
      this.dataSource[index].IS_SELECTED = !this.dataSource[index].IS_SELECTED;
    }
    if(this.dataSource[index].IS_SELECTED){
      if(this.dataSource[index].amountDue !="" && this.dataSource[index].amountDue != 0 && this.dataSource[index].amountDue != null){
        this.selectedRows.push(this.dataSource[index]);
        const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
              let billervalue = unformattedAmountPipeFilter.transform(this.dataSource[index].amountDue,"SAR");
              let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
              let converted_billervalue: number = +billervalue;
              this.totalAmount = Number(this.totalAmount) + converted_billervalue;
              Object.assign(this.dataSource[billerIndex],
                { 'billerGroup': this.billerGroup },
                { 'billerAmount':  amountDue},
                { 'billerdueDate': this.dataSource[index].dueDate },
                { 'statusDesc': this.dataSource[index].billStatus }
              )
              this.clearCredit.emit(this.selectedRows);
      }else{
        // this.dataSource[index].IS_SELECTED = false;
      }
    }else  {
      // this.isLoadingCompelete = true;
      this.errorMessage[index] = {
        isValid: true,
        message: '',
      };
    for(let i=0; i<this.selectedRows.length; i++){
      if (this.dataSource[billerIndex].refNo == this.selectedRows[i].refNo) {
        this.selectedRows.splice(i, 1);
        let billervalue = this.dataSource[billerIndex].amountDue;
        let amt = billervalue.replace(/,/g, '');
        let amount = Number(this.totalAmount) - Number(amt);
        this.totalAmount = Number(amount);
      }
    }
  }
  // debugger
  if(this.dataSource[index].amountDue === "" || this.dataSource[index].amountDue === null || this.dataSource[index].amountDue === undefined){
    if(this.dataSource[index].IS_SELECTED){
      this.sadadPaymentService.sadadBillersInquiry(billeraccount, billerId).subscribe(
        data => { 
          this.isLoadingCompelete = true;
          this.dataSource_billerInq = data.data;
          if (this.dataSource.length > 0) {
            if(this.dataSource_billerInq.amountDue !="" || this.dataSource_billerInq.amountDue != 0){
              this.selectedRows.push(this.dataSource[index]);
              let billervalue = this.dataSource_billerInq.amountDue;
              let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
              let converted_billervalue: number = +billervalue;
              this.totalAmount = this.totalAmount + converted_billervalue;
              Object.assign(this.dataSource[billerIndex],
                { 'billerGroup': this.billerGroup },
                { 'amountDue':  amountDue},
                { 'billerdueDate': this.dataSource_billerInq.dueDate },
                { 'billStatus': this.dataSource_billerInq.billStatus },
                {'billerNo':this.dataSource_billerInq.billNo}
              )
              this.clearCredit.emit(this.selectedRows);
            }
            else{
              this.dataSource[index].IS_SELECTED = false;
            }
        
            }
        }, error => {
          this.isLoadingCompelete = true;
          // error msg
        }
      )
  } 
  // else  {
  //   this.isLoadingCompelete = true;
  //   for(let i=0; i<this.selectedRows.length; i++){
  //     if (this.dataSource[billerIndex].billAccount == this.selectedRows[i].billAccount) {
  //       this.selectedRows.splice(i, 1);
  //       let billervalue = this.dataSource[billerIndex].billerAmount;
  //       let amt = billervalue.replace(/,/g, '');
  //       let amount = Number(this.totalAmount) - Number(amt);
  //       this.totalAmount = amount;
  //     }
  //   }
  // }
  }
    
  }
  //selects all check boxes
  // selectAll(event: any) {
  //   let billeraccount: any = [], billerId: any = [];
  //   this.selectedRows = this.dataSource;
  //   this.dataSource.forEach((element: any) => {
  //     billeraccount.push(element.billAccount);
  //     billerId.push(element.billerId);
  //     //  let amt = element.DUE_AMT_SAR.replace(',', '');
  //     element.IS_ALL_SELECTED = !element.IS_ALL_SELECTED;
  //     element.IS_SELECTED = element.IS_ALL_SELECTED;
  //     //  if (element.IS_ALL_SELECTED == true) {
  //     //    this.total = this.total + Number(amt);
  //     //  } else {
  //     //    this.total = this.total - Number(amt);
  //     //  }
  //   });
  // }

  //proceeds to next
  proceedToNext() {
    for(let i = 0; i < this.selectedRows.length; i++ ){
      if(this.selectedRows[i].amountDue.includes('-') === true){
        this.negativeAmountValidError = true;
        // this.insufAmtErrMsg = false;
        return;
      }
    }
    if(!this.totalAmount || this.totalAmount<0){
      this.amountValidError = true;
      // this.insufAmtErrMsg = false;
      return;
    }if(this.selectedDebitObj && this.totalAmount > Number(amountUnFormat(this.selectedDebitObj.CURR_AVAIL_BAL_AMT))){
      this.amountValidError = false;
      // this.insufAmtErrMsg = true;
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
      this.negativeAmountValidError = false;
      return;
    }
    const noErrors = this.errorMessage.every((errors: any) => {
      return errors && errors.isValid;
    });
    if (this.selectedRows.length > 0 && noErrors) {
      this.dataSource = []
      if (this.selectedRows.length > 0) {

        this.selectedRows.forEach((element: any) => {
          if (element) {
            element.IS_SELECTED = false
            element.blurSelected = false;
            this.dataSource.push(element)
          }
        });
        this.displayedColumns = [
          'nickName',
          'name',
          'subcriberId',
          'paymentType',
          'dueDate',
          'billStatus',
          'mininmumAmt',
          'maximumAmt',
          'dueAmt',          
          'action'
        ];
        this.isProced = true;
        this.readOnlyValidation = true;
        this.displayDetals.emit(this.dataSource)
        let formatTotal = (this.currencyPipe.transform(this.totalAmount, this.formatType));
        this.grandTotal.emit(formatTotal)
      }
    }
  }

  inputChange(element:any,index:any,event:any) {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    this.amountValidError = false;
    this.negativeAmountValidError = false;
    // this.insufAmtErrMsg = false;
    let eventvalue = Number(event.target.value);
    // let minAmount = Number(element.minAmount);
    var minAmount :any;
    var maxAmount : any;
    if(element.minAmount){
      minAmount = Number(unformattedAmountPipeFilter.transform(element.minAmount, 'SAR').split('.')[0])
    }
    // let maxAmount = Number(element.maxAmount);
    if(element.maxAmount){
      maxAmount = Number(unformattedAmountPipeFilter.transform(element.maxAmount, 'SAR').split('.')[0]);
    }
    //debugger;
    element.blurSelected = true;
    if(eventvalue <= 0 || eventvalue < minAmount){
      let convertedMsg = this.translateService.instant('LBL_AMOUNT_MUST_BE_BETWEEN_MIN_AND_MAX_RANGE');
      let convertToMsg = this.translateService.instant('LBL_SMALL_TO');
      let convertRangeMsg = this.translateService.instant('LBL_RANGE');
      let concateErrorMsg = convertedMsg + ' ' + minAmount + ' '+ convertToMsg +' ' + maxAmount + ' '+ convertRangeMsg;
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage =concateErrorMsg;

      this.errorMessage[index] = {
        isValid: false,
        //message: 'LBL_LOW_DUE_AMOUNT',
        message : concateErrorMsg 
      };
      this.checked(element,index)
    }
     else if(eventvalue > maxAmount){

      let convertedMsg = this.translateService.instant('LBL_AMOUNT_MUST_BE_BETWEEN_MIN_AND_MAX_RANGE');
      let convertToMsg = this.translateService.instant('LBL_SMALL_TO');
      let convertRangeMsg = this.translateService.instant('LBL_RANGE');
      let concateErrorMsg = convertedMsg + ' ' + minAmount + ' '+ convertToMsg +' ' + maxAmount + ' '+ convertRangeMsg;
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage =concateErrorMsg;

        this.errorMessage[index] = {
          isValid: false,
          //message: 'LBL_LOW_DUE_AMOUNT',
          message : concateErrorMsg 
        };
        this.checked(element,index)
    }else{
      let amt = element.amountDue.replace(',', '');
      let formatamt = (this.currencyPipe.transform(amt, this.formatType));
      this.dataSource[index].amountDue = formatamt;
      this.dataSource[index].billerAmount = formatamt;
      element.blurSelected = true;
      this.errorMessage[index] = {
        isValid: true,
        message: '',
      };
      this.checked(element,index)
    }
    this.totalAmount = 0.00;
    this.selectedRows.forEach((element: any) => {
      let amt = element.amountDue.replace(',', '');
      if (element.amountDue) {
        this.totalAmount = Number(this.totalAmount) + Number(amountUnFormat(amt));
      }
    });
  }

  // inputChange(element:any,index:any) {
  //   this.totalAmount = 0.00;
  //   this.dataSource[index].billerAmount = this.currencyPipe.transform(element.billerAmount, this.formatType);
  //   this.selectedRows.forEach((element: any, index: any) => {
  //     let amt = element.billerAmount.replace(',', '');
  //     if (element.billerAmount) {
  //       this.totalAmount = Number(this.totalAmount) + Number(amountUnFormat(amt));
  //     }
  //   });
  // }

  oneTimePay(datasourcelength: any, billeraccount: any, billerId: any) {
    // this.isLoadingCompelete = false;
    if (this.dataSource.length > 0) {
      if (this.dataSource[datasourcelength - 1].IS_SELECTED) {
        this.selectedRows.push(this.dataSource[datasourcelength - 1])
        // let billervalue = this.dataSource_billerInq.amountDue;
        // let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
        // let converted_billervalue: number = +billervalue;
        // this.totalAmount = this.totalAmount + converted_billervalue;
        let billervalue = this.oneTimebillerInquiryCall.amountDue;
      let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
        Object.assign(this.dataSource[datasourcelength - 1],
          { 'billerGroupName': this.billerCode },
          { 'billerAmount': amountDue },
          { 'dueDate': this.oneTimebillerInquiryCall.dueDate},
          { 'billStatus': this.oneTimebillerInquiryCall.billStatus },
          { 'currency': 'SAR' },
          {"serviceType":this.oneTimebillerInquiryCall.serviceType}
        )
      }
    }
    // this.sadadPaymentService.sadadBillersInquiry(billeraccount, billerId).subscribe(
    //   data => {
    //     this.isLoadingCompelete = true;
    //     this.dataSource_billerInq = data.data;
    //     if (this.dataSource.length > 0) {
    //       if (this.dataSource[datasourcelength - 1].IS_SELECTED) {
    //         this.selectedRows.push(this.dataSource[datasourcelength - 1])
    //         // this.selectedRows[datasourcelength - 1] = this.dataSource[datasourcelength - 1];
    //         let billervalue = this.dataSource_billerInq.amountDue;
    //         let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
    //         let converted_billervalue: number = +billervalue;
    //         this.totalAmount = this.totalAmount + converted_billervalue;
    //         Object.assign(this.dataSource[datasourcelength - 1],
    //           { 'billerGroup': this.billerCode },
    //           { 'billerAmount': amountDue },
    //           { 'billerdueDate': this.dataSource_billerInq.dueDate },
    //           { 'statusDesc': this.dataSource_billerInq.billStatus }
    //         )
    //       }
    //     }
       
    //   }, error => {
    //     this.isLoadingCompelete = true;
    //     // error msg
    //   }
    // )
  }
  selectCredit() {
    this.BillerGroupInvalid = this.oneTimeObj.billerGroup ? false : true;
    this.BillerNameInvalid = this.oneTimeObj.billerCompany ? false : true;
    this.SubcriberIdInvalid = this.oneTimeObj.SUBID ? false : true;
    this.NickNameInvalid = this.oneTimeObj.NICK_NAME ? false : true;
    if (this.oneTimeObj.SUBID != '' && this.oneTimeObj.billerGroup != '' && this.oneTimeObj.billerCompany != '' && this.oneTimeObj.NICK_NAME != '' && this.SubcriberIdvalid !== true) {
     let newAccdetails :any ={};

     let billervalue = this.oneTimebillerInquiryCall.amountDue;
      let amountDue = (this.currencyPipe.transform(billervalue, this.formatType));
      let converted_billervalue: number = +billervalue;
      this.totalAmount = this.totalAmount + converted_billervalue;
      let billerDueDate = this.oneTimebillerInquiryCall.dueDate;
      let billStatus = this.oneTimebillerInquiryCall.billStatus;
      Object.assign(newAccdetails,{IS_SELECTED: true}, {"billerGroup": this.oneTimeObj.billerGroup},{"billerName": this.oneTimeObj.billerCompany},
      {"billAccount": this.oneTimeObj.SUBID},{"nickName": this.oneTimeObj.NICK_NAME},{"minAmount":this.oneTimebillerInquiryCall.minAmount},{"paymentType": this.billerPaymentType ? this.billerPaymentType :''},{"billerId": this.billerId},{"dueDate":billerDueDate},
      {"billStatus":billStatus},{"amountDue":amountDue},{"maxAmount":this.oneTimebillerInquiryCall.maxAmount},{"paymentType":this.oneTimebillerInquiryCall.paymentType},{"billerAmount":amountDue}, {"currency":'SAR'}, {"serviceType":this.oneTimebillerInquiryCall.serviceType})  
      // {
      //   IS_SELECTED: true,
      //   "billerGroup": this.oneTimeObj.billerGroup,
      //   "billerName": this.oneTimeObj.billerCompany,
      //   "billAccount": this.oneTimeObj.SUBID,
      //   "nickName": this.oneTimeObj.NICK_NAME,
      //   "minAmount": '',
      //   "paymentType": this.billerPaymentType,
      //   "billerId": this.billerId,
      // }
      if(this.dataSource){
        this.dataSource.push(newAccdetails)
      }
      else{
        this.dataSource =[];
        this.dataSource.push(newAccdetails)
      }
      
      this.oneTimePaymentDisplay = false;
      this.hideProceed = false
      this.oneTimePay(this.dataSource.length, this.oneTimeObj.SUBID, this.billerId);
      this.newAccountclearform();
    }
  }
  newAccountclearform() {
    this.oneTimeObj.billerGroup = "";
    this.oneTimeObj.billerCompany = "",
      this.oneTimeObj.NICK_NAME = "",
      this.oneTimeObj.SUBID = ""
  }
  groupOption(value: any) {
    this.billerGroupSelected = value;
    this.billergroupSelect.emit(this.billerGroupSelected);
  }
  BillerNameOption(value: any) {
    this.BillerNameSelected = value;
    this.oneTimeObj.billerCompany = this.BillerNameSelected.billerName;
    this.billerCode = this.BillerNameSelected.billerCode;
    this.billerId = this.BillerNameSelected.billerId;
    this.billerMinamount = this.BillerNameSelected.minAmount;
    this.billerPaymentType = this.BillerNameSelected.paymentType;
    this.billerName = this.BillerNameSelected.billerName;
    this.billerNameSelect.emit(this.BillerNameSelected);
  }
  
  // Allows only numbers
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  advancedSearchApply(event:any){
    this.filterflag ='Y';
    this.filterValue ="";
    //debugger; 
    this.advancedSearchFromDate = event.dateFrom;
    this.advancedSearchFromTo = event.dateTo;
    this.advancedSearchAmount = event.amount; 
    this.advancedSearchTo = event.to; 
    this.advancedSearchBillerName = event.billerName; 
    this.advancedSearchSubscriberId = event.subscriberId; 
    this.advancedSearchType = event.type;
    this.filterArray =[]; 
    if(this.advancedSearchType == 'Date'){
       if(this.advancedSearchFromDate && this.advancedSearchFromTo){
        let passingObj = {
          "filterField": "valueDate",
          "filterConstraint": "date",
          "filterValue": "",
          "fromAmt": "",
          "toAmt": "",
          "fromDate": this.advancedSearchFromDate,
          "toDate": this.advancedSearchFromTo
        }
         
        this.filterArray.push(passingObj);
       }
       
      if(this.advancedSearchSubscriberId){
        let passingObj2 = {
          "filterField": "billAccount",
          "filterConstraint": "contains",
          "filterValue": this.advancedSearchSubscriberId      
        }         
        this.filterArray.push(passingObj2);
      }
      
      if(this.advancedSearchBillerName){
        let passingObj3= {
          "filterField": "billerName",
          "filterConstraint": "contains",
          "filterValue": this.advancedSearchBillerName      
        }         
        this.filterArray.push(passingObj3);
      }      
      
      this.filterDatas.emit(this.filterArray);
     
    }   
    else if(this.advancedSearchType == 'Amount'){
    if(this.advancedSearchAmount && this.advancedSearchTo){
      let passingObj1 = {
        "filterField": "billerAmount",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }
       
      this.filterArray.push(passingObj1);
    }

      if(this.advancedSearchSubscriberId){
      let passingObj2 = {
        "filterField": "billAccount",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchSubscriberId      
      }
       
      this.filterArray.push(passingObj2);
      }
      
      if(this.advancedSearchBillerName){
        let passingObj3= {
          "filterField": "billerName",
          "filterConstraint": "contains",
          "filterValue": this.advancedSearchBillerName      
        }         
        this.filterArray.push(passingObj3);
      }
      
      this.filterDatas.emit(this.filterArray);
    }
   
}
nickNameValidation(val: any) {
  return omit_special_char(val)
 }

 subcriberIdValidate(){

  let accountId = this.oneTimeObj.SUBID;
  let billerId = this.billerId;

  this.sadadPaymentService.sadadBillersInquiry(accountId,billerId).subscribe((response:any)=>{

    if(response.data){
      if(response.data.accountId){
        this.SubcriberIdvalid = false;
        this.oneTimebillerInquiryCall = response.data;
        this.selectCredit();
      }else{
        this.SubcriberIdvalid = true;
      }
    }
  }, error => {
    this.isLoadingCompelete = true;
  })

 }
}
