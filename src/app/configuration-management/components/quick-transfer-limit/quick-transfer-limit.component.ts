import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { ConfigurationManagementService } from '../../services/configuration-management.service';

@Component({
  selector: 'app-quick-transfer-limit',
  templateUrl: './quick-transfer-limit.component.html',
  styleUrls: ['./quick-transfer-limit.component.scss']
})
export class QuickTransferLimitComponent implements OnInit {
  amountObj={transferAmt:'',currencyCode:'SAR',debitAmount:0}
  debitAmount=0
  debitDataObj: any;
  selectedDebitObj: any;
  isLoadingCompelete = false;
  isProceed = false;
  selectedTo: any;
  receiptData: any;
  authDataObj: any;
  amountDetailsObj:any;
  hideAll=false;
  amount=0;
  errorMsg=''
  ownLimitAmount= ""
  isShownButtons :boolean = true;
  @Output() finalAmountObj=new EventEmitter()
  @Input() paymentAmountError = '';
  @Input()readOnly=false;
  customerInforList: any;
  viewCustomerDet: boolean = false;
  customerName: any;
  isLimitAmntChecked :boolean = true;
  responseQuickTransferLimit:any;
  changedAmount:any;
  responseValAmount:any;
  @Input() CifDetails : any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private configManagementService:ConfigurationManagementService,private translateService: TranslateService) { }
  ngOnInit(): void {
  // this.getDebitData()
   this.getCIFData();
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  amountOnBlur(event:any){
    this.amountObj.transferAmt=event.target.value
    this.changedAmount=event.target.value
    this.amountObj.debitAmount=this.debitAmount
    this.finalAmountObj.emit(this.amountObj)
    if(this.amountObj.transferAmt!=''){
      this.paymentAmountError=''
     }
  }
  getDebitData(data:any) {
    this.configManagementService.getTransactionLimit(data).subscribe((debData: any) => {
      if (debData) {
        this.isLoadingCompelete = true;
        let debitData = debData.data;
        if(debitData){
          // this.isLimitAmntChecked = false;
         this.ownLimitAmount =debitData.proxyLimit;
         this.amountObj.transferAmt=debData.data.quickTransferLimit?debData.data.quickTransferLimit:"0"
         let currencyFormatPipeFilter = new CurrencyFormatPipe();
         //debugger;
         this.responseValAmount = debData.data.quickTransferLimit?debData.data.quickTransferLimit:"0"
         this.responseQuickTransferLimit= currencyFormatPipeFilter.transform(this.amountObj.transferAmt.trim(), 'SAR');
         
        }
      }
    }, (error: any) => {
      this.isLimitAmntChecked = true;
      this.isLoadingCompelete = true;
    })
  }
  proceedNext() {
    let convertedOwnLimitAmount : number;
    let convertedTransferAmount = parseFloat(amountUnFormat(this.amountObj.transferAmt));
    convertedOwnLimitAmount = parseFloat(this.ownLimitAmount);
    if(this.amountObj.transferAmt=='' ||this.amountObj.transferAmt=='0' ||convertedTransferAmount<1 ){
      this.paymentAmountError= this.translateService.instant("LBL_PLEASE_PROVIDE_AMOUNT");
     }
     else  if( convertedTransferAmount > convertedOwnLimitAmount){
      this.paymentAmountError= this.translateService.instant("LBL_AMOUNT_SHOULD_NOT_EXCEED_LIMIT");
     }
     else {
      this.isProceed = true
     }
  }
  reset() {
    this.selectedDebitObj=null
    this.selectedTo=null
    this.receiptData=null
    this.authDataObj=null
    this.amountDetailsObj=null
    this.hideAll=false
    this.isLoadingCompelete = false
    this.isProceed = false;
    this.debitDataObj=null;
    this.amount=0;
    this.amountObj.transferAmt = '';
   
  }

  changeRedirect(event :any)
  {
    this.isProceed = event;
    this.amount=0;
    this.amountObj.transferAmt = '';
  }

  getCIFData(){
    this.configManagementService.getCIFLookup().subscribe((res:any)=>{
      this.customerInforList = res.dataValue;
    })
  }

  selectedCustomerNumber(data:any){
    if(data){
      this.viewCustomerDet = true;
      this.customerName = data.customerName;
      this.CifDetails = data;
      this.getDebitData(data)
    }
  }

  onAmountConvertion(){
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let unformatedAmountValue = this.amountObj.transferAmt;
    this.amountObj.transferAmt= currencyFormatPipeFilter.transform(this.amountObj.transferAmt.trim(), 'SAR');
     //debugger
    if(Number(this.changedAmount) !== Number(this.responseValAmount))
    {
     this.isLimitAmntChecked = false
    }
    else{
     this.isLimitAmntChecked = true
    }
  }

}
