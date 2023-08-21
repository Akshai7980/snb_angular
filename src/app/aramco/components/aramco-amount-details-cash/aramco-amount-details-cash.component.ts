import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { AramcoService } from '../../services/aramco.service';

@Component({
  selector: 'app-aramco-amount-details-cash',
  templateUrl: './aramco-amount-details-cash.component.html',
  styleUrls: ['./aramco-amount-details-cash.component.scss']
})
export class AramcoAmountDetailsCashComponent implements OnInit {

  amountObj = {transferAmt:'',currencyCode:'',fee:'',vat:'',debitAmount:0}
  debitAmount = 0;
  @Output() finalAmountObj = new EventEmitter();
  errorMessage: string = '';
  canProceed: boolean = false
  @Input() amount = '';
  @Output() canProceedForm = new EventEmitter();
  @Input()readOnly = false;
  @Input() debitAccDetails : any;
  currencyFormat = ["SAR","USD"];
  currencyCode: any;
  insufAmtErrMsg : any;
  constructor(private aramcoService: AramcoService) { }

  ngOnInit(): void {
    this.chargesDetails()
    this.currencyCode = this.debitAccDetails.OD_CCY_CODE;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  amountOnBlur(event:any) {
    if(event.target.value !== "") {
      this.amountObj.transferAmt=event.target.value;
      this.getDebitAmount();
      if(Number(event.target.value) === 0 ) {
        this.errorMessage = 'LBL_ENTER_VALID_TRANSFER_AMOUNT';
        this.insufAmtErrMsg = '';
        this.canProceed = true;
      } else if (Number(this.amount) > Number(event.target.value)) {
        this.errorMessage = 'LBL_ENTER_VALID_TRANSFER_AMOUNT';
        this.insufAmtErrMsg = '';
        this.canProceed = true;
      } else if(Number(event.target.value) > (Number(amountUnFormat(this.debitAccDetails.CURR_AVAIL_BAL_AMT)))){
        this.insufAmtErrMsg = 'LBL_INSUFFICIENT_BALANCE';
        this.errorMessage = '';
        this.canProceed = true;
      }else {
        this.errorMessage = '';
        this.insufAmtErrMsg = '';
        this.canProceed = false;
      }
      this.canProceedForm.emit(this.canProceed);  
      this.amountObj.debitAmount=this.debitAmount;
      this.finalAmountObj.emit(this.amountObj);
      let currencyPipe=new CurrencyFormatPipe();
      this.amountObj.transferAmt=currencyPipe.transform(Number(this.amountObj.transferAmt),this.amountObj.currencyCode);
    } else {
      this.errorMessage = 'LBL_ENTER_TRANSFER_AMOUNT';
      this.insufAmtErrMsg = '';
      this.canProceed = true;
      this.canProceedForm.emit(this.canProceed);
    }
  }

  getDebitAmount() {
    this.debitAmount=0;
    // let fee = '0.0' , vat = '0.0';
    let fee = this.amountObj.fee , vat = this.amountObj.vat;
    if(this.amountObj) {
      if(this.amountObj.fee) {
        fee.replace(/([a-zA-Z])/g, '').trim();
      }
        if (this.amountObj.vat) {
        vat.replace(/([a-zA-Z])/g, '').trim();
      }
    }
     this.debitAmount = Number(this.amountObj.transferAmt)+Number(fee)+Number(vat);
  }

  setData() {
    this.amountObj.fee=this.amountObj.fee.replace(/([a-zA-Z])/g, '')+this.amountObj.currencyCode;
    this.amountObj.vat=this.amountObj.vat.replace(/([a-zA-Z])/g, '')+this.amountObj.currencyCode;
    this.getDebitAmount();
    this.amountObj.debitAmount=this.debitAmount;
    this.finalAmountObj.emit(this.amountObj);
  }

  chargesDetails() {
    this.aramcoService.getChargesApiCall(this.debitAccDetails).subscribe((res: any) => {
      this.amountObj = res.data[0].chargeInfo[0];
      this.amountObj.transferAmt = this.amount;
      this.amountObj.debitAmount = this.debitAmount;
      this.amountObj.currencyCode = res.data[0].chargeInfo[0].ccy;
      this.amountObj.fee = res.data[0].chargeInfo[0].charge;
      this.amountObj.vat = res.data[0].chargeInfo[0].vat;
    }, err => {

    });
  }

}
