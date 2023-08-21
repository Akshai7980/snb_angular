import { Component, OnInit } from '@angular/core';
import { TransactionInquiryService} from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-authorize-single-transfer',
  templateUrl: './authorize-single-transfer.component.html',
  styleUrls: ['./authorize-single-transfer.component.scss']
})
export class AuthorizeSingleTransferComponent implements OnInit {
  receiptData:any;
  dataValue:any;
  hideAll = false;
  constructor( public transactionInquiry:TransactionInquiryService) { }

  ngOnInit(): void {
  }
  submit(){
    this.hideAll = true;
    this.transactionInquiry.submittransactionPayment().subscribe(responseobject => {
      if (responseobject.dataValue.OD_STATUS_DESC == "Success") {
        this.constructReceiptData(responseobject.dataValue.INPUT_REFERENCE_NO);
      }
    })
  }
  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1": "ConfirmationLBL_CONFIRMATION",
      "msg2": "LBL_REJECTION_STMT",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": [{}],
          "authorizeButtonRouterPath": "/accounts/generate-statement",
          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": "OD_ACC_NAME"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              "dataKey": "ALIAS_NAME"
            }
          ]
        },
        {
          "title": "LBL_STATEMENT_DETAILS",
          "isTable": "false",
          "fieldDetails": [
            {
              "dispKey": "LBL_PERIOD",
              "dataKey": 'this.periodName'
            },
            {
              "dispKey": "LBL_EXPORT_AS",
              "dataKey": 'this.exportAs'
            }
          ]
        }
      ],
      "printButton":{
        "buttonLabel":"LBL_PRINT_RECEIPT",
        "buttonIcon":"./assets/images/PrinterIcon.png"
      },
      "saveButton":{
        "buttonLabel":"LBL_SAVE_RECEIPT",
        "buttonIcon":"./assets/images/saveReceipt.svg"
      },
      "initiateButton":{
        "buttonLabel":"LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton":{
        "buttonLabel":"LBL_FINISH",
        "buttonPath":"/dashboard"
      }
    };
  }
  
}
