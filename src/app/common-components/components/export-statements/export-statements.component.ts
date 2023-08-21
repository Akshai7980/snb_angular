import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';
import { DownloadBalanceConfirmaionComponent } from '../download-balance-confirmaion/download-balance-confirmaion.component';

import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';



@Component({
  selector: 'app-export-statements',
  templateUrl: './export-statements.component.html',
  styleUrls: ['./export-statements.component.scss']
})
export class ExportStatementsComponent implements OnInit {

  @Input() moduleId: any;
  @Input() childMessage: any;
  @Input() reqAccNumber: any;
  @Input() reqPortalAccNumber: any;
  @Input() moduleName: any;
  @Input() selectRange: any;
  @Input() rangeFromDate: any;
  @Input() rangeToDate: any;
  @Input() nodataflag: any;
  @Input() reqUnitId:any;
  @Input() reqCif:any;
  @Input() resFlag:any;
  @Input() enableButton = true;
  @Input() downloadBalancePopup = false;
  @Output() emit942Data=new EventEmitter()
  

  isOpen = false;
  msg: any = [];
  typeData: any = [];
  mtype: any;
  typeDataNew: any = [];
  isLoadingCompelete = true;
  isDownLoadFailed = false;
  titleToSend:any
  rootScopeData: RootScopeDeclare = RootScopeData;
  pdfData: any;

  private myMethodSubject = new Subject<any>();

  constructor(private commonService: CommonService, public dialog: MatDialog, private http: HttpClient, private router: ActivatedRoute,private translateService: TranslateService,public datePipe:DatePipe,private downloadAsPdf:downloadAsPdf) {
    this.typeDataNew = [{
      type: "PDF"
    },
    {
      type: "XLS"
    },
    {
      type: "CSV"
    }
    ];
    this.typeData = [{
      type: "XLS"
    },
    {
      type: 'TXT'
    },
    {
      type: "PDF"
    },
    {
      type: "CSV"
    },
    {
      type: "MT 940"
    },
    {
      type: "MT 942"
    }
    ];
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.nodataflag = this.nodataflag;
  }


  closeContextMenu() {
    this.isOpen = false;
  }

  generateMtStatement(dropdowntype: any): any {
    if (dropdowntype == "XLS" || dropdowntype == "PDF" || dropdowntype == "CSV" || dropdowntype == "TXT") {
      // this.downloadStatements(dropdowntype, this.moduleId);
      if(this.downloadBalancePopup === true){
        let dialogRef = this.dialog.open(DownloadBalanceConfirmaionComponent, {
          width: '400px',
          data: {
            type: dropdowntype,
            moduleId: this.moduleId,
            reqAccNumber:this.reqAccNumber,
            rangeFromDate : this.rangeFromDate,
            rangeToDate : this.rangeToDate,
            selectRange : this.selectRange,
            resFlag : this.resFlag
          }
        });
      }else{
        this.downloadStatements(dropdowntype, this.moduleId);
      }

    }
    else {
      let exportType = ""
      if (dropdowntype == "MT 940") {
        this.mtype = "MT940"
       exportType = "PDF"
        this.titleToSend="LBL_MT940_REQUEST_SENT"
      }else if (dropdowntype == "MT 942") {
        this.mtype = "MT942"
       exportType = "PDF"
        this.titleToSend="LBL_MT942_REQUEST_SENT"
      }
     
      this.isOpen = false;
      this.isLoadingCompelete = false;
      let params={
        accNumber : this.reqAccNumber,
        fromDate : this.rangeFromDate,
        toDate : this.rangeToDate,
        unitId : this.reqUnitId,
        cifNum : this.reqCif,
        selectRange : this.selectRange
      }
      //debugger
      if(this.mtype && this.rangeFromDate && this.rangeToDate){
        let dateFromArray;
        if((this.rangeFromDate.includes("/"))){
          dateFromArray=this.rangeFromDate.split("/");
        }
        let day=Number(dateFromArray[0])
        let month=Number(dateFromArray[1])
        let year=Number(dateFromArray[2])
        params.fromDate= (day>9?day :"0"+day)+"-"+(month>9?month:"0"+month)+"-"+(year)

        let dateToArray;
        if((this.rangeToDate.includes("/"))){
          dateToArray=this.rangeToDate.split("/");
        }
        let dayTo=Number(dateToArray[0])
        let monthTo=Number(dateToArray[1])
        let yearTo=Number(dateToArray[2])
        params.toDate= (dayTo>9?dayTo :"0"+dayTo)+"-"+(monthTo>9?monthTo:"0"+monthTo)+"-"+(yearTo)

      }

      if(this.mtype === "MT942"){
        let day=new Date().getDate();
        let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
        let year=new Date().getFullYear()
        let date=day+"/"+month+"/"+year
        params.fromDate = date;
        params.toDate = date;
        this.emit942Data.emit();
      }
     
      //debugger;
      this.commonService.generateMT940(params,this.mtype).subscribe((response: any) => {
        if (response && response.data) {
          this.isLoadingCompelete = true;
          if(response.data.fileContent){
            const src = 'data:text/plain;base64,'+ response.data.fileContent; // contentType of File pdf/csv/xls
            const link = document.createElement("a")
            link.href = src
            link.download = response.data.FileName; //Dynamic FileName
            link.click();
            link.remove();
          }
          else if(response.data.errorDesc === 'Failed'){
            this.rootScopeData.showSystemError = true;
            this.rootScopeData.toastMessage = "LBL_RECORD_NOT_FOUND";
            // var PDF = new jsPDF('p', 'mm', 'a4');
            // PDF.text('',20,30);
            // PDF.addPage();
            // if(this.mtype === "MT942"){
            //   PDF.save('MT942.pdf');
            // }
            // else{
            //   PDF.save('MT940.pdf');
            // }  

              // let res = "Text to save in a text file";
              // const blob = new Blob([res], { type: 'text/csv' });
              // const url = window.URL.createObjectURL(blob);
              // window.open(url); 
              
              //internal Text file downloader--Seshan
              //  let res = "";
              //  const file = new Blob([res], { type: 'application/octet-stream' });
              //  const downloadAncher = document.createElement("a");
              //  downloadAncher.style.display = "none";
              //  const fileURL = URL.createObjectURL(file);
              //  downloadAncher.href = fileURL;
              //  if(this.mtype === "MT942"){
              //   downloadAncher.download = response.data.FileName ?response.data.FileName : "MT-942.txt";
              //  }
              //  else{
              //  downloadAncher.download = response.data.FileName ?response.data.FileName :"MT-940.txt";
              //  }                
              //  downloadAncher.click();
          }
          
        }
        else{
          this.isLoadingCompelete = true;
        }
      }, error => {
        this.isLoadingCompelete = true;
      }
      )

      // this.msg = "LBL_RQST_GENRTE"+this.mtype+"LBL_HAS_SUBMITTED"
      // this.commonService.generateMtStatement(this.mtype,params).subscribe(
      //   (data:any) => {
      //     this.isLoadingCompelete = true;
      //     this.msg = data.data[0].mtTrackerStatus;
      //     if (data.data[0].status == "SUCCESS") {
      //       let dialogRef = this.dialog.open(MessagePopupComponent, {
      //         width: '400px',
      //         data: {
      //           title: this.titleToSend,
      //           content:this.translateService.instant('LBL_RQST_GENRTE')+' '+dropdowntype+' '+this.translateService.instant('LBL_HAS_SUBMITTED')+' '+this.translateService.instant('LBL_PLS_RFR')+' '+dropdowntype+' '+this.translateService.instant('LBL_RPRT_SCTN_DETAILS'),
      //           trxRefNo:data.data[0].ReferenceNo,
      //           btnLabel:"LBL_OK"
      //         }
      //       });
      //     }
      //   }, error => {
      //     this.isLoadingCompelete = true;
      //   }
      // )
    }
  }



  downloadStatements(type: any, vmoduleId: string) {
    let exportType = type;
    let moduleId = this.moduleId;
    let accnum = this.reqAccNumber;
    // let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;
    let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;
    let params ={
      "moduleId": moduleId,
      "exportType": exportType,
      "export": "Y",
      "REQ_ACCOUNT_NUMBER": undefined,
      "SELECTED_RANGE":undefined,
      "FILTER_DATE_VALUE_DATE":undefined,
      "FILTER_DATE_VALUE_DATE2":undefined

    };
    if (accnum) {
      // url += '&REQ_ACCOUNT_NUMBER=' + this.reqAccNumber;
     params.REQ_ACCOUNT_NUMBER = this.reqAccNumber

    }

    if (this.rangeFromDate && this.rangeToDate) {
      // url += '&SELECTED_RANGE=' + this.selectRange + '&FILTER_DATE_VALUE_DATE=' + this.rangeFromDate + '&FILTER_DATE_VALUE_DATE2=' + this.rangeToDate;
      params.SELECTED_RANGE = this.selectRange,
      params.FILTER_DATE_VALUE_DATE=this.rangeFromDate,
      params.FILTER_DATE_VALUE_DATE2 =this.rangeToDate

    }
    else if (this.selectRange) {
      // url += '&SELECTED_RANGE=' + this.selectRange;

        params.SELECTED_RANGE=this.selectRange
    }



    this.commonService.exportDocumentPost(params).subscribe((response: any) => {

      if(exportType === "TXT"){
        const src = 'data:text/plain;base64,'+ response.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = response.fileName; //Dynamic FileName
        link.click();
        link.remove();
      }
      else{
        const src = 'data:application/'+exportType+';base64,'+ response.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = response.fileName; //Dynamic FileName
        link.click();
        link.remove();
      }     
    }, error => {
      if (error.status == 200) {
        //this.isDownLoadFailed = false;
        window.open(url + '&_dinsess=' + this.rootScopeData.userInfo._cpReqToken + '&langId=' + this.rootScopeData.userInfo.mLanguage, '_self');

      } else {

      }
    });




  }

  error(){
    this.rootScopeData.showSystemError = true;
    this.rootScopeData.toastMessage = "LBL_RECORD_NT_AVAILABLE";
  }

}
