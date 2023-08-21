import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-credit-card-show-pin',
  templateUrl: './credit-card-show-pin.component.html',
  styleUrls: ['./credit-card-show-pin.component.scss']
})
export class CreditCardShowPinComponent implements OnInit {

  currentPin: any = ['*', '*', '*', '*'];
  interval: any;
  dialogRef: any;
  pin: string = '';

  constructor(private matDialogRef: MatDialogRef<CreditCardShowPinComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.pin = data.pin
  }

  ngOnInit(): void {
    this.showPin();
  }

  showPin() {
    let count = 0;
    this.interval = setInterval(() => {
      let tempPin: any = ['*', '*', '*', '*'];
      tempPin[count] = this.pin.substring(count, count + 1);
      count++;
      if (count > 3) count = 0;
      this.currentPin = tempPin;
    }, 1000);
  }

  closeModal() {
    clearInterval(this.interval);
    this.matDialogRef.close();
  }

}
