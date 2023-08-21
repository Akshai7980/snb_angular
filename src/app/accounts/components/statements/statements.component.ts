import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete =  true;
  accNumber: any;
  statementsData: any;
  statementcount: any;
  constructor(private accountService:AccountDetailsService, private commonService:CommonService) { 
     this.rootScopeData.activeTabName = 'statements';
    }

  ngOnInit(): void {
    this.accNumber = this.rootScopeData.accountsSummaryObject.OD_ACC_NO;
    this.getStatementDataApiCall();
  }

  getStatementDataApiCall(){
    this.isLoadingCompelete = false;
    let accountStatementFlag = "Y"
   this.accountService.getAccountStatement(this.accNumber,accountStatementFlag).subscribe(
      (response:any)=>{
        this.isLoadingCompelete = true;
        this.statementsData = response.data;
        this.statementcount = response.data.length;
      },
      (error:any) =>{
        this.isLoadingCompelete = true;
       }
    )
  }

  download_Click(data:any){
    this.isLoadingCompelete = false;
    // console.log("reqInvoiceNumber", this.rootScopeData.accountsSummaryObject.OD_REF_NO);
    let moduleId = "GETINVOICE";
    let exportType = "PDF";
    let lang_ID = "en_US";
    let viewStatement = "viewEStatement";
    let ref_no = this.rootScopeData.accountsSummaryObject.OD_REF_NO;
    // let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType +'&langId=' + lang_ID +'&statement='+viewStatement + '&statementDate='+data.res_InvoiceDate+ '&accountNum='+this.accNumber;
    // let url = `${environment.restAPI}` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType ;
    // if(ref_no) {
    //   url += '&refNo='+ref_no
    // }
    let params = {
      "moduleId": moduleId,
      "exportType": exportType,
      "statement":viewStatement,
      "statementDate":data.res_InvoiceDate,
      "accountNum":this.accNumber,
      "refNo":undefined
    }
    if(ref_no){
      params.refNo=ref_no;
    }
this.commonService.viewEStmtDownloadDocument(params).subscribe((res:any)=>{
  this.isLoadingCompelete = true;
  const src = 'data:application/'+exportType+';base64,'+ res.fileContent; // contentType of File pdf/csv/xls
  const link = document.createElement("a")
  link.href = src
  link.download = res.fileName; //Dynamic FileName 
  link.click();
  link.remove();
},error=>{
  if (error.status == 200) {
    this.isLoadingCompelete = true;     
  } else {
    this.isLoadingCompelete = true;
  }
})
    // this.accountService.statementsDownloadApi(url).subscribe(
    //   response => {
    //     if (response.status === 200) {
    //       // this.rootScopeData.showSystemError = false;
    //       window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
    //     } else {
    //       // this.rootScopeData.showSystemError = true;
    //     }
    //   }, error => {
    //     if (error.status === 200) {
    //       // this.rootScopeData.showSystemError = false;
    //       window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
    //     } else {
    //       // this.rootScopeData.showSystemError = true;
    //     }
    //   }
    // )
  }

}
