import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-uploaded-file-download',
  templateUrl: './uploaded-file-download.component.html',
  styleUrls: ['./uploaded-file-download.component.scss']
})
export class UploadedFileDownloadComponent implements OnInit {

  @Input() fileUploadedDetails?: any = {};
  isLoadingCompelete: boolean = true;
  downloadSection: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void { }

  downloadStatement() {
    this.isLoadingCompelete = false;
     this.downloadSection = false;

    // '&_dinsess='+this.rootScopeData.userInfo._cpReqToken;
    //let url =http://172.16.3.224:30441/iportalweb/RestDownloadServlet?moduleId=FILEDLD&fileToRename=DailyTracker_1156a7b0-dcf2-475b-9369-bd76e7cbf49c.ods&_dinsess=b9df4c22-494b-438e-a827-c8703de882b5

    let url = '';
    if (this.fileUploadedDetails.attachmentRefNumber)
      url = `${environment.restDownloadAPI}?moduleId=${this.fileUploadedDetails.moduleId}&fileToRename=${this.fileUploadedDetails.fileName}&originalFileName=${this.fileUploadedDetails.fileActualName}&attachmentRefNumber=${this.fileUploadedDetails.attachmentRefNumber}`;
    else
      url = `${environment.restDownloadAPI}?moduleId=${this.fileUploadedDetails.moduleId}&fileToRename=${this.fileUploadedDetails.fileName}&originalFileName=${this.fileUploadedDetails.fileActualName}`;

    let params = {
      "moduleId": this.fileUploadedDetails.moduleId,
      "fileToRename": this.fileUploadedDetails.fileName,
      "originalFileName": this.fileUploadedDetails.fileActualName,
      "attachmentRefNumber": this.fileUploadedDetails.attachmentRefNumber
    }

    if (this.fileUploadedDetails) {
      this.commonService.exportDocumentGet(params).subscribe((response: any) => {
        this.downloadSection = true;
        this.isLoadingCompelete = true;
        if (response.fileType === "TXT") {
          const src = 'data:text/plain;base64,' + response.fileContent; // contentType of File pdf/csv/xls
          const link = document.createElement("a")
          link.href = src
          link.download = response.fileName; //Dynamic FileName
          link.click();
          link.remove();
        }
        else {
          const src = 'data:application/' + response.fileType + ';base64,' + response.fileContent; // contentType of File pdf/csv/xls
          const link = document.createElement("a")
          link.href = src
          link.download = response.fileName; //Dynamic FileName
          link.click();
          link.remove();
        }
      }, error => {
        this.downloadSection = true;
        this.isLoadingCompelete = true;
        if (error.status == 200) {
          window.open(`${environment.restDownloadAPI}?moduleId=${this.fileUploadedDetails.moduleId}&fileToRename=${this.fileUploadedDetails.fileName}&originalFileName=${this.fileUploadedDetails.fileActualName}`, "_self");
        } else {

        }
      });

    }

    // if(this.fileUploadedDetails){
    //   this.commonService.exportDocument(url).subscribe(response => {
    //     if (response.status == 200) {
    //       // window.open(`${environment.restDownloadAPI}?moduleId=${this.fileUploadedDetails.moduleId}&fileToRename=${this.fileUploadedDetails.fileName}&originalFileName=${this.fileUploadedDetails.fileActualName}`, "_self");

    //       // window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');         
    //     }  
    //   }, error => {
    //     if (error.status == 200) {  
    //       this.isLoadingCompelete = true;     
    //       this.downloadSection=true;
    //       //window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}`, "_self");

    //     } else {
    //       this.isLoadingCompelete = true;
    //       this.downloadSection=true;
    //     }
    //   });
    // }

  }
}