import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from 'src/app/common-components/components/message-popup/message-popup.component';
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { integerOnly } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-balance-certification',
  templateUrl: './balance-certification.component.html',
  styleUrls: ['./balance-certification.component.scss']
})
export class BalanceCertificationComponent implements OnInit {
  dateErr = false;
  maxDate=new Date() ;
  clearFlag=false;
  dob:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  receiptData: any;
  cifList:any;
  cifObj:any;
  auditorData:any;
  cifData:any;
  isLoadingCompelete=false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    ccy:""
  } 
  showReceipt=false;
  ShowAuthorDetails:boolean=false;
  hideaccess:boolean=false;
  auditUserList : any =[];
  refNum : any ='';
  auditorErr : boolean = false;
  cityErr : boolean = false;
  poBoxErr : boolean = false;
  postalCodeErr : boolean = false;
  pdfData: any;
  filteredOptions: any
  myControl = new  UntypedFormControl();
  cifValidationMsg : boolean = false;
  cifValidMsg : any = '';
  otherAuditorName : any;
  otherNameErr : boolean = false;
  asOnDate : any;
  saveReceiptObject: any;
  constructor( public datepipe: DatePipe ,public accService:AccountDetailsService, 
     private downloadAsPdf:downloadAsPdf, private translateService: TranslateService, 
     public dialog: MatDialog) { }

  ngOnInit(): void {
    this.balanceCertificate();
  }
  balanceCertificate(){
    this.isLoadingCompelete=false
    this.accService.balanceCertificate().subscribe((response:any)=>{
      this.isLoadingCompelete=true
      if(response && response.dataValue && response.dataValue.length >0){
          this.cifList=response.dataValue;
      }
    },error=>{
      this.isLoadingCompelete=true;
      this.rootScopeData.showSystemError = true;
    })
  }
  setData(value:any){
    this.auditorErr=false;
    this.cifObj=value;
    this.poBoxErr = this.postalCodeErr = this.cityErr = this.otherNameErr = false;
    if(value.auditor.toLowerCase() !== 'other'){
      this.otherAuditorName = '';
    }
    else if(value.auditor.toLowerCase() === 'other'){
      this.cifObj = {
        auditor : value,
        cif : '',
        city : '',
        poBox : '',
        postalCode : ''
      };
    }
  }
   selectAuthor(item :any){
    this.isLoadingCompelete=false;
    // Validate CIF No
    this.initReqParam={
      accNo:"",
      amt:"",
      pdroductCode:"",
      subPrdCode:"",
      cif:item.cifNo,
      unitId: item.unitId,
      ccy:""
    } 
    
    let cifParam ={
      cifNo : item.cifNo
    }

    this.accService.validateCIFAccounts(cifParam).subscribe((res: any) =>{
      if(res && res.dataValue && res.dataValue[0].ERROR_CODE === "000"){
        // Fetch Auditor Lists
        let params = {
          unitId : item.unitId  
      }
      this.accService.auditUserList(params).subscribe((response:any)=>{
        this.isLoadingCompelete=true;
        if(response && response.data && response.data[0].auditorDetails.length > 0){
            this.auditUserList =response.data[0].auditorDetails;
            this.cifValidationMsg= false;
            this.ShowAuthorDetails= true;
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => (typeof value === 'string' ? value : value.name)),
              map(name => (name ? this._filter(name) : this.auditUserList.slice())),
            );
            this.getCityLists();   //Fetch City Lists
        }
      },error=>{
        this.isLoadingCompelete=true;
        this.rootScopeData.showSystemError = true;
      });
      }
      else if(res && res.dataValue && res.dataValue[0].ERROR_CODE === "ERR001") {
        // show status description if Cif  is not valid
        this.isLoadingCompelete=true;
        this.ShowAuthorDetails= false;
        this.cifValidationMsg = true;
        this.cifValidMsg = res.dataValue[0].OD_STATUS_DESC;
      }
      else{
        this.isLoadingCompelete=true;
        this.rootScopeData.showSystemError = true;
      }
    });
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.auditUserList.filter((option: any) => (option.auditor).toLowerCase().includes(filterValue));
  }
  getAuditorData(event : any){
    let value = event.target.value;
    if(this.auditUserList.length == 0){
     this.auditorData = '';
     this.auditorErr = true;
    }
    else{
      if(value.trim()){
        for(var i= 0; i <= this.auditUserList.length; i++){
          if(this.auditUserList[i].auditor && this.auditUserList[i].auditor.toLowerCase().includes(value.toLowerCase())){
            this.setData(this.auditUserList[i]);
            this.auditorData = this.auditUserList[i].auditor;
            this.auditorErr = false;
            return
          }
          else{
            this.auditorData = '';
            this.cifObj = ""
            this.auditorErr = true;
          }
        }
      }
      else {
        this.auditorErr = true; 
      }
    }

  }

  getDate(event:any){
    this.dob=this.datepipe.transform(event,this.rootScopeData.userInfo.mDateFormat);
    this.asOnDate = this.datepipe.transform(event, 'dd/MM/yyyy');
  }
  onClickCancel(){
    this.cifObj="";
    this.cifData='';
    this.auditorData='';
    this.ShowAuthorDetails= false
  }
  onClickSubmit(){ 
    this.dateErr=!this.dob?true:false;
    this.auditorErr = !this.auditorData?true:false;
    // if(this.cifObj){
    //     this.poBoxErr = this.cifObj.poBox ? false : true;
    //     this.cityErr = this.cifObj.city ? false : true;
    //     this.postalCodeErr = this.cifObj.postalCode ? false : true;
    // }
    if(this.auditorData.toLowerCase() === 'other'){
      this.otherNameErr = this.otherAuditorName ? false : true;
    }
    // !this.poBoxErr && && !this.cityErr &&  !this.postalCodeErr
    if(!this.dateErr  && !this.auditorErr  && !this.otherNameErr){
            let param = {
                cifNo : this.initReqParam.cif,
                auditor : this.auditorData.toLowerCase() === 'other' ? this.otherAuditorName : this.auditorData,
                city : this.cifObj.city,
                poBox : this.cifObj.poBox,
                postalCode : this.cifObj.postalCode,
                date : this.asOnDate
            }
        this.accService.submitBalanceApi(param).subscribe((response:any)=>{
          this.isLoadingCompelete = true;    
          if(response &&  response.dataValue && response.dataValue.STATUS.toLowerCase() === "success"){
            this.showReceipt=true;
              this.refNum = response.dataValue && response.dataValue.REFERENCE_NUM ? response.dataValue.REFERENCE_NUM : "";
              this.constructReceiptData(this.refNum);
          }else if (response.dataValue.STATUS.toLowerCase() === "failure"){
            this.isLoadingCompelete = true;   
            let dialogRef = this.dialog.open(MessagePopupComponent, {
                      width: '400px',
                      data: {
                        title: "LBL_BAL_CERTIFICATE",
                        content: response.dataValue.OD_STATUS_DESC,
                        trxRefNo: '',
                        btnLabel:"LBL_OK"
                      }
                    });
          }
          else{
            this.isLoadingCompelete = true;    
            // this.rootScopeData.showSystemError = true;
          }
        }, error => {
          this.isLoadingCompelete = true;
        })
      }
    // }
  }
  constructReceiptData(refNo:any){
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_BLNC_CERTIFICATE_SCS_MSG",
      "referenceNumber": refNo,
      "receiptDetails": [
        {
          "title": "LBL_CIF_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_CIF",
              "dataKey": this.cifData
            }
          ]
        },
        {
          "title": "LBL_BAL_CERTIFICATE_INFO",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_AS_ON_DATE",
              "dataKey": this.dob
            },
            {
              "dispKey": "LBL_AUDTIOR",
              "dataKey": this.auditorData.toLowerCase() === 'other' ? this.otherAuditorName : this.auditorData
            },
            {
              "dispKey": "LBL_PO_BOX",
              "dataKey": this.cifObj.poBox
            },
            {
              "dispKey": "LBL_CITY",
              "dataKey": this.cifObj.city
            },
            {
              "dispKey": "LBL_POSTAL_CODE",
              "dataKey": this.cifObj.postalCode
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
      "DownloadButton": {
        "buttonLabel": "LBL_DOWNLOAD",
      }
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_CHQ_REQ_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_BLNC_CERTIFICATE_SCS_MSG"),
      "keyValues": [
        {
          "subHead": "CIF details",
          "subValue": ""
        },
        {
          "subHead": "CIF",
          "subValue": this.cifData ? this.cifData : "--"
        },
        {
          "subHead": "Balance certificate Information",
          "subValue": ""
        },
        {
          "subHead": "As on date",
          "subValue": this.dob ? this.dob : "--"
        },
        {
          "subHead": "Auditor",
          "subValue": this.auditorData.toLowerCase() === 'other' ? this.otherAuditorName : this.auditorData
        },
        {
          "subHead": "POBox",
          "subValue": this.cifObj.poBox ? this.cifObj.poBox : "--"
        },
        {
          "subHead": "City",
          "subValue": this.cifObj.city ? this.cifObj.city : "--"
        },
        {
          "subHead": "Postal Code",
          "subValue": this.cifObj.postalCode ? this.cifObj.postalCode : "--"
        },
      ],
      "pagecall":"balancecertificate",
      "refNo":refNo
    }

  }

  downloadPDF()
  {
    this.pdfData = 
    [
      { type:'setFontSize', size:11},
      { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
      { type:'setTextColor', val1:0, val2:0, val3:0},
      { type: 'title', value: this.translateService.instant('LBL_BAL_CERTIFICATE'), x:85, y:35},
      { type:'setFontSize', size:10},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type:'setFontSize', size:10},
      { type:'setFontSize', size:9},
      { type:'setTextColor', val1:0, val2:0, val3:0}, 
      { type: 'heading', value:this.translateService.instant('LBL_CIF_DETAILS'), y:65},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
      { type: 'heading', value:this.translateService.instant('LBL_CIF'), y:75},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_BAL_CERTIFICATE_INFO'), y:85},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'},
      { type: 'heading', value:this.translateService.instant('LBL_AS_ON_DATE'), y:95},
      { type: 'heading', value:this.translateService.instant('LBL_AUDTIOR'), y:105},
      { type: 'heading', value:this.translateService.instant('LBL_PO_BOX'), y:115},
      { type: 'heading', value:this.translateService.instant('LBL_CITY'), y:125},
      { type: 'heading', value:this.translateService.instant('LBL_POSTAL_CODE'), y:135},
      { type: 'text', value:this.initReqParam.cif ? this.initReqParam.cif : '', y:75},
      { type: 'text', value:this.dob ? this.dob : '', y:95},
      { type: 'text', value:this.auditorData ? (this.auditorData.toLowerCase() === 'other' ? this.otherAuditorName : this.auditorData) : '', y:105},
      { type: 'text', value: this.cifObj.poBox ? this.cifObj.poBox : '', y:115},
      { type: 'text', value: this.cifObj.city ?  this.cifObj.city  : '', y:125},
      { type: 'text', value: this.cifObj.postalCode ?  this.cifObj.postalCode  : '', y:135},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
      { type: 'text', value: this.refNum ? this.refNum : '', y:145},
    ]

      this.pdfData.push(
        { type: 'save', value:'BalanceCertificate.pdf'}
     )
   this.downloadAsPdf.downloadpdf(this.pdfData);
  }

  downloadFromApi(){
    let params={
      refNo: this.refNum,
      fileType : 'pdf'
    }
  this.isLoadingCompelete = false;
  this.accService.downloadBalCertificate(params).subscribe(
    (response: any) => {
      this.isLoadingCompelete = true;
      const src = 'data:application/'+params.fileType+';base64,'+ response.data.fileContent; // contentType of File pdf/csv/xls
      const link = document.createElement("a")
      link.href = src
      link.download = response.data.fileName;
      link.click();
      link.remove();
    },
    (error: any) => {
      this.isLoadingCompelete = true;
    }
  )
  }

  cityLists : any = [];
  getCityLists(){
    let params = {};
    this.accService.BalanceCityLists(params).subscribe(
      (response: any) => {
        if(response){
            this.cityLists = response.data;
        }
      });
  }
 
  numberOnly(event: any) {
    return integerOnly(event);
  }

}
