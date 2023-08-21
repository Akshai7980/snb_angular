import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-delete-review',
  templateUrl: './terminal-delete-review.component.html',
  styleUrls: ['./terminal-delete-review.component.scss'],
})
export class TerminalDeleteReviewComponent implements OnInit {
  url: string = '';
  showReceipt: boolean = false;
  receiptData: any;
  constructor(private route: Router) {}

  ngOnInit(): void {}

  submit() {
    this.showReceipt = true;
    this.constructReceiptData('9987462132012345');
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCSFL',
      msg2: 'LBL_YOUR_DELETE_REQUEST_FOR_TERMINAL_IS_PENDING_FOR_APPROVAL',
      referenceNumber: refNumber,
      authorizeButtonRouterPath: '/mytask/serviceRequest',
      finishButtonRouterPath: '/dashboard',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'Dameer Ahsan',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'SA 1010 0100 1000 0000123',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'Dameer',
            },
          ],
        },
        {
          title: 'LBL_MERCHANT_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_NAME',
              dataKey: 'Dameer Ahsan',
            },
            {
              dispKey: 'LBL_TERMINAL_CITY',
              dataKey: 'Abha',
            },
            {
              dispKey: 'LBL_SHOP_NAME',
              dataKey: 'Zamzam Water',
            },
          ],
        },
        {
          title: 'Terminal Details',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_USER_ID',
              dataKey: 'Adhara Alam',
            },
            {
              dispKey: 'LBL_DATE_OF_BIRTH',
              dataKey: '24/04/1985',
            },
            {
              dispKey: 'LBL_MOBILE',
              dataKey: '+966 00966 1 2411681',
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: 'Abdus Kamal',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: '',
              dataKey: '',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_AUTHORIZATION',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
  }

  initiateAnotherRequest() {
    this.route.navigate(['/pos/posTerminalManagement']);
  }
}
