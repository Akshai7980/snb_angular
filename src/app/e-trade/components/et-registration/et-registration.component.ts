import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { ETradeService } from '../../services/e-trade.service';

@Component({
  selector: 'app-et-registration',
  templateUrl: './et-registration.component.html',
  styleUrls: ['./et-registration.component.scss'],
})
export class EtRegistrationComponent implements OnInit {
  isLoadingComplete: boolean = true;
  url: string = systemproperty.termsAndConditionsForStopPayment;
  rootScopeData: RootScopeDeclare = RootScopeData;

  registrationSubmitted: boolean = false;
  proceedForRegistration: boolean = false;

  companyInformation: any;
  userInformation: any;

  otpError: string = '';
  secondAuthRef: any;
  initParam = {
    pdroductCode: 'NBMTRD',
    subPrdCode: 'ETRDREG',
    action: '',
    accNo: '',
    amt: '',
    cif: '',
    unitId: '',
    currency: '',
  };
  otpValue: any;
  receiptObject: any;
  authType: any;
  constructor(private readonly eTradeService: ETradeService) {}

  ngOnInit(): void {
    this.getCompanyInformation();
    this.getUserInformation();
  }

  getCompanyInformation(): void {
    this.isLoadingComplete = false;
    this.eTradeService.getCompanyInformation().subscribe(
      (companyInfo: any) => {
        this.isLoadingComplete = true;
        this.companyInformation = companyInfo.data;
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  getUserInformation(): void {
    this.isLoadingComplete = false;
    this.eTradeService.getUserInformation().subscribe(
      (userInfo: any) => {
        this.isLoadingComplete = true;
        this.userInformation = userInfo.data;
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  proceedRegistration(): void {
    this.proceedForRegistration = true;
  }

  getSecondFactorValue(secondFactorValue: any): void {
    this.secondAuthRef = secondFactorValue.data.secfRefNo;
  }

  getOtpValue(otpValue: string): void {
    if (otpValue) {
      this.otpError = '';
      this.otpValue = otpValue;
      this.submitRegistration();
    } else {
      this.otpValue = '';
      this.otpError = 'LBL_PLS_ENTER_OTP';
    }
  }

  submitRegistration(): void {
    if (this.otpValue && this.otpValue.length === 4) {
      this.isLoadingComplete = false;
      this.eTradeService
        .submitETradeRegistration({
          userInformation: this.userInformation,
          companyInformation: this.companyInformation,
          secondAuthRef: this.secondAuthRef,
          otp: this.otpValue,
          unitId: this.rootScopeData.userInfo.UNIT_ID,
          AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
        })
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;
            if (response && response.dataValue) {
              if (response.dataValue.OD_STATUS === '000') {
                this.constructReceipt(response.dataValue.INPUT_REFERENCE_NO);
                this.registrationSubmitted = true;
              } else if(response.dataValue.OD_STATUS === '001') {

                // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
                this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
              } else {
                this.otpError = response.dataValue.OD_STATUS_DESC;
              }
            }
          },
          (error) => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
    }
  }

  constructReceipt(referenceNumber: string): void {
    this.receiptObject = {
      msg1: 'LBL_REGISTRATION_SUCCESSFUL',
      msg2: 'LBL_REGISTRATION_PENDING_APPROVAL',
      showCallBackComponent: true,
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_COMPANY_INFORMATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CUSTOMER_ID',
              dataKey: this.companyInformation.customerId,
            },
            {
              dispKey: 'LBL_CUSTOMER_NAME',
              dataKey: this.companyInformation.customerName,
            },
            {
              dispKey: 'LBL_BRANCH',
              dataKey: this.companyInformation.branch,
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: '/assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: '/assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
