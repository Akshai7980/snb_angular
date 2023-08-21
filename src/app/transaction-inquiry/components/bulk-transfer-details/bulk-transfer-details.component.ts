import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
// import { getPdf } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { PeriodicElementDuplicate } from 'src/app/common-components/components/duplicate-records/duplicate-records.component';
const FILE_TRANSFER_PATH = 'transactionInquiry/bulkTransfer';

@Component({
  selector: 'app-bulk-transfer-details',
  templateUrl: './bulk-transfer-details.component.html',
  styleUrls: ['./bulk-transfer-details.component.scss'],
})
export class BulkTransferDetailsComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowAndHistoryParams: any;
  printDomWithId: string = 'fileTransferDetails';
  moduleId: string = 'SADRECSUMY';
  sortOptions: any = [];
  showRecordSummary: boolean = false;
  selectedTransfer: any = {};
  recordSummaryObject: any = {};
  fileStatus:string='';
  referenceNo: string = '';
  pdfData:any;
  recordArray:any =[];
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  pdfType:string="save";
  duplicateRecordList: any =[];
  dupDetailsList: any;
  fromRow: any;
  toRow: any;
  totalrecords: any;
  pageName:any;
  saveReceiptObject:any;
  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private transactionInqService: TransactionInquiryService,
    private downloadAsPdf:downloadAsPdf,

  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.sadadBillerSummaryObject) {
      this.selectedTransfer = this.rootScopeData.sadadBillerSummaryObject;
      this.setWorkFlowAndHistoryParams();
      if (
        this.selectedTransfer.odSubprodCode === 'SADPAYUP' ||
        this.selectedTransfer.odSubprodCode === 'SADMOIUP'
      ) {
        this.moduleId = 'SADRECSUMY';
        this.getRecordSummaryDataSadad({
          sortColumn: 'transactionId',
          sortOrder: 'desc',
          fromRow: 1,
          toRow: totalRecordsPerRequest,
        });
      } else if (
        this.selectedTransfer.odSubprodCode === 'SALPAY' ||
        this.selectedTransfer.odSubprodCode === 'WPSUP'
      ) {
        this.moduleId = 'PAYROLTXNS';
        this.getRecordSummaryDataFileUpload({
          sortColumn: 'transactionId',
          sortOrder: 'desc',
          fromRow: 1,
          toRow: totalRecordsPerRequest,
        });
        this.fetchDuplicateFileDetails();
      }
    } else {
      this.routeToTransfers();
    }
    this.pageName='Inquiry';
    this.sendDataForPrintandPdf();
  }

  sendDataForPrintandPdf(){
    let currencyFormat=new CurrencyFormatPipe()
    let dateFormat=new DateFormatPipe()
    let Amount = (this.selectedTransfer?.odFileAmount) ? (currencyFormat.transform(this.selectedTransfer?.odFileAmount , this.selectedTransfer?.odTxnCy) )+ " " + (this.selectedTransfer?.odTxnCy ? this.selectedTransfer.odTxnCy : '') : "--" ;
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_FILE_TRANSFER_SUMMARY"),
      "subHeading": this.translateService.instant("LBL_TRANSFER_DETAILS"),
      "Description": this.selectedTransfer?.odStatus ? this.selectedTransfer.odStatus : "--",
      "keyValues": [
        {
          "subHead": "Account Number",
          "subValue": this.selectedTransfer?.accNo ? this.selectedTransfer.accNo : "--"
        },
        {
          "subHead": "File Name",
          "subValue": this.selectedTransfer?.odFileName ? this.selectedTransfer.odFileName : "--"
        },
        {
          "subHead": "File Format",
          "subValue": (this.selectedTransfer?.fileFormat ? (this.selectedTransfer.fileFormat) : "--")
        },
        {
          "subHead": "Amount",
          "subValue": Amount ? Amount : "--"
        },
        {
          "subHead": "Date",
          "subValue": (this.selectedTransfer?.odMakerDate ? (dateFormat.transform(this.selectedTransfer.odMakerDate)) : "--")
        }
      ],
      "pagecall":"filetransferdetails",
      "refNo":this.selectedTransfer?.odDRefNo ? this.selectedTransfer.odDRefNo : "--"
    }
  }

  getRecordSummaryDataSadad(data: any): void {
    this.referenceNo = this.selectedTransfer?.odDRefNo ? this.selectedTransfer.odDRefNo : '';
    const params = {
      moduleId: this.moduleId,
      subPdt: this.selectedTransfer?.odSubprodCode
        ? this.selectedTransfer.odSubprodCode
        : '',
      functionCode: this.selectedTransfer?.odFunctionCode
        ? this.selectedTransfer.odFunctionCode
        : '',
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      odDRefNo: this.selectedTransfer?.odDRefNo
        ? this.selectedTransfer.odDRefNo
        : '',
      productName: this.selectedTransfer?.odProductCode
        ? this.selectedTransfer.odProductCode
        : '',
      fileSeqNo:this.selectedTransfer?.fileSeqNo?this.selectedTransfer.fileSeqNo:'',
      transactionRefNo: this.selectedTransfer?.transactionRefNo?this.selectedTransfer.transactionRefNo:'',
      fileType:this.selectedTransfer?.fileType?this.selectedTransfer.fileType:'',
      accNo:this.selectedTransfer?.accNo?this.selectedTransfer.accNo:'',
      pageName:this.pageName ? this.pageName : ''
      
    };
    this.isLoadingComplete = false;

    this.transactionInqService.getRecordSummary(params).subscribe(
      (records: any) => {
        this.isLoadingComplete = true;
        if (records.data) {
          this.recordArray = this.recordArray.concat(records.data)
          this.sortOptions = records.headerValue;
          this.recordSummaryObject = {
            data: this.recordArray,
            displayDetails: [
              {
                displayLabel: 'LBL_Transaction_Id',
                displayKey: 'transactionId',
              },
              {
                displayLabel: 'LBL_BILLER',
                displayKey: 'biller',
              },
              {
                displayLabel: 'LBL_SERVICE_TYPE',
                displayKey: 'service',
              },
              {
                displayLabel: 'LBL_ACCOUNT',
                displayKey: 'debitAcc',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'payAmt',
                type:'amount',
                supportValue: 'ccy'              
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
              {                
                displayLabel: 'LBL_RJCT_RSN',
                displayKey: 'rejectReason',
              }
            ],
          };
        }
        this.showRecordSummary = true;
      },
      () => {
        this.isLoadingComplete = true;
        this.showRecordSummary = false;
      }
    );
  }

  getRecordSummaryDataFileUpload(data?: any) {
    this.isLoadingComplete = false;
    const params = {
      refNo: this.selectedTransfer?.odDRefNo
        ? this.selectedTransfer?.odDRefNo
        : '',
      subPdt: this.selectedTransfer?.odSubprodCode
        ? this.selectedTransfer?.odSubprodCode
        : '',
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      pageName: 'Inquiry'
    };
    this.transactionInqService.getTransactionList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.data) {
          this.fileStatus = res.fileData.fileStatus;
          this.recordArray = this.recordArray.concat(res.data)
          this.sortOptions = res.headerValue;
          this.recordSummaryObject = {
            data: this.recordArray,
            displayDetails: [ 
              {
                displayLabel: 'LBL_TRANSACTION_REF',
                displayKey: 'txnId',
              },
              {
                displayLabel: 'LBL_CREDIT_ACCOUNT',
                displayKey: 'beneAccNo',
              },
              // {
              //   displayLabel: 'LBL_DEBIT_ACCOUNT',
              //   displayKey: 'accNo',
              // },
              {
                displayLabel: 'LBL_TYPE',
                displayKey: 'payType',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'payAmt',
                type:'amount',
                supportValue: 'ccy'  
              },
              // {
              //   displayLabel: 'LBL_RJCT_RSN',
              //   displayKey: 'rejectReason',
              // },
              {
                displayLabel: 'LBL_UTI',
                displayKey: 'utiReference',
              },
              {
                displayLabel: 'LBL_CHILD_REFERENCE',
                displayKey: 'childReference',
              },
              {
                displayLabel: 'LBL_DATE',
                displayKey: 'valueDate',
                type: 'date',
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
            ],
          };
          this.showRecordSummary = true;
        }
      },
      (error: any) => {
        this.showRecordSummary = false;
        this.isLoadingComplete = true;
      }
    );
  }

  onSortColumn(details: any): void {
    this.getRecordSummaryDataSadad(details);
  }

  onSortColumnDup(details: any){
    this.fromRow = details.fromRow;
    this.toRow = details.toRow;
    this.fetchDuplicateFileDetails();
  }

  setWorkFlowAndHistoryParams(): void {
    this.workFlowAndHistoryParams = {
      refNum: this.selectedTransfer?.odDRefNo
        ? this.selectedTransfer.odDRefNo
        : '',
      productCode: this.selectedTransfer?.odProductCode
        ? this.selectedTransfer.odProductCode
        : '',
      subProductCode: this.selectedTransfer?.odSubprodCode
        ? this.selectedTransfer.odSubprodCode
        : '',
      functionCode: this.selectedTransfer?.odSubprodCode
        ? (this.selectedTransfer.odSubprodCode === 'WPSUP'
            ? 'WPSINI'
            : 'BULKUP') ||
          (this.selectedTransfer.odSubprodCode === 'SADPAYUP' ?? 'SADPAYUP')
        : '',
    };
  }

  routeToTransfers(): void {
    this.router.navigate([FILE_TRANSFER_PATH]);
  }

  selectDetailsPagePrint(){
    this.printPdf('fileTransferDetails','print');
  }

  printPdf(sectionId: any,printType :any) {
    let currencyFormat=new CurrencyFormatPipe()
    let dateFormat=new DateFormatPipe()
    let Amount = (this.selectedTransfer?.odFileAmount) ? (currencyFormat.transform(this.selectedTransfer?.odFileAmount , this.selectedTransfer?.odTxnCy) )+ " " + (this.selectedTransfer?.odTxnCy ? this.selectedTransfer.odTxnCy : '') : "--" ;
    this.pdfData = 
    [
      { type:'setFontSize', size:11},
      { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
      { type:'setTextColor', val1:0, val2:0, val3:0},
      { type: 'title', value:"File Transfer Summary", x:85, y:35},
      { type:'setFontSize', size:10},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type:'setFontSize', size:10},
      { type: 'setFillColor', val1:128, val2:128, val3:128},
      { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
      { type:'setTextColor', val1:255, val2:255, val3:255},
      { type:'setFontSize', size:10},
      { type: 'heading', value:'Transfer Details', y:55},
      { type:'setTextColor', val1:0, val2:0, val3:0}, 
      { type:'setFontSize', size:9},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
      { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:65},
      {type:'text', value: this.selectedTransfer?.accNo ? this.selectedTransfer.accNo : "--", y:65},
      { type: 'heading', value:this.translateService.instant('LBL_FILE_NAME'), y:75},
      {type:'text', value:this.selectedTransfer?.odFileName ? this.selectedTransfer.odFileName : "--", y:75},
      { type: 'heading', value:this.translateService.instant('LBL_FILE_FORMAT'), y:85},
      {type:'text', value:(this.selectedTransfer?.fileFormat ? (this.selectedTransfer.fileFormat) : "--"), y:85},
      { type: 'heading', value:this.translateService.instant('Amount'), y:95},
      { type: 'text', value: Amount ? Amount : "--" , y:95},
      { type: 'heading', value:this.translateService.instant('Date'), y:105},
      { type: 'text', value: (this.selectedTransfer?.odMakerDate ? (dateFormat.transform(this.selectedTransfer.odMakerDate)) : "--") , y:105},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
      { type: 'text', value: this.selectedTransfer?.odDRefNo ? this.selectedTransfer.odDRefNo : "--", y:115},
      { type: 'heading', value: this.translateService.instant('LBL_FILE_STATUS') , y:125},
      { type: 'text', value: this.selectedTransfer?.odStatus ? this.selectedTransfer.odStatus : "--", y:125},
    ]

    this.pdfData.push(
      { type: printType, value:'fileTransfer.pdf'}
    )
   this.downloadAsPdf.downloadpdf(this.pdfData);
}

fetchDuplicateFileDetails() {
  let data: any = {
    functionCode: this.selectedTransfer.odFunctionCode,
    fromAccountId:
      this.selectedTransfer.fileFormat === 'csv'
        ? this.selectedTransfer.accNo
        : '',
    fileType: this.selectedTransfer.fileFormat,
    totalAmount: this.selectedTransfer.acceptAmt,
    totalRecords: this.selectedTransfer.odNoOfTrans,
    noOfDays: 30,
    subProductCode: this.selectedTransfer.odSubprodCode,
    txnRefNo: this.selectedTransfer.odDRefNo,
    fromRow: this.fromRow,
    toRow: this.toRow,
    pageName:'checkDuFileInq'
  };
  this.dupDetailsList = data;
  this.transactionInqService.getDuplicateFileApi(data).subscribe(
    (res: any) => {
      if (res.data?.records) {
        this.totalrecords = res.headerValue.totalCount;
        let dataList: any = [];
        res.data?.records.forEach((element: any) => {
          let data: PeriodicElementDuplicate = {
            transactionId: element.transactionId,
            requester: '-',
            accNo: element.fromAccountId,
            valueDate: element.valueDate,
            row: element.fileSeqNo,
            amount: element.totalAmount,
            subType: element.fileType,
            orderDate: element.orderDate,
            reject: '-'
          };
          dataList.push(data);
        });
        this.duplicateRecordList = dataList;
      }
    },
    (error: any) => {}
  );
}
}

