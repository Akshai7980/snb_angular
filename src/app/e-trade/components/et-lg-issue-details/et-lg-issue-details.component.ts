import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { mobileNumberValidation } from 'src/app/utility/common-utility';
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';

@Component({
  selector: 'app-et-lg-issue-details',
  templateUrl: './et-lg-issue-details.component.html',
  styleUrls: ['./et-lg-issue-details.component.scss'],
})
export class EtLgIssueDetailsComponent implements OnInit {
  @Input() isReview: boolean = false;
  @Input() isUpdate: boolean = false;
  @Input() types: any = [];
  @Input() branches: any = [];
  @Input() currencies: any = [];
  @Input() issueDetails: any = {
    language: '',
    type: '',
    branch: '',
    amount: '',
    ccy: '',
    amountInEnglish: '',
    amountInArabic: '',
    representing: '',
    refNumber: '',
    expiry: '',
    projectNameAndPurpose: '',
  };
  @Input() errorsObject: any = {
    languageError: '',
    typeError: '',
    branchError: '',
    amountError: '',
    expiryError: '',
  };
  @Output() details = new EventEmitter();
  rootScopeData: RootScopeDeclare = RootScopeData;
  minDate = new Date();
  lang: SUPPORTED_LANGUAGE = 'en';
  arlang: SUPPORTED_LANGUAGE = 'ar';

  value:any;

  constructor(private readonly datePipe: DatePipe,private ngxNumToWordsService: NgxNumToWordsService) {}

  ngOnInit(): void {
    this.formatAmount();
  }

  ngOnChanges(): void {
    if (!this.isUpdate) {
      if (
        this.currencies.filter((currency: any) => currency.currency === 'SAR')
          .length
      ) {
        this.currencyChanged({
          value: this.currencies.filter(
            (currency: any) => currency.currency === 'SAR'
          )[0],
        });
      }
    } else {
      this.currencyChanged({ value: this.issueDetails.ccy });
      this.minDate.setDate(new Date().getDate() + 1);
      this.issueDetails.expiry = new Date(this.issueDetails.expiry);
    }

    if (this.isReview && !this.isUpdate) {
      this.issueDetails.expiry = this.datePipe.transform(
        this.issueDetails.expiry,
        'dd/MM/yyyy'
      );
    }
  }

  languageChanged(language: any): void {
    this.issueDetails.language = language.value;
    this.errorsObject.languageError = '';
    this.details.emit(this.issueDetails);
  }

  typeChanged(type: any): void {
    this.issueDetails.type = type.value;
    this.errorsObject.typeError = '';
    this.details.emit(this.issueDetails);
  }

  branchChanged(branch: any): void {
    this.issueDetails.branch = branch.value;
    this.errorsObject.branchError = '';
    this.details.emit(this.issueDetails);
  }

  currencyChanged(currency: any): void {
    this.issueDetails.ccy = currency.value;
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    if (this.issueDetails.amount) {
      this.issueDetails.amount = currencyFormatPipeFilter.transform(
        this.issueDetails.amount.trim(),
        this.issueDetails.ccy
      );
    }
    this.details.emit(this.issueDetails);
  }

  formatAmount(): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    if (this.issueDetails.amount) {
      this.issueDetails.amount = currencyFormatPipeFilter.transform(
        this.issueDetails.amount.trim(),
        this.issueDetails.ccy.currency
      );
      this.errorsObject.amountError = '';
      this.value = (this.issueDetails.amount).replace(/,/g, '')
      this.value = parseFloat(this.value);
      this.issueDetails.amountInEnglish = this.ngxNumToWordsService.inWords(this.value, this.lang);
      this.issueDetails.amountInArabic = this.ngxNumToWordsService.inWords(this.value, this.arlang);
      this.details.emit(this.issueDetails);
    } else {
      this.issueDetails.amount = currencyFormatPipeFilter.transform(
        '0.0',
        this.issueDetails.ccy
      );
      this.value = (this.issueDetails.amount).replace(/,/g, '')
      this.value = parseFloat(this.value);
      this.issueDetails.amountInEnglish = this.ngxNumToWordsService.inWords(this.value, this.lang);
      this.issueDetails.amountInArabic = this.ngxNumToWordsService.inWords(this.value, this.arlang);
      this.details.emit(this.issueDetails);
    }
  }

  inputChanged(): void {
    this.details.emit(this.issueDetails);
  }

  getExpiryDate(date: any): void {
    this.issueDetails.expiry = date;
    this.errorsObject.expiryError = '';
    this.details.emit(this.issueDetails);
  }

  allowNumbersOnly(value: any): boolean {
    return mobileNumberValidation(value);
  }
}
