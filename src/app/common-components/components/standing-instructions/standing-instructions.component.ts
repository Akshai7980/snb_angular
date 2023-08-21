import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberValidation_Omit_Char, omit_special_char } from 'src/app/utility/common-utility';
import moment from 'moment';

@Component({
  selector: 'app-standing-instructions',
  templateUrl: './standing-instructions.component.html',
  styleUrls: ['./standing-instructions.component.scss'],
})
export class StandingInstructionsComponent implements OnInit {
  @Input() standingInstructionsObject: any = {
    frequency: '',
    frequencyError: '',
    paymentStartDate: '',
    paymentStartDateError: '',
    paymentEndOnWith: '',
    paymentEndError: '',
    paymentEndDate: '',
    paymentEndDateError: '',
    numberOfInstances: '',
    numberOfInstancesError: '',
  };
  @Input() disabledAmend = false;
  @Input() frequencies: string[] = [];
  @Input() paymentEndOptions: string[] = [];
  @Input()
  showStandingInstructionsForm!: boolean;
  @Output() emitFromValues = new EventEmitter<any>();
  isFormValid = false;
  minStartDate = new Date();
  minExpiryDate = new Date();
  startDateDisable : boolean = true;
  constructor(private datePipe : DatePipe) {
     this.minStartDate.setDate(this.minStartDate.getDate() + 1);
     this.minExpiryDate.setDate(new Date().getDate() + 1) 
    // this.minStartDate = moment().add(1, 'day').toDate();
    // console.log(moment().add(1, 'day'));;
  }

  ngOnInit(): void {
    if(this.standingInstructionsObject.paymentStartDate){
      let date : any = new Date();
      let formattedDate = moment(this.standingInstructionsObject.paymentStartDate, 'DD/MM/YYYY');
      this.standingInstructionsObject.paymentStartDate = formattedDate.toDate();
      this.startDateDisable = Date.parse(this.standingInstructionsObject.paymentStartDate) >  Date.parse(date);
      // this.minStartDate.setDate(this.standingInstructionsObject.paymentStartDate)
    }
    if(this.standingInstructionsObject.paymentEndDate){
      let formattedDate = moment(this.standingInstructionsObject.paymentEndDate, 'DD/MM/YYYY');
      this.standingInstructionsObject.paymentEndDate = formattedDate.toDate();
      // this.minExpiryDate.setDate(this.standingInstructionsObject.paymentStartDate)
    }
  }

  frequencyChanged(): void {
    if (this.standingInstructionsObject.frequency) {
      this.standingInstructionsObject.frequencyError = '';
      this.emitFromValues.emit(this.standingInstructionsObject);
      this.calculateInstancesOrExpiry();
    }
  }
  setStartDate(): void {
    this.standingInstructionsObject.paymentEndDate = ''
    if (this.standingInstructionsObject.paymentStartDate) {
      this.standingInstructionsObject.paymentStartDateError = '';
      this.emitFromValues.emit(this.standingInstructionsObject);
      this.minExpiryDate.setDate(
        new Date(this.standingInstructionsObject.paymentStartDate).getDate() + 1
      );
    }
    this.calculateInstancesOrExpiry();
  }

  setExpiryDate(): void {
    this.standingInstructionsObject.paymentEndDateError = '';
    this.calculateInstancesOrExpiry();
  }

  calculateInstancesOrExpiry(): void {
    const formObject = this.standingInstructionsObject;
   
    let convertedInstance = Number(formObject.numberOfInstances)
    if(this.standingInstructionsObject.paymentEndOnWith === 'Number of Instances' && convertedInstance < 1){
      // debugger;
      this.standingInstructionsObject.numberOfInstances = '';
      return;
    }
    const frequency = formObject.frequency;
    const startDate = formObject.paymentStartDate;
    this.isFormValid = true;
    if (
      formObject.paymentEndOnWith &&
      this.standingInstructionsObject.paymentEndOnWith ===
        'Number of Instances' &&
      formObject.frequency &&
      formObject.paymentStartDate &&
      formObject.numberOfInstances
    ) {
      const instances = Number(formObject.numberOfInstances);
      let totalDays = 0;

      if (frequency === 'Daily' || frequency === 'EOD') {
        totalDays = instances;
      } else if (frequency === 'Weekly') {
        totalDays = instances * 7;
      } else if (frequency === 'Monthly') {
        totalDays = instances * 30;
      } else if (frequency === 'Yearly') {
        totalDays = instances * 365;
      }
      const date = new Date(startDate);
      date.setDate(date.getDate() + totalDays - 1);
      this.standingInstructionsObject.paymentEndDate = date;
    } else if (
      formObject.paymentEndOnWith &&
      this.standingInstructionsObject.paymentEndOnWith === 'Expiry Date' &&
      formObject.frequency &&
      formObject.paymentStartDate &&
      formObject.paymentEndDate
    ) {
      const endDate = new Date(formObject.paymentEndDate);
      const date = new Date(startDate);
      const totalDays = Math.floor(
        (endDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24
      );
     

      let instances = 0;
      if (frequency === 'Daily' || frequency === 'EOD') {
        instances = totalDays+1;
      } else if (frequency === 'Weekly') {
        // instances = Math.round((endDate.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))
        instances = Math.floor(totalDays / 4);
       if (totalDays / 4 < 1) instances = 1;
      } else if (frequency === 'Monthly') {
        instances = Math.floor(totalDays / 30);
        if (totalDays / 30 < 1) instances = 1;
      } else if (frequency === 'Yearly') {
        instances = Math.floor(totalDays / 365);
        if (totalDays / 365 < 1) instances = 1;
      }
      this.standingInstructionsObject.numberOfInstances = instances;
    }
    this.emitFromValues.emit(this.standingInstructionsObject);
  }

  setExpiryForm(option: any): void {
    this.standingInstructionsObject.paymentEndOnWith = option.value;
    if (option.value === 'Number of Instances') {
      this.standingInstructionsObject.paymentEndDate = '';
      this.standingInstructionsObject.paymentEndDateError = '';
      this.standingInstructionsObject.numberOfInstances = '';
    } else if (option.value === 'Expiry Date') {
      this.standingInstructionsObject.numberOfInstances = '';
      this.standingInstructionsObject.numberOfInstancesError = '';
      this.standingInstructionsObject.paymentEndDate = '';
    }
  }

  checkFormValidity(): boolean {
    let isValid: boolean = true;
    const formObject = this.standingInstructionsObject;
    if (
      formObject.frequencyError ||
      formObject.paymentStartDateError ||
      formObject.paymentEndError ||
      formObject.paymentEndDateError
    ) {
      isValid = false;
    }
    return isValid;
  }

  setErrors(): void {
    const formObject = this.standingInstructionsObject;
    if (!formObject.frequency) {
      this.standingInstructionsObject.frequencyError =
        'LBL_CHOOSE_AN_SELECT_OPTION';
    }
    if (!formObject.paymentStartDate) {
      this.standingInstructionsObject.paymentStartDateError =
        'LBL_PLSE_SELECT_FROMDATE';
    }

    if (
      formObject.paymentEndOnWith === 'Expiry Date' &&
      !formObject.paymentEndDate
    ) {
      this.standingInstructionsObject.paymentEndDateError =
        'LBL_PLSE_SELECT_TODATE';
    }

    if (
      formObject.paymentEndOnWith === 'Number of Instances' &&
      !formObject.instances
    ) {
      this.standingInstructionsObject.numberOfInstances =
        'LBL_VALID_INSTANCE_ERROR';
    }

    this.isFormValid = this.checkFormValidity();
  }

  specialCharValidation(val: any) {
    return omit_special_char(val)
   }

   alphabetsValidation(val:any){
    return NumberValidation_Omit_Char(val)
   }
}
