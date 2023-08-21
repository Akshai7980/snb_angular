import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { AramcoService } from '../../services/aramco.service';

@Component({
  selector: 'app-aramco-amount-details',
  templateUrl: './aramco-amount-details.component.html',
  styleUrls: ['./aramco-amount-details.component.scss']
})
export class AramcoAmountDetailsComponent implements OnInit {

  currencyFormat = ["SAR","USD"];
  debitAmount = 0;
  @Output() finalAmountObj = new EventEmitter();
  @Input() paymentAmountError = '';
  @Input()readOnly = false;
  @Input() amount = '';
  @Input() onAccountSelect: any = [];
  errorMessage: string = '';
  canProceed: boolean = false;
  @Output() canProceedForm = new EventEmitter();
  @Input() debitAccDetails : any;
  amountObj = {transferAmt:'',currencyCode:'',fee:'',vat:'',debitAmount:0}
  amountCharges: any;
  
  constructor(private aramcoService: AramcoService) { }

 ngOnChanges(changes: SimpleChanges): void {
   if(this.amount) {
    this.amountObj.transferAmt=this.amount
    this.getDebitAmount();
    this.amountObj.debitAmount=this.debitAmount
    this.finalAmountObj.emit(this.amountObj)
   }
 }

  ngOnInit(): void {
    this.amountObj.transferAmt=this.amount;
    this.chargesDetails();
    this.amountObj.currencyCode = this.debitAccDetails.OD_CCY_CODE;
  }

  chargesDetails() {
    this.aramcoService.getChargesApiCall(this.debitAccDetails).subscribe((res: any) => {
      this.amountObj = res.data[0].chargeInfo[0];
      this.amountObj.transferAmt = this.amount;
      this.amountObj.debitAmount = this.debitAmount;
      this.amountObj.currencyCode = this.debitAccDetails.OD_CCY_CODE;
      this.amountObj.fee = res.data[0].chargeInfo[0].charge;
      this.amountObj.vat = res.data[0].chargeInfo[0].vat;
    }, err => {

    });
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
      this.amountObj.debitAmount=this.debitAmount;
      this.finalAmountObj.emit(this.amountObj);
      let currencyPipe=new CurrencyFormatPipe();
      this.amountObj.transferAmt=currencyPipe.transform(Number(this.amountObj.transferAmt),this.amountObj.currencyCode);
      if(Number(event.target.value) === 0 ) {
        this.errorMessage = 'LBL_ENTER_VALID_TRANSFER_AMOUNT';
        this.canProceed = false;
      } else if (Number(this.amount) > Number(event.target.value)) {
        this.errorMessage = 'LBL_ENTER_VALID_TRANSFER_AMOUNT';
        this.canProceed = false;
      } else {
        this.errorMessage = '';
      }
    } else {
      this.errorMessage = 'LBL_ENTER_TRANSFER_AMOUNT';
      this.canProceed = false;
      this.canProceedForm.emit(this.canProceed);
    }
  }

  setData() {
    this.amountObj.fee=this.amountObj.fee.replace(/([a-zA-Z])/g, '')+this.amountObj.currencyCode;
    this.amountObj.vat=this.amountObj.vat.replace(/([a-zA-Z])/g, '')+this.amountObj.currencyCode;
    this.getDebitAmount();
    this.amountObj.debitAmount=this.debitAmount;
    this.finalAmountObj.emit(this.amountObj);
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
     this.amountObj.currencyCode = this.debitAccDetails.OD_CCY_CODE;
  }

}
