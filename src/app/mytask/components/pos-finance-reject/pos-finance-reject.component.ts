import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-pos-finance-reject',
  templateUrl: './pos-finance-reject.component.html',
  styleUrls: ['./pos-finance-reject.component.scss'],
})
export class PosFinanceRejectComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  rejectreason: string = '';
  isrejectreasonValid: boolean = false;
  showReceipt: boolean = false;
  receiptData: any;
  posFinanceRequestMytaskSummaryDetails: any;
  rejectRes: any;

  constructor(private router: Router, private mytaskService: MyTaskService) {
    this.posFinanceRequestMytaskSummaryDetails =
      this.rootScopeData.posFinanceRequestMytaskSummaryDetails;
    if (this.posFinanceRequestMytaskSummaryDetails === '') {
      this.router.navigate(['/mytask/posFinance']);
    }
  }

  ngOnInit(): void {}
  textArea_Click() {
    this.isrejectreasonValid = this.rejectreason ? false : true;
  }
  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  submit() {
    if (this.rejectreason) {
      const params = {
        TXN_REF_NUM: this.posFinanceRequestMytaskSummaryDetails.res.RefNo,
        INPUT_VER_NO:
          this.posFinanceRequestMytaskSummaryDetails.res.inputVersionNo,
        REJECT_REASON: this.rejectreason,
      };

      this.mytaskService.posFinanceAuthorized(params).subscribe(
        (response: any) => {
          this.rejectRes = response.dataValue;

          if (response.dataValue.STATUS === 'Success') {
            this.showReceipt = true;
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
          }
        },
        () => {}
      );
    } else {
      this.showReceipt = false;
      this.textArea_Click();
    }
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_YOUR_POS_FINANCE_REQUEST_IS_REJECTED',
      referenceNumber: refNumber ? refNumber : '--',

      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.posFinanceRequestMytaskSummaryDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '--',
            },
            {
              dispKey: 'LBL_Account_Number',
              dataKey: this.posFinanceRequestMytaskSummaryDetails.res.accNo
                ? this.posFinanceRequestMytaskSummaryDetails.res.accNo
                : '--',
            },
            {
              dispKey: 'LBL_NICK_NAME',
              dataKey: this.posFinanceRequestMytaskSummaryDetails.res.makerName
                ? this.posFinanceRequestMytaskSummaryDetails.res.makerName
                : '--',
            },
          ],
        },

        {
          title: 'LBL_ADDITIONAL_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason,
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
        buttonLabel: 'LBL_GENERATE_ANOTHER_STATEMENT',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
  }

  initiateAnotherRequest() {
    this.router.navigate(['/mytask/posFinance']);
  }
}
