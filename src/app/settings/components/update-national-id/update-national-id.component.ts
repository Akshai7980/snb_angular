import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SettingsService } from '../../services/settings.service';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { dateFormateChanger } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-update-national-id',
  templateUrl: './update-national-id.component.html',
  styleUrls: ['./update-national-id.component.scss']
})
export class UpdateNationalIdComponent implements OnInit {
  hideAll=false;
  clearFlag=false;
  dob:any;
  dateErr = false;
  isLoadingCompelete =false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  detailsObj:any;
  expireDate:any;
  receiptData: any;
  pdfData:any;
  refNo:any;
  maxDate=new Date() ;
  unformatedDate:any;
  errorMsg:any;
  isShownErrorMsg:boolean=false;
   constructor(private settingService:SettingsService, public datepipe: DatePipe,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.nationalIdDetails();
  }
  nationalIdDetails(){
    this.isLoadingCompelete=false;
    this.settingService.getNationalIdDetails().subscribe((response:any)=>{
      this.isLoadingCompelete = true;   
      if(response && response.data){
        this.detailsObj=response.data;
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
    })
  }
  onClickCancel(){
    this.clearFlag=true;
  }
  onClickProceed(){
    if(!this.dob){
      this.dateErr=true;
    }else{
      this.isLoadingCompelete = false;
      let param = {
        ID_NUMBER : this.detailsObj.NATIONAL_ID ? this.detailsObj.NATIONAL_ID : "",
        EXP_DATE : this.detailsObj.EXPIRY_DATE ? this.detailsObj.EXPIRY_DATE : "",
        DOB : this.unformatedDate
      }
      this.settingService.updateNationalId(param).subscribe((response:any)=>{
        this.isLoadingCompelete = true;    
        if(response && response.dataValue && response.dataValue.STATUS ==='SUCCESS'){
          this.hideAll=true;
          this.expireDate = response.dataValue && response.dataValue.idExpiryDate ? response.dataValue.idExpiryDate : "";
          this.refNo = response.dataValue && response.dataValue.REFERENCE_NUM ? response.dataValue.REFERENCE_NUM : "";
          this.constructReceiptData(this.refNo);
          
        }else{
          this.isLoadingCompelete = true;    
          // this.rootScopeData.showSystemError = true;
          // this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
          this.isShownErrorMsg=true;
          this.errorMsg=response.dataValue.ERROR_DES;
        }
      }, error => {
        this.isLoadingCompelete = true;
      })
    }
  }
  getDate(event:any){
    this.unformatedDate=this.datepipe.transform(event,"dd/MM/YYYY");
    this.dob=this.datepipe.transform(event,this.rootScopeData.userInfo.mDateFormat);
  }
  constructReceiptData(refNo:any){
    let expDate=dateFormateChanger(this.expireDate);
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_NID_SUCCESS",
      "referenceNumber": refNo,
      "receiptDetails": [
        {
          "title": "LBL_ID_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_ID_NUMBER",
              "dataKey": this.detailsObj.NATIONAL_ID
            },
            {
              "dispKey": "LBL_EXPIRY_DATE",
              "dataKey": this.datepipe.transform(expDate,this.rootScopeData.userInfo.mDateFormat)
            },
            {
              "dispKey": "LBL_DATE_OF_BIRTH",
              "dataKey": this.dob
            }
          ]
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
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };
    
  }
  downloadPdf()
      { 
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_NATIONAL_ID_RECEIPT_PDF_TITLE'), x:80, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type: 'heading', value:this.translateService.instant('LBL_ID_DETAILS'), y:65},
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ID_NUMBER'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_EXPIRY_DATE'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_DATE_OF_BIRTH'), y:95},
        { type: 'text', value:this.detailsObj.NATIONAL_ID ? this.detailsObj.NATIONAL_ID : '', y:75},
        { type: 'text', value:this.datepipe.transform(this.expireDate,this.rootScopeData.userInfo.mDateFormat), y:85},
        { type: 'text', value:this.dob ? this.dob : '', y:95},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
        { type: 'text', value: this.refNo ? this.refNo : '', y:105},
        { type: 'heading', value:this.translateService.instant('LBL_NID_SUCCESS'), y:115},

      ]
      
        this.pdfData.push(
          { type: 'save', value:'UpdateNationalID.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);

  }
}
