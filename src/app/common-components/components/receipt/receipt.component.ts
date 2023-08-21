import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// import { jsPDF } from 'jspdf';
// import domtoimage from 'dom-to-image';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  
  // displayedColumns: string[] = ['actionby', 'accountnumber', 'shortname'];
  // displayedColumns1: string[] = ['name', 'duedate', 'amount'];
  printSection:string="";
  logo :string ="";
  @Input() receiptDetails: any;
  @Input() saveReceiptObject: any;
  @Input() pageName: any;
  @Input() ChannelId: any;
  @Output() onInitAgainClick = new EventEmitter;
  @Output() DownloadReceiptClick = new EventEmitter; 
  @Output() downloadFromApi = new EventEmitter; 
  callBackComponentParams: any;
  beneSummary:boolean = false;
  authorizeParams:any;
  @Input() hideButton : any = false;
  rootScopeData: RootScopeDeclare = RootScopeData
  beneficaiaryActivation="beneficiary";
  showViewPin: boolean = true;
  @Output() viewPinEmit = new EventEmitter;
  @Input() finishButtonActive : boolean = true;
  @Input() downloadButtonActive : boolean = false;
  @Output() cancelCallBck = new EventEmitter;
  disableBtn: boolean = false;
  @Input() rejectMsg : boolean = false;
  constructor(private translateService:TranslateService,private service:CommonService) {this.logo = logoprint(); }

  ngOnInit(): void {
    this.printSection="receiptConatiner";
    let shortName;
    let accNumber;
    if(this.receiptDetails.showCallBackComponent){
      this.disableBtn = true;
      this.hideButton = true;
      for(let i=0;i< this.receiptDetails.receiptDetails.length;i++){
        if(this.receiptDetails.receiptDetails[i].data.shortName){
          shortName =this.receiptDetails.receiptDetails[i].data.shortName;
        }
        if(this.receiptDetails.receiptDetails[i].data.accNumber){
          accNumber =this.receiptDetails.receiptDetails[i].data.accNumber;
        }
      }

    this.callBackComponentParams=[{
      refNumber : this.receiptDetails.referenceNumber,
      beneId : shortName ? shortName : (this.receiptDetails.beneFullName ? this.receiptDetails.beneFullName : ""),
      beneSummary : this.receiptDetails.beneSummary
    }]
    this.authorizeParams={
      accNumber:accNumber,
      refNumber:this.receiptDetails.referenceNumber,
      subProductCode:this.receiptDetails.subProductCode,
      beneId:shortName,
      beneName:this.receiptDetails.beneFullName,
      aliasName:shortName,
      otp:"",
      authRef:"",
      remarks:"",
      selectedRec:"",
      PARSED_RULE_ID:"",
      SELECTION_FLAG:"",
      USER_NUMBER_LIST:"",
      sefAuthFlag:""
    }
    }
  }

  initAgain() {
    this.onInitAgainClick.emit();
  }
 
  // dataSource:any=[
  //   {actionby: 'Dameer Ahsan', accountnumber: 'SA 1010 0100 1000 0000123', shortname: 'Dameer'}
  // ];

  // dataSource1:any=[
  //   {name: 'Saudi Mobily Company', duedate: '30/12/2021', amount: '1,000.00 SAR'},
  //   {name: 'Saudi Telecom Company', duedate: '30/12/2021', amount: '1,000.00 SAR'},
  //   {name: 'Saudi Electricity Company', duedate: '30/12/2021', amount: '1,000.00 SAR'},
  // ];

  toPdf() {
      // this.DownloadReceiptClick.emit('save');
      // let valueArray = [];
      // for(let i=0;i< this.receiptDetails.receiptDetails.length;i++){
      //  let dataObj = {
      //     "subHead": this.translateService.instant(this.receiptDetails.receiptDetails[i].fieldDetails[i].dispKey),
      //     "subValue": ""
      //   }
      //   valueArray.push(dataObj)
      //   for(let j=0;j< this.receiptDetails.receiptDetails[i].fieldDetails.length;j++){
      //    dataObj = {
      //       "subHead": this.translateService.instant(this.receiptDetails.receiptDetails[i].fieldDetails[j].dispKey),
      //       "subValue":   
      //     }
      //     valueArray.push(dataObj)
      //   }
      //     // this.receiptDetails.receiptDetails[i].data;
      // }
      let params={
        "pageheading": this.saveReceiptObject.pageheading,
        "subHeading": this.saveReceiptObject.subHeading,
        "Description": this.saveReceiptObject.Description,
        "keyValues": this.saveReceiptObject.keyValues,
        "Pagecall":this.saveReceiptObject.pagecall,
        "refNo":this.saveReceiptObject.refNo,
        "addDynamicHead":this.saveReceiptObject.addDynamicHead ? this.saveReceiptObject.addDynamicHead : "",
        "addDynamicValue":this.saveReceiptObject.addDynamicValue ? this.saveReceiptObject.addDynamicValue : "",
        "arrayList":this.saveReceiptObject.ArrayData ? this.saveReceiptObject.ArrayData : ""
      }
      this.service.saveReceiptScreenAPI(params).subscribe((res:any)=>{
        const src = 'data:application/'+"PDF"+';base64,'+ res.fileContent; // contentType of File pdf/csv/xls
          const link = document.createElement("a")
          link.href = src
          link.download = res.fileName; //Dynamic FileName
          link.click();
          link.remove();
        
      })

  }

  downloadButton(){
    this.downloadFromApi.emit();
  }

onPrintEventTrigger(divName :any){

  // this.DownloadReceiptClick.emit('print');
  let params={
    "pageheading": this.saveReceiptObject.pageheading,
    "subHeading": this.saveReceiptObject.subHeading,
    "Description": this.saveReceiptObject.Description,
    "keyValues": this.saveReceiptObject.keyValues,
    "Pagecall":this.saveReceiptObject.pagecall,
    "refNo":this.saveReceiptObject.refNo,
    "addDynamicHead":this.saveReceiptObject.addDynamicHead ? this.saveReceiptObject.addDynamicHead : "",
    "addDynamicValue":this.saveReceiptObject.addDynamicValue ? this.saveReceiptObject.addDynamicValue : "",
    "arrayList":this.saveReceiptObject.ArrayData ? this.saveReceiptObject.ArrayData : ""
  }
  this.service.saveReceiptScreenAPI(params).subscribe((res:any)=>{
    const blobURL = URL.createObjectURL( this.pdfBlobConversion(res.fileContent, 'application/pdf'));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobURL;
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
    
  })

}

pdfBlobConversion(b64Data :any, contentType :any) {
  contentType = contentType || '';
  var sliceSize = 512;
  b64Data = b64Data.replace(/^[^,]+,/, '');
  b64Data = b64Data.replace(/\s/g, '');
  var byteCharacters = window.atob(b64Data);
  var byteArrays = [];

  for ( var offset = 0; offset < byteCharacters.length; offset = offset + sliceSize ) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

onCallbackSuccess() {
  this.disableBtn = false;
  this.hideButton = false;
  if (this.receiptDetails.response){
    this.receiptDetails.receiptDetails.push(this.receiptDetails.response);
  }
}

  openViewPinDialog() {
    this.showViewPin = false;
    this.viewPinEmit.emit();
  }

  getCanelBtnClick(){
    this.cancelCallBck.emit();
  }

}
