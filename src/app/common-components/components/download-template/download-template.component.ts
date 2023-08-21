import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-download-template',
  templateUrl: './download-template.component.html',
  styleUrls: ['./download-template.component.scss']
})
export class DownloadTemplateComponent implements OnInit {

  @Input() downloadTemplateData?: any = {};
  isLoadingCompelete: boolean = true;
  downloadSection:boolean=true;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {}

  downloadStatement(){
    this.isLoadingCompelete = false;
    this.downloadSection=false;

    // let params={
    //   export : "Y",
    //   subPdt : this.downloadTemplateData.subPdt,
    //   billerId :this.downloadTemplateData.billerId ? this.downloadTemplateData.billerId : undefined,
    //   billerCode : this.downloadTemplateData.billerCode ? this.downloadTemplateData.billerCode : undefined,
    //   serviceCode : this.downloadTemplateData.serviceCode ? this.downloadTemplateData.serviceCode :undefined,
    //   type :this.downloadTemplateData.type,
    //   format : this.downloadTemplateData.exportType ? this.downloadTemplateData.exportType : undefined,
    //   templateId : this.downloadTemplateData.templateId ? this.downloadTemplateData.templateId : undefined
    // }

    // this.commonService.downloadTemplate(params,this.downloadTemplateData.moduleId).subscribe((response: any) => {
    //   this.isLoadingCompelete = true;
    //   if (response && response.data) {
        
    //     if(response.data.fileContent){
    //       const src = 'data:text/plain;base64,'+ response.data.fileContent; // contentType of File pdf/csv/xls
    //       const link = document.createElement("a")
    //       link.href = src
    //       link.download = response.data.FileName; //Dynamic FileName
    //       link.click();
    //       link.remove();
    //     }       
        
    //   }
    // }, error => {
    //   this.isLoadingCompelete = true; 
    // }
    // )




    let url = `${environment.restDownloadAPI}` + '?moduleId=' + this.downloadTemplateData.moduleId + '&export=Y&exportType=' + this.downloadTemplateData.exportType;
    //  let url = `http://10.11.12.44:12491/iportalweb/RestAPIServiceServlet` + '?moduleId=' + moduleId + '&export=Y&exportType=' + exportType;     
     
    if(this.downloadTemplateData){
      
      this.commonService.exportDocument(url).subscribe(response => {
        if (response.status == 200) {          
          this.isLoadingCompelete = true; 
          this.downloadSection=true;
          if(this.downloadTemplateData.flag ==="SADMOIUP") {
          window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}&billerId=${this.downloadTemplateData.billerId}&billerCode=${this.downloadTemplateData.billerCode}&serviceCode=${this.downloadTemplateData.serviceCode}&type=${this.downloadTemplateData.type}`, "_self");
          }
          else if(this.downloadTemplateData.flag ==="SADPAYUP") {
            window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}`, "_self");
          } else if (this.downloadTemplateData.flag === "SALPAY") {
            window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}&format=${this.downloadTemplateData.exportType}&templateId=${this.downloadTemplateData.templateId}`, "_self");
          } else if (this.downloadTemplateData.flag === "BENEUP") {
            window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}&format=${this.downloadTemplateData.exportType}&templateId=${this.downloadTemplateData.templateId}&type=${this.downloadTemplateData.type}`, "_self");
          }else {
            window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}&templateId=${this.downloadTemplateData.templateId}`, "_self");
          }
        } 
      }, error => {
        if (error.status == 200) {  
          this.isLoadingCompelete = true;     
          this.downloadSection=true;
          window.open(`${environment.restDownloadAPI}?moduleId=${this.downloadTemplateData.moduleId}&subPdt=${this.downloadTemplateData.subPdt}`, "_self");
          
        } else {
          this.isLoadingCompelete = true;
          this.downloadSection=true;
        }
      });
    }
      
  }
}