import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AramcoService } from 'src/app/aramco/services/aramco.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { environment } from 'src/environments/environment';
import { delay, retry } from 'rxjs/operators';

@Component({
  selector: 'app-sadad-bulk-debit-payment',
  templateUrl: './sadad-bulk-debit-payment.component.html',
  styleUrls: ['./sadad-bulk-debit-payment.component.scss'],
})
export class SadadBulkDebitPaymentComponent implements OnInit {
  @Input()selectedObj:any
  isLoadingCompelete = false;
  debitDataObj: any;
  isChecked = 'mkpmt';
  selectedDebitObj: any;
  hideAll = false;
  payToObject: any;
  dataSource:any
  billerinformdataSource: any;
  billerName:string="";
  billerId: string = "";
  billerCode: string = "";
  serviceTypeData:any;
  serviceCode:string ="";
  additionalreadOly = true;
  editData = false;
  addtionalData = { date: null, paymentDetails: '', customerRef: '' };
  isProceed: boolean = false;
  moreTransaction = false;
  grandTotal: any;
  receiptData: any;
  transferData: any = [];
  authDataObj: any;
  transferTotal = 0;
  dataSorceToPass: any;
  downloadUrlBasePath: string = '';
  hideContent = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  index = -1;
  sadadMoiFrom: any = [];
  setReadContent = false;
  showBasket = false;
  basketData: any;
  finalBasketData: any;
  fileInfoTable = ['Total Records', 'Total Amount', 'Number of Records'];
  authOptions: any = [];
  proceedStatus: boolean = false;
  UploadfileTitle = 'Upload File';
  file_size = 10;
  filename: string = '';
  selectedBillerObjData: any;
  selectedServiceTypeObjData: any;
  // RJ Start
  fileRefNumber: any;
  // RJ End
  constructor(
    private sadadService: SadadPaymentService,
    private router: Router,
    private aramcoService: AramcoService
  ) {}

  ngOnInit(): void {
    this.displayContent('mkpmt');
    if(this.selectedObj){
      this.dataSource=this.selectedObj
    }
    this.billerinform();
 }

  billerinform() {
    this.isLoadingCompelete = false;
    let param = {
      pageCall : "BULK"
    }
    this.sadadService.getSadadMoiBillerInfo(param).subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerinformdataSource = data.data;
        }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  getDisplayStatus(val: any, comp: any) {
    switch (comp) {
      case 'debitTo':
        this.selectedDebitObj = val;
        break;
      case 'payTo':
        this.payToObject = val;
        if (this.rootScopeData.sadadReset) {
          this.addtionalData = {
            date: null,
            paymentDetails: '',
            customerRef: '',
          };
          this.additionalreadOly = true;
          this.isProceed = false;
          this.rootScopeData.sadadReset = false;
        }
        break;
      case 'authorization':
        this.authDataObj = val;
        break;
      case 'basket':
        this.finalBasketData = val;
        this.transferData = val;
        if (this.rootScopeData.basketEdit != -1) {
          this.editRecord(this.rootScopeData.basketEdit);
        }
        break;
    }
  }

  getDebitData() {
    let moduleId="SADUPLACCLKP "
    this.sadadService.getSadadMOIBulkFileUploadLokupApiCall(moduleId).subscribe(
      (debData: any) => {
        if (debData) {
          this.isLoadingCompelete = true;
          let debitData = debData.DATA.ALL_RECORDS;

          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            }
          }
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: debitData,
            fieldDetails: [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'OD_ACC_NAME',
              },
              {
                dispKey: 'LBL_ACCOUNT_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: 'CURR_AVAIL_BAL_AMT',
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
        }
      },
      (_error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onFileAdded(eventData: { title: string }) {
    //console.log(eventData.title);
    this.filename = eventData.title;
  }

  selectedBillerObj(value: any) {
    this.selectedBillerObjData = value;
    //console.log(this.selectedBillerObjData,'selectedBillerObj- debit');
   }

   selectedServiceTypeObj(value: any) {
    this.selectedServiceTypeObjData = value;
    //console.log(this.selectedServiceTypeObjData,'selectedServiceTypeObj - debit');
   }

  displayContent(value: any) {
    this.isChecked = value;
    if (this.isChecked == 'mkpmt') {
      this.router.navigate(['sadad/sadadMoiBulkPay']);
      this.getDebitData();
    } else if (this.isChecked == 'rfReq') {
      this.router.navigate(['sadad/bulkPayment']);
      this.getDebitData();
    }
  }

  async proceedNext() {
    if (this.moreTransaction && !this.isProceed) {
      this.getTotalAndTransferObj(this.payToObject);
      this.hideContent = true;
      this.showBasket = true;
    } else {
      this.additionalreadOly = false;
    }
    if (this.editData) {
      this.showBasket = true;
      this.hideContent = false;
      // this.rootScopeData.sadadMoiFromRest=true
      this.rootScopeData.sadadMoreTransactionBtn = false;
    }
    this.additionalreadOly = false;
    this.isProceed = true;
    if (this.isChecked == 'rfReq') {
      // this.filePaymentInq();
    }
    this.getAuthorizationData('1000');
     // RJ Start
     let requestObj = {
      fileName: this.filename?this.filename:'',
      fileSize: this.file_size?this.file_size:'',
      // fileType: this.fileFormat?this.fileFormat:'',
      billerId: this.selectedBillerObjData.billerId ? this.selectedBillerObjData.billerId : '',
      billerCode: this.selectedBillerObjData.billerCode ? this.selectedBillerObjData.billerCode : '',
      serviceCode: this.selectedServiceTypeObjData.serviceCode ? this.selectedServiceTypeObjData.serviceCode : '',
      accountNumber: this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '',
      cifNumber: this.selectedDebitObj.COD_CORECIF?this.selectedDebitObj.COD_CORECIF:'',
      // checkSum: this.fileChecksum,
      makerDate: this.selectedDebitObj.DATE_TIME?this.selectedDebitObj.DATE_TIME:'',
      // subPdtCode:this.subPdtCode,
      // actualFileName: this.fileActualName
    }

     await this.sadadService.proceedSadadMOIBulkFileUploadLokupApiCall(requestObj).subscribe(
      (proceedData: any) => {
        // console.log('proceed data : ', proceedData);
        this.fileRefNumber = proceedData.data.REFERENCE_NUM;
        // console.log('proceedData.REFERENCE_NUM : ', this.fileRefNumber);
      },(error: any) => {
        // console.log('Error in proceed data : ', error);
      }
    );

    this.sadadService.fetchFileDetailsByProceedReferenceNumber(this.fileRefNumber)
    .pipe(
      retry(3),
      delay(1000)
   ).subscribe(
      (proceedData: any) => {
        // console.log('proceed data : ', proceedData);
        this.fileRefNumber = proceedData.REFERENCE_NUM;
        
      },(error: any) => {
        // console.log('Error in fetchFileDetailsByProceedReferenceNum : ', error);
      }
    );
    // RJ End
  }

  onSubmit() {
    this.hideAll = true;
    this.hideAll = true;
    this.grandTotal = '10000.00';
    this.constructReceiptData(' 9987462132012345');
  }

  constructReceiptData(refNumber: any) {
    let data: any = [];
    this.receiptData = {
      msg1: 'LBL_PAYMENT_SUCCESSFULL',
      msg2: 'LBL_SADAD_MOI_BULK_PAYMENT_PENDING_APPROVAL',
      referenceNumber: ' 9987462132012345',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedDebitObj],

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'ALIAS_NAME',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: 'ALIAS_NAME',
            },
          ],
        },
        {
          title: 'LBL_BILLER_DETAILS',
          isTable: 'true',
          data: [this.selectedDebitObj],

          fieldDetails: [
            {
              dispKey: 'LBL_BILLER',
              dataKey: 'ALIAS_NAME',
            },
            {
              dispKey: 'LBL_SERVICE_TYPE',
              dataKey: 'OD_ACC_NO',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_FILE_UPLOAD',
              dataKey: this.filename,
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: [this.selectedDebitObj],
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey:
                this.authDataObj === undefined
                  ? 'Not Provided'
                  : this.authDataObj.selectedAprover.AUTH_NAME === undefined &&
                    ''
                    ? 'Not Provided'
                    : this.authDataObj.selectedAprover.AUTH_NAME,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey:
                this.authDataObj === undefined
                  ? 'Not Provided'
                  : this.authDataObj.aproveNote === undefined && ''
                    ? 'Not Provided'
                    : this.authDataObj.aproveNote,
            },
          ],
        }
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
        buttonLabel: 'LBL_MAKE_ANOTHER_PAY',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    
    if (this.isChecked == 'mkpmt') {
      if (this.moreTransaction) {
        this.receiptData.msg2 = 'LBL_LCL_BAK_TRSFR_PNDNG_FR_APPROVAL_MSG';
      } else {
        this.receiptData.msg2 = 'LBL_SADAD_MOI_PMT_PENDNG_FR_APPROVAL_MSG';
      }
    } else if (this.isChecked == 'rfReq') {
      this.receiptData.msg2 = 'LBL_SADAD_MOI_REFND_REQ_PENDNG_FR_APPROVAL_MSG';
    }
  }

  reset() {
    this.debitDataObj = null;
    this.getDebitData();
    this.selectedDebitObj = null;
    this.payToObject = null;
    this.isProceed = false;
    this.additionalreadOly = true;
    this.addtionalData = { date: null, paymentDetails: '', customerRef: '' };
    this.editData = false;
    this.moreTransaction = false;
    this.transferData = [];
    this.dataSorceToPass = [];
    this.rootScopeData.sadadMoiFromRest = false;
    this.rootScopeData.sadadReset = false;
    this.showBasket = false;
    this.hideContent = false;
  }
  addMoreTransaction() {
    this.rootScopeData.sadadMoiFromRest = false;
    this.getTotalAndTransferObj(this.payToObject);
    this.moreTransaction = true;
    this.selectedDebitObj = null;
    this.payToObject = null;
    this.debitDataObj = null;
    this.getDebitData();
    if (!this.editData) {
      this.additionalreadOly = true;
      this.editData = false;
    }
    this.editData = false;
    this.additionalreadOly = true;
    this.addtionalData = { date: null, paymentDetails: '', customerRef: '' };
  }

  getTotalAndTransferObj(obj: any) {
    let formatType = obj[0].amt.slice(-3);
    let amt = obj[0].amt.replace(/([a-zA-Z])/g, '');
    this.transferTotal = this.transferTotal + Number(amt);
    obj[0].from = this.selectedDebitObj;
    obj[0].FULL_NAME = this.selectedDebitObj.FULL_NAME;
    obj[0].additionalData = this.addtionalData;
    obj[0].DEB_AMT = obj[0].amt;
    if (this.editData) {
      this.transferData[this.index] = obj[0];
    } else {
      this.transferData.push(obj[0]);
    }
    this.getBasket();
  }

  deleteRecord(i: any) {
    this.transferTotal = 0;
    this.transferData.splice(i, 1);
    this.transferData.forEach((ele: any) => {
      let formatType = ele.amt.slice(-3);
      let amt = ele.amt.replace(/([a-zA-Z])/g, '');
      this.transferTotal = this.transferTotal + Number(amt);
    });
    if (this.transferData.length == 0) {
      this.reset();
      this.dataSorceToPass = [];
    } else {
      this.dataSorceToPass = this.transferData;
    }
  }
  editRecord(i: any) {
    this.editData = true;
    this.hideContent = false;
    this.isProceed = false;
    this.addtionalData = this.transferData[i].additionalData;
    this.sadadMoiFrom = this.debitDataObj;
    this.rootScopeData.sadadMoreTransactionBtn = false;
    this.sadadMoiFrom['data'] = [this.transferData[i].from];
    this.getDebitData();
    this.payToObject = [this.transferData[i]];
    this.selectedDebitObj = this.transferData[i].from;
    this.index = i;
    this.showBasket = false;
  }
  getBasket() {
    this.basketData = {
      title: 'LBL_FROM',
      data: this.transferData,
      fieldDetails: [
        {
          dispKey: 'LBL_FROM',
          dataKey: 'FULL_NAME',
        },
        {
          dispKey: 'LBL_TO',
          dataKey: 'biller',
        },
        {
          dispKey: 'LBL_DESCRIPTION',
          dataKey: 'nationalId',
          dataKeySupport: 'National ID',
        },
        {
          dispKey: 'LBL_AMOUNT',
          dataKey: 'amt',
        },
        {
          dispKey: 'LBL_DEBIT_AMT',
          dataKey: 'DEB_AMT',
        },
      ],
    };
  }

  getAuthorizationData(amt: any) {
    this.sadadService.flexiAuthorizationSadadMOIFileUpload(this.selectedDebitObj).subscribe(
      (res: any) => {
        this.authOptions = res.data.authList;
      },
      (error: any) => {}
    );
  }

  // onFileUpload() {
  //   this.sadadService.getFileRecords().subscribe(
  //     (debData: any) => {
  //       // console.log('fileupload', debData);
  //     },
  //     (error) => {

  //     }
  //   );
  // }

  // filePaymentInq() {
  //   this.sadadService.getFilePaymentInqApiCall().subscribe(
  //     (debData: any) => {
  //       // console.log('fileupload', debData);
  //     },
  //     (error) => {}
  //   );
  // }

  onClickDownload() 
  {
    this.billerId= this.selectedBillerObjData.billerId;
    this.billerCode=this.selectedBillerObjData.billerCode;
    this.serviceCode=this.selectedServiceTypeObjData.serviceCode
    this.downloadUrlBasePath =`${environment.restDownloadAPI}` + `?moduleId=TMPDOWNLD&subPdt=SADMOIUP&billerId=`+ this.billerId + `&billerCode=`+ this.billerCode +`&serviceCode=`+ this.serviceCode;
    window.open(this.downloadUrlBasePath, '_blank');
 }
}
