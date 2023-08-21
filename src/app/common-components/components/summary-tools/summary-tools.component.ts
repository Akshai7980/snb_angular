import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-summary-tools',
  templateUrl: './summary-tools.component.html',
  styleUrls: ['./summary-tools.component.scss']
})
export class SummaryToolsComponent implements OnInit {
  @Input() printSection = '';
  @Input() moduleId: any;
  @Input() refNo: any = '';
  @Input() enabledProperty = false;
  @Input() filterValues :any = [];
  @Input() filterFlag :any;
  @Input() isEnabledPropertyPrint = false;
  @Input() beneSubprd: any;
  @Input() functioncode:any;
  @Input() isshowndownloadablePrint = false;
  @Input() isshowndetailsPrint = false;
  @Input() isshowndetailsPrintHide = false;
  @Input() pageCall = false;

  @Output() onPDFdownloadChange = new EventEmitter();
  @Output() onDetailsPagePrintemit = new EventEmitter();
  isLoadingCompelete = true;
  @Input() isshownPDF =true;
  isshownXls = true;
  @Input() isshownPrint = true;
  @Input() aramcoInqData : any;
  @Input() saveReceiptObject : any;
productCode :string ="";
pageName:any;

  rootScopeData: RootScopeDeclare = RootScopeData;
  
  constructor(private commonService: CommonService) { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.enabledProperty == true)
    {
      this.isshownXls = false;
    }
  }


  downloadStatements(type :any){
    let exportType = type;
    let moduleId = this.moduleId;
    this.isLoadingCompelete = false;
    if(this.enabledProperty == true)
    {
      this.isLoadingCompelete = true;
      // this.onPDFdownloadChange.emit();
      this.pdfDownloadFromDetailsScreen();
      return;
    }
    if(type == 'PDF'){
      this.isshownPDF = false;      
    }
    else{
      this.isshownXls = false;
    }
    let url :any;
    if(this.filterFlag && this.filterValues)
    {
     url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType + '&filterFlag=' +this.filterFlag + '&filterList=' + JSON.stringify(this.filterValues) ;
    }else if(this.refNo !== ''){
      url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&refNo=' + this.refNo + '&export=Y&exportType=' + exportType + '&filterFlag=' +this.filterFlag + '&filterList=' + JSON.stringify(this.filterValues) ;
    }
    else{
     url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType ;
    }
       
      //  let url = `http://10.11.12.44:12491/iportalweb/RestAPIServiceServlet` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;     
     
      // let params = {
      //   "moduleId": moduleId,
      //   "exportType": exportType
      // }
      this.functioncode =
        (this.beneSubprd === 'SALPAY' ||
        this.beneSubprd === 'BULKPAY'
          ? 'BULKUP'
          : '') ||
        (this.beneSubprd === 'WPSUP'
          ? 'WPSINI'
          : '');
      this.productCode = (this.beneSubprd === 'SALPAY' ||
      this.beneSubprd === 'BULKPAY'
        ? 'PAYMNT'
        : '') ||
      (this.beneSubprd === 'WPSUP'
        ? 'PAYMNT'
        : '');

      var params = {}
      if(!this.refNo){
        params = {
          "moduleId": moduleId,
          "exportType": exportType,
          "beneSubprod": this.beneSubprd ? this.beneSubprd : undefined
        }
      }else{
        params = {
          "moduleId": moduleId,
          "exportType": exportType,
          "refNo" : this.refNo,
          "beneSubprod":this.beneSubprd ? this.beneSubprd : undefined,
          "functionCode":this.functioncode ? this.functioncode : undefined,
          "productName":this.productCode ? this.productCode : undefined,
          "pageName":this.pageCall ? this.pageCall : undefined,
          "fromRow":moduleId==="PAYROLTXNS" ? "1" : undefined,
          "toRow":moduleId==="PAYROLTXNS" ? "20000" : undefined
        }
      }
      if(moduleId ==="ARAMCOINVOICEINQ"){
        this.aramcoInqData.moduleId = moduleId;
        this.aramcoInqData.exportType = exportType
        //debugger;
        params = this.aramcoInqData
      }
      this.commonService.downloadDocument(params).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        this.isshownPDF = true;
        this.isshownXls = true;

        const src = 'data:application/'+exportType+';base64,'+ response.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = response.fileName; //Dynamic FileName 
        link.click();
        link.remove();


        // if (response.status == 200) {
        //   this.isLoadingCompelete = true;
        //   this.isshownPDF = true;
        //   this.isshownXls = true;
        //   window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');         
        // } else {
          
        // }
      }, error => {
        if (error.status == 200) {
          //this.isDownLoadFailed = false;  
          this.isLoadingCompelete = true;
          this.isshownPDF = true; 
          this.isshownXls = true;      
          window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
          
        } else {
          this.isLoadingCompelete = true;
          this.isshownPDF = true;
          this.isshownXls = true; 
        }
      });
  
  
    
  
  }
  onClickPrint(){
    window.print();
  }


  viewInExcel(){};
  viewInMail(){};

  onDetailsPagePrint(){
    // this.onDetailsPagePrintemit.emit();
    let params={
      "pageheading": this.saveReceiptObject.pageheading,
      "subHeading": this.saveReceiptObject.subHeading,
      "Description": this.saveReceiptObject.Description,
      "keyValues": this.saveReceiptObject.keyValues,
      "Pagecall":this.saveReceiptObject.pagecall,
      "refNo":this.saveReceiptObject.refNo
    }
    this.commonService.saveReceiptScreenAPI(params).subscribe((res:any)=>{
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





  downloadPrintableStatement(type :any){
    let exportType = type;
    let moduleId = this.moduleId;
    this.isLoadingCompelete = false;
   
    let url :any;
     url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType ;
    
     this.functioncode =
        (this.beneSubprd === 'SALPAY' ||
        this.beneSubprd === 'BULKPAY'
          ? 'BULKUP'
          : '') ||
        (this.beneSubprd === 'WPSUP'
          ? 'WPSINI'
          : '');
      this.productCode = (this.beneSubprd === 'SALPAY' ||
      this.beneSubprd === 'BULKPAY'
        ? 'PAYMNT'
        : '') ||
      (this.beneSubprd === 'WPSUP'
        ? 'PAYMNT'
        : '');
    
      var params = {}
      if(moduleId ==="ARAMCOINVOICEINQ"){
        params ={
          "moduleId": moduleId,
          "exportType": exportType,
          "amountFrom":this.aramcoInqData.amountFrom,
          "amountTo":this.aramcoInqData.amountTo,
          "aramcoId":this.aramcoInqData.aramcoId,
          "currency":this.aramcoInqData.currency,
          "fromDate":this.aramcoInqData.fromDate,
          "invoiceNumber":this.aramcoInqData.invoiceNumber,
          "status":this.aramcoInqData.status,
          "toDate":this.aramcoInqData.toDate
        } 
      }
      else if(!this.refNo){
        params = {
          "moduleId": moduleId,
          "exportType": exportType,
          "beneSubprod": this.beneSubprd ? this.beneSubprd : undefined
        }
      }      
      else{
        params = {
          "moduleId": moduleId,
          "exportType": exportType,
          "refNo" : this.refNo,
          "beneSubprod":this.beneSubprd ? this.beneSubprd : undefined,
          "functionCode":this.functioncode ? this.functioncode : undefined,
          "productName":this.productCode ? this.productCode : undefined,
          "pageName":this.pageCall ? this.pageCall : undefined,
          "fromRow":moduleId==="PAYROLTXNS" ? "1" : undefined,
          "toRow":moduleId==="PAYROLTXNS" ? "20000" : undefined
        }
      }
      this.commonService.downloadDocument(params).subscribe((response: any) => {
        this.isLoadingCompelete = true;

        const blobURL = URL.createObjectURL( this.pdfBlobConversion(response.fileContent, 'application/pdf'));
        const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobURL;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();

      }, error => {
       
          this.isLoadingCompelete = true;
        
      });  
  }

  pdfDownloadFromDetailsScreen(){
    //debugger;
    let params={
      "pageheading": this.saveReceiptObject.pageheading,
      "subHeading": this.saveReceiptObject.subHeading,
      "Description": this.saveReceiptObject.Description,
      "keyValues": this.saveReceiptObject.keyValues,
      "Pagecall":this.saveReceiptObject.pagecall,
      "refNo":this.saveReceiptObject.refNo
    }
    this.commonService.saveReceiptScreenAPI(params).subscribe((res:any)=>{
      const src = 'data:application/'+"PDF"+';base64,'+ res.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = res.fileName; //Dynamic FileName
        link.click();
        link.remove();
      
    })
  }
  
  }
