import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { RootScopeData } from '../../../rootscope-data';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { omit_special_char } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-esal-payer-details',
  templateUrl: './esal-payer-details.component.html',
  styleUrls: ['./esal-payer-details.component.scss'],
})
export class ESALPayerDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() clearFlag: boolean = false;
  @Input() payerDetails = {
    payerId: '',
    payerIdError: '',
    shortName: '',
    shortNameError: '',
    fullName: '',
    fullNameError: '',
  };
  @Output() emitPayerDetails = new EventEmitter();
  @Output() emitPayerValidationBtn = new EventEmitter();
  payerId: any;
  shortName: any;
  fullName: any;
  isLoadingComplete: boolean = true;
  isPayerIDValidate = false;

  constructor(private readonly sadadService: SadadPaymentService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.clearFormClick();
  }

  passPayerDetails(): void {   
    if (this.shortName) {
      this.payerDetails.shortNameError = '';
    }
    if (this.fullName) {
      this.payerDetails.fullNameError = '';
    }

    if(!this.isPayerIDValidate){
      this.emitPayerDetails.emit({
        payerId: this.payerId,
        payerIdError: '',
        shortName: this.shortName,
        shortNameError: '',
        fullName: this.fullName,
        fullNameError: '',
      });
    }
    
    
  }

  clearFormClick(): void {
    this.payerId = '';
    this.shortName = '';
    this.fullName = '';
  }

  validatePayerId(): void {
    this.payerDetails.payerIdError = '';
    if (this.payerId) {
      this.isLoadingComplete = false;
      let param={
        refNo:this.payerId
      }
      this.sadadService.validateEsalPayer(param).subscribe(
        (resp:any)=>{
          this.isLoadingComplete = true;
        if(resp.data.RECORD_EXIST==="false"){
          this.isPayerIDValidate = false;
          this.emitPayerValidationBtn.emit(this.isPayerIDValidate)
          this.sadadService.getPayerIdBasedInvoices(this.payerId).subscribe(
            (response: any) => {
              // this.isLoadingComplete = true;
              if (response.data.length > 0) {
                this.isPayerIDValidate = false;
                this.emitPayerValidationBtn.emit(this.isPayerIDValidate)
              }
              else{
                this.seterr()
              }
            },
            () => {
              this.isLoadingComplete = true;
              this.seterr()
            }
          );
        }else{
          this.seterrForFetchAPI()
        }
      },() => {
        this.isLoadingComplete = true;
        this.seterr()
      })
      this.passPayerDetails();
    }
  }
  nickNameValidation(val: any) {
    return omit_special_char(val)
   }
   seterr(){
    this.payerDetails.payerIdError = 'LBL_PAYER_ID_ERROR';
    this.isPayerIDValidate = true;
    this.emitPayerValidationBtn.emit(this.isPayerIDValidate)
   }

   seterrForFetchAPI(){
    this.payerDetails.payerIdError = 'LBL_PAYER_ID_IS_EXIST';
    this.isPayerIDValidate = true;
    this.emitPayerValidationBtn.emit(this.isPayerIDValidate)
   }

  //  payer Id is already exist
}
