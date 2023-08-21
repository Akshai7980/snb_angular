import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mobileNumberValidation } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-et-applicant-details',
  templateUrl: './et-applicant-details.component.html',
  styleUrls: ['./et-applicant-details.component.scss'],
})
export class EtApplicantDetailsComponent implements OnInit {
  @Input() isReview: boolean = false;
  @Input() applicantName: string = '';
  @Input() commissionAccounts: any = [];
  @Input() marginAccounts: any = [];
  @Input() errorsObject: any = {
    commissionAccountError: '',
    marginAccountError: '',
  };
  @Input() isUpdate: boolean = false;
  @Input() applicantDetail: any;
  @Output() applicantDetails = new EventEmitter();
  constructor() {}
  details: any = {
    commissionAccount: '',
    marginAccount: '',
    address1: '',
    address2: '',
    address3: '',
    email: '',
    mobile: '',
    phone: '',
    fax: '',
  };

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isUpdate) {
      this.details = this.applicantDetail;
    }
    if (
      this.isReview &&
      !this.isUpdate &&
      typeof this.details.commissionAccount !== 'string'
    ) {
      this.details.commissionAccount = this.details.commissionAccount.OD_ACC_NO;
      this.details.marginAccount = this.details.marginAccount.OD_ACC_NO;
    }
  }

  commissionAccountChanged(account: any): void {
    this.details.commissionAccount = account.value;
    this.errorsObject.commissionAccountError = '';
    this.applicantDetails.emit(this.details);
  }

  marginAccountChanged(account: any): void {
    this.details.marginAccount = account.value;
    this.errorsObject.marginAccountError = '';
    this.applicantDetails.emit(this.details);
  }

  inputChanged(): void {
    this.applicantDetails.emit(this.details);
  }

  allowNumbersOnly(value: any): boolean {
    return mobileNumberValidation(value);
  }
}
