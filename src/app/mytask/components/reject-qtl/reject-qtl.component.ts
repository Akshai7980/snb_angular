import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reject-qtl',
  templateUrl: './reject-qtl.component.html',
  styleUrls: ['./reject-qtl.component.scss']
})
export class RejectQtlComponent implements OnInit {
  rejectreason: string = '';
  isrejectreasonValid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(private myTaskService: MyTaskService, private location: Location, private route: Router,private translateService : TranslateService) {
  }

  ngOnInit(): void {
  }

  textArea_Click() {
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit() {
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    if (!this.isrejectreasonValid) {
      let params = {
        refNumber: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REF_NO,
        productCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_PRODUCT_CODE,
        subProductCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_SUBPROD_CODE,
        action: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_FUNCTION_ID,
        versionNumber: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_VERSION_NO,
        hostCode: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACTION,
      }
      this.isLoadingCompelete = false;
      this.myTaskService.ipsRegDeRegAndQTLRejectAPICall(params, this.rejectreason).subscribe(
        (response: any) => {
          this.isLoadingCompelete = true;
          if (response.dataValue.STATUS === "Success") {
            this.constructReceiptData(response.dataValue.INTERNAL_REFERENCE_NO);
            this.receiptForm = true;
          }

        },
        error => {
          this.isLoadingCompelete = true;

        }
      )
    }
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_ITL_REJECTED",
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "false",
          "data": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACCOUNT_NAME",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
            }
          ]
        }
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

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REJECT_INSTANT_TRANSFER_LIMIT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ITL_REJECTED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME : "--"
        }
      ],
      "pagecall":"IPSRegAuth",
      "refNo":refNumber
    }
  }

  onBackArrowClick() {
    this.location.back();
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/instantTransferManagement'])
  }

}
