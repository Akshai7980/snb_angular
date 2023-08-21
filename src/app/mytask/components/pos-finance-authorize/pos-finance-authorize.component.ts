import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-pos-finance-authorize',
  templateUrl: './pos-finance-authorize.component.html',
  styleUrls: ['./pos-finance-authorize.component.scss'],
})
export class PosFinanceAuthorizeComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  otpError: string | undefined;
  secAuthRef: any;
  userOtpValue: any = '';
  showReceipt: boolean = false;
  receiptData: any;
  posFinanceRequestMytaskSummaryDetails: any;
  isSelfAuth: boolean = false;
  authDataObj: any;
  authorsList: any = [];
  authroizeRes: any;
  url = systemproperty.termsAndConditionsLinkForBenUpload;
  constructor(private router: Router, private mytaskService: MyTaskService) {
    this.posFinanceRequestMytaskSummaryDetails =
      this.rootScopeData.posFinanceRequestMytaskSummaryDetails;
    if (this.posFinanceRequestMytaskSummaryDetails === '') {
      this.router.navigate(['/mytask/posFinance']);
    }
    this.getAuthors();
  }

  ngOnInit(): void {}
  setAuthorizationDetails(details: any): void {
    this.authDataObj = details;
  }

  getAuthors(): void {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.mytaskService.posFinanceAuth(params).subscribe(
      (authors: any) => {
        if (authors.data.flexiAuth == 'true') {
          this.authorsList = authors.data.authList;
        }
      },
      () => {}
    );
  }

  submit(): void {
    const params = {
      TXN_REF_NUM: this.posFinanceRequestMytaskSummaryDetails.res.RefNo,
      INPUT_VER_NO:
        this.posFinanceRequestMytaskSummaryDetails.res.inputVersionNo,
      SEL_PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
      SECOND_AUTH:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      USER_NUMBER_LIST:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.OD_USER_NO
          : '',
    };

    this.mytaskService.posFinanceAuthorized(params).subscribe(
      (response: any) => {
        this.authroizeRes = response.dataValue;

        if (response.dataValue.STATUS === 'Success') {
          this.showReceipt = true;
          this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
        }
      },
      () => {}
    );
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_YOUR_POS_FINANCE_REQUEST_IS_AUTHORIZED',
      referenceNumber: refNumber,

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
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey:
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.selectedAprover.AUTH_NAME
                  ? this.authDataObj.selectedAprover.AUTH_NAME
                  : 'Not Provided',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey:
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.aproveNote
                  ? this.authDataObj.aproveNote
                  : 'LBL_NOT_PROVIDED',
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

    this.isSelfAuth.toString() === 'false' &&
      this.receiptData.receiptDetails.push({
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: this.authroizeRes.STATUS ? this.authroizeRes.STATUS : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: '--',
          },
        ],
      });
  }

  initiateAnotherRequest() {
    this.router.navigate(['/mytask/posFinance']);
  }
}
