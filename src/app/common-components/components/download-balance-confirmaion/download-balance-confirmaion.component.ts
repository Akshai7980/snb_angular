import { Component, Inject, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-download-balance-confirmaion',
  templateUrl: './download-balance-confirmaion.component.html',
  styleUrls: ['./download-balance-confirmaion.component.scss']
})
export class DownloadBalanceConfirmaionComponent implements OnInit {

  selectedRadio:any
  isLoadingCompelete: boolean = true;
  isConfirmTicketValid : boolean = false;

  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private commonService: CommonService,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog) {
    // console.log(this.data)
   }

  ngOnInit(): void {
  }

  selectedOption(){
    if(this.selectedRadio === "withBalance"){
      this.downloadStatements(this.data.type,"CASASTATEMENTWB")
    }else if(this.selectedRadio === "withOutBalance"){
      this.downloadStatements(this.data.type,this.data.moduleId)
    }
  }

  downloadStatements(type: any, vmoduleId: string) {
    let exportType = type;
    let moduleId = vmoduleId;
    let accnum = this.data.reqAccNumber;
    // let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;
    let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;
    let params ={
      "moduleId": moduleId,
      "exportType": exportType,
      "export": "Y",
      "REQ_ACCOUNT_NUMBER": undefined,
      "SELECTED_RANGE":undefined,
      "FILTER_DATE_VALUE_DATE":undefined,
      "FILTER_DATE_VALUE_DATE2":undefined,
      "res_flag": this.data.resFlag ? this.data.resFlag : undefined

    };
    if (accnum) {
      // url += '&REQ_ACCOUNT_NUMBER=' + this.reqAccNumber;
     params.REQ_ACCOUNT_NUMBER = this.data.reqAccNumber
      
    }

    if (this.data.rangeFromDate && this.data.rangeToDate) {
      // url += '&SELECTED_RANGE=' + this.selectRange + '&FILTER_DATE_VALUE_DATE=' + this.rangeFromDate + '&FILTER_DATE_VALUE_DATE2=' + this.rangeToDate;
      params.SELECTED_RANGE = this.data.selectRange,
      params.FILTER_DATE_VALUE_DATE=this.data.rangeFromDate,
      params.FILTER_DATE_VALUE_DATE2 =this.data.rangeToDate
      
    }
    else if (this.data.selectRange) {
      // url += '&SELECTED_RANGE=' + this.selectRange;
    
        params.SELECTED_RANGE=this.data.selectRange
    }
    
   
    this.dialog.closeAll();
    this.commonService.exportDocumentPost(params).subscribe((response: any) => {
      const src = 'data:application/'+exportType+';base64,'+ response.fileContent; // contentType of File pdf/csv/xls
      const link = document.createElement("a")
      link.href = src
      link.download = response.fileName; //Dynamic FileName 
      this.dialog.closeAll();
      link.click();
      link.remove();
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
