import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { MyTaskService } from '../../services/my-task.service';
@Component({
  selector: 'app-mada-card-reject',
  templateUrl: './mada-card-reject.component.html',
  styleUrls: ['./mada-card-reject.component.scss']
})
export class MadaCardRejectComponent implements OnInit {

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
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  rejectreason: any;
  isrejectreasonValid: boolean = false;
  moduleId: any;
  constructor(private commonService: CommonService, private myTaskService: MyTaskService, private location: Location, private route: Router) {
  }

  ngOnInit(): void {
    //this.getSadadDetails();
    this.selectedTransfer = this.myTaskService.getSelectedElementDetails();
    this.checkAuthorization();
    // console.log(this.selectedTransfer,"TEST::::LL::::")
    // if (this.rootScopeData.myTaskSADADBulkUploadSummaryObject) {
    //   this.selectedTransfer = this.rootScopeData.myTaskSADADBulkUploadSummaryObject;
    // }
    //this.selectedTransfer=this.myTaskService.getSelectedElementDetails();
  }

  onClickSubmit() {
    if (this.rejectreason) {
      // this.constructReceiptData("TBC2112291813533");
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
        REJECT_REASON: this.rejectreason,
      };
      this.isLoadingCompelete = false;

      this.myTaskService.madaCardReject(params).subscribe(
        (res: any) => {
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
        (error: any) => {
          this.isLoadingCompelete = false;
        }
      );
    } else {
      this.rejectReasonType();
    }

  }

  rejectReasonType() {
    this.isrejectreasonValid = this.rejectreason ? false : true;
  }
  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  constructReceiptData(refNumber: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      // msg2: 'LBL_CHANGE_CARD_LIMIT_REQ_REJECTED',
      "referenceNumber": refNumber,
      receiptDetails: [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: this.selectedTransfer.row,
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: this.selectedTransfer?.row.cardName ? this.selectedTransfer.row.cardName : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedTransfer?.row.atmCardNumber ? this.selectedTransfer.row.atmCardNumber : '--',
            }, {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.selectedTransfer?.row.cardType ? this.selectedTransfer.row.cardType : '--',
            }
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_NEW_WITHDRAWAL_LIMIT',
              dataKey: this.selectedTransfer?.row.newLimit ? this.selectedTransfer.row.newLimit : '--',
            },
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
          ],
        },
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "initiateButton": {
        "buttonLabel": "LBL_MAKE_ANOTHER_AUTHORIZATION"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };

    //console.log(this.selectedTransfer, "TEST:::")

    if (this.selectedTransfer.row?.subproductCode === "MADAREQ") {
      this.receiptData.msg2 = "LBL_ADD_CARD_RECEIPT_REJECT";
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
        }, {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
          ],
        },
      ]
    } else if (this.selectedTransfer.row?.subproductCode === "LINKADDI") {
      this.receiptData.msg2 = "LBL_LINK_ADD_ACCOUNT_REJECT";
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
        }, {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
          ]
        }]

    } else if (this.selectedTransfer.row?.subproductCode === "MADREISS") {
      this.receiptData.msg2 = "LBL_CARD_RE_ISSUE_REQ_REJECTED";
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
        }, {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
          ],
        }
      ]
    } else if (this.selectedTransfer.row?.subproductCode === "MADPOSLIM") {
      this.receiptData.msg2 = "LBL_POS_LIMIT_REJECT";
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
        }, {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
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
        }, {
          title: '',
          isTable: 'false',
          data: this.selectedTransfer,
          fieldDetails: [
            {
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectreason ? this.rejectreason : '--',
            }
          ],
        }
      ]
    }
    // console.log(this.receiptData, "TEST:::")
  }

  onBackArrowClick() {
    //this.location.back();
    this.route.navigate(['/mytask/madaCardDetails'])
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/cards/madaCardMyTask'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj = autherizationDetailsObj;
  }

  checkAuthorization() {
    //console.log(this.selectedTransfer)
    var sadad_bulk = this.selectedTransfer
    let data = {
      gcif: "",
      cif: sadad_bulk.cifNo,
      productCode: sadad_bulk.odProductCode,
      subProdCode: sadad_bulk.subProduct,
      funcCode: sadad_bulk.odFunctionCode,
      amount: sadad_bulk.odFileAmount,
      accNo: sadad_bulk.accNo,
      pymntCurrency: sadad_bulk.odTxnCy,
      debitCurrency: sadad_bulk.currency,
      referenceNo: sadad_bulk.odDRefNo
    }
    this.myTaskService.checkAuthorizationData(data).subscribe((res) => {

      if (res) {
        this.sefAuthFlag = res.data.selfAuth
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        // this.isLoadingCompelete = true;
      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
  }

}
