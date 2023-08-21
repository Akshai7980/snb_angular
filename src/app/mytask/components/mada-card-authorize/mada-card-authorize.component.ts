import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-mada-card-authorize',
  templateUrl: './mada-card-authorize.component.html',
  styleUrls: ['./mada-card-authorize.component.scss'],
})
export class MadaCardAuthorizeComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid: any;
  selectedTransfer: any;
  sefAuthFlag: any;
  authOptions: any;
  authDataObj: any;
  errorCode: string = '';
  moduleId: any;

  constructor(
    private commonService: CommonService,
    private myTaskService: MyTaskService,
    private location: Location,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.selectedTransfer = this.myTaskService.getSelectedElementDetails();
    this.getAuthorizationData();
    // console.log(this.selectedTransfer, ' this.selectedTransfer');
  }

  onClickSubmit() {
    // this.constructReceiptData('TBC2112291813533');
    // this.receiptForm = true;
    if (this.selectedTransfer.row?.subProductCode === 'MADSTOP') {
      this.moduleId = 'STMDCDAUTH';
    }
    else if (this.selectedTransfer.row?.subProductCode === "MADPOSLIM") {
      this.moduleId = 'MGPULTAUTH';
    }
    else if (this.selectedTransfer.row?.subProductCode === 'MADREISS') {
      this.moduleId = 'REMDCRDAUTH';
    }
    else if (this.selectedTransfer.row?.subProductCode === 'LINKADDI') {
      this.moduleId = 'LKADDACCAUTH';
    }
    else if (this.selectedTransfer.row?.subProductCode === 'MADAREQ') {
      this.moduleId = 'NEWCDAUTH';
    }

    let params = {
      moduleId: this.moduleId,
      INPUT_FUNCTION_CODE: this.selectedTransfer.row?.functionCode,
      INPUT_PRODUCT: this.selectedTransfer.row?.productCode,
      INPUT_SUB_PRODUCT: this.selectedTransfer.row?.subproductCode,
      TXN_REF_NUM: this.selectedTransfer.row?.refNo,
      INPUT_VER_NO: this.selectedTransfer.row?.versionNo,
    };
    this.isLoadingCompelete = false;

    this.myTaskService.madaCardAuthorize(params).subscribe(
      (res) => {
        this.isLoadingCompelete = true;

        let vdata: any = [];
        vdata = res;
        if (vdata.dataValue.STATUS === 'Success') {
          this.constructReceiptData(vdata.dataValue.SELECTED_RECORDS);
          this.receiptForm = true;
        } else {
          this.isLoadingCompelete = false;
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
  }

  constructReceiptData(refNumber: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      referenceNumber: refNumber,
      receiptDetails: [],
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

    if (this.selectedTransfer.row?.subproductCode === "MADAREQ") {
      this.receiptData.msg2 = "LBL_ADD_CARD_RECEIPT_AUTHORIZE";
      this.receiptData.receiptDetails = [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: userId,
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: this.selectedTransfer.row?.accNo,
            }
          ],
        },{
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.selectedAprover.AUTH_NAME
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.aproveNote
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote,
            },
          ],
        }
      ]
    } else if (this.selectedTransfer.row?.subproductCode === "LINKADDI") {
      this.receiptData.msg2 = "LBL_LINK_ADD_ACCOUNT_AUTHORIZE";
      this.receiptData.receiptDetails = [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedTransfer.row?.cardName ? this.selectedTransfer.row?.cardName : "--",
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedTransfer.row?.cardNo ? this.selectedTransfer.row?.cardNo : "--",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedTransfer.row?.expiryDate ? this.selectedTransfer.row?.expiryDate : "--",
            }
          ],
        },
        {
          title: 'LBL_PRIMARY_ACC',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: this.selectedTransfer?.cardName ? this.selectedTransfer?.cardName : "--",
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: this.selectedTransfer?.accNo ? this.selectedTransfer?.accNo : "--",
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: this.selectedTransfer?.cardName ? this.selectedTransfer?.cardName : "--",
            }]
        },
        {
          "title": "LBL_SECONDARY_ACC",
          isTable: 'true',
          data: this.selectedTransfer?.secondaryAccount,
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: 'accName',
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: 'accNo',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'accName',
            }
          ],
        },{
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.selectedAprover.AUTH_NAME
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.aproveNote
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote,
            },
          ],
        }]

    } else if (this.selectedTransfer.row?.subproductCode === "MADREISS") {
      this.receiptData.msg2 = "LBL_CARD_RE_ISSUE_REQ_AUTHORIZED";
      this.receiptData.receiptDetails = [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: userId,
            },
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedTransfer?.row.cardName ? this.selectedTransfer?.row.cardName : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedTransfer?.row.cardNo ? this.selectedTransfer?.row.cardNo : "--",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedTransfer?.row.expiryDate ? this.selectedTransfer?.row.expiryDate : "--",
            }
          ],
        },{
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.selectedAprover.AUTH_NAME
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.aproveNote
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote,
            },
          ],
        }
      ]
    } else if (this.selectedTransfer.row?.subproductCode === "MADPOSLIM") {
      this.receiptData.msg2 = "LBL_POS_LIMIT_AUTHORIZE";
      this.receiptData.receiptDetails = [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedTransfer?.row.cardName ? this.selectedTransfer?.row.cardName : "--",
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedTransfer?.row.cardNo ? this.selectedTransfer?.row.cardNo : "--",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedTransfer?.row.expiryDate ? this.selectedTransfer?.row.expiryDate : "--",
            }
          ]
        },{
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.selectedAprover.AUTH_NAME
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.aproveNote
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote,
            },
          ],
        }
      ]
    } else if (this.selectedTransfer.row?.subproductCode === "MADSTOP") {
      this.receiptData.msg2 = "LBL_STOP_CARD_REQ_AUTHORIZED";
      this.receiptData.receiptDetails = [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedTransfer?.row.cardName ? this.selectedTransfer?.row.cardName : "--",
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedTransfer?.row.cardNo ? this.selectedTransfer?.row.cardNo : "--",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedTransfer?.row.expiryDate ? this.selectedTransfer?.row.expiryDate : "--",
            }
          ]
        },{
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.selectedAprover.AUTH_NAME
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: !this.authDataObj
                ? 'Not Provided'
                : !this.authDataObj.aproveNote
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote,
            },
          ],
        }
      ]
    }
  }

  onBackArrowClick() {
    this.route.navigate(['/mytask/madaCardDetails']);
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/cards/madaCardMyTask']);
  }

  getAuthorizationData() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      productCode: this.selectedTransfer.row?.productCode,
      subProdCode: this.selectedTransfer.row?.subproductCode,
      funcCode: this.selectedTransfer.row?.functionCode,
    };
    this.myTaskService.MadaCardSelfAuthCheck(params).subscribe(
      (res: any) => {
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          if (res.data.selfAuth === 'true') {
            this.sefAuthFlag = res.data.selfAuth;
          }
          if (res.data.flexiAuth === 'true') {
            this.authOptions = res.data.authList;
          }
        }
      },
      (error) => { }
    );
  }

  setAuthorizationData(authorDetails: any): void {
    this.authDataObj = authorDetails;
  }

  getDatas(event: any, filed: string) {
    switch (filed) {
      case 'authorization':
        this.authDataObj = event;
        break;
    }
  }
}
