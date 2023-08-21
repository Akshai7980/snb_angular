import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { logoprint } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-view-mt103',
  templateUrl: './view-mt103.component.html',
  styleUrls: ['./view-mt103.component.scss']
})
export class ViewMT103Component implements OnInit {
  logo : string = '';
  fileString : any;
  encryptedString : any;
  recentTransaction = '/accounts/account-details/recenttransaction';
  htmlData:any;
  pdfData: any;
  constructor(private router : Router, private translateService: TranslateService,
    private sanitizer: DomSanitizer, private downloadAsPdf:downloadAsPdf) {
    const navigation : any = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      file : any
    };
    if(state && state.file){
      this.fileString = state.file;
      this.encryptedString = atob(state.file);
      this.encryptedString = this.encryptedString.slice(6, this.encryptedString.length -1 );
    }
   }

  ngOnInit(): void {
    this.logo = logoprint();
    if(this.encryptedString){
      this.renderHtml();        
    }
  }
  checkData : any;
  renderHtml(){
    const parser = new DOMParser();
    const html = parser.parseFromString(this.encryptedString, "text/html");
    let messageId =   html.getElementsByTagName("id")[0].childNodes[0].nodeValue;
    html.getElementsByTagName("id")[0].childNodes[0].nodeValue =  '00001 ' + messageId;
    let messageType =   html.getElementsByTagName("type")[0].childNodes[0].nodeValue;
    html.getElementsByTagName("type")[0].childNodes[0].nodeValue =  '00002 ' + messageType; 
    let messageSequence =   html.getElementsByTagName("sequence")[0].childNodes[0].nodeValue;
    html.getElementsByTagName("sequence")[0].childNodes[0].nodeValue =  '00003 ' + messageSequence; 
    this.encryptedString = html.body.innerHTML;
    this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.encryptedString); // this line bypasses angular scurity
    // this.checkData = this.sanitizer.bypassSecurityTrustHtml('<p>{1:F01NCBKSAJ0XXXX0000000000}{2:I103BOFAUS30XXXXN2}{3:{108:51695}{111:001}{121:3ba8a6d1-5715-480b-9ca5-602cc497ab21}}{4:\n:20:NCBK82423005AKPB\n:23B:CRED\n:32A:230105USD3,19\n:33B:SAR12,\n:36:0,2657\n:50K:/05100001194402\nKNNK s\nSAUDI ARABIA\n:57A:CITIUS30XXX\n:59:/05100000314606\nDKNOV\nNew York\nNew York\n:70:Buying a property\nTest Relation\n:71A:SHA\n:71F:USD0,\n-}</p>');
    // this.checkData = "{1:F01NCBKSAJ0XXXX0000000000}{2:I103BOFAUS30XXXXN2}{3:{108:51695}{111:001}{121:3ba8a6d1-5715-480b-9ca5-602cc497ab21}}{4:\n:20:NCBK82423005AKPB\n:23B:CRED\n:32A:230105USD3,19\n:33B:SAR12,\n:36:0,2657\n:50K:/05100001194402\nKNNK s\nSAUDI ARABIA\n:57A:CITIUS30XXX\n:59:/05100000314606\nDKNOV\nNew York\nNew York\n:70:Buying a property\nTest Relation\n:71A:SHA\n:71F:USD0,\n-}".split('\n');
    
    let splitString = this.encryptedString.split('\n');
    splitString.splice(0,1);
    splitString.splice(19,1);
    this.checkData = splitString;
  }

  downloadPDF(){
    //Download MT103 File
    let messageId = document.getElementsByTagName('id')[0].innerHTML;
    let messageType = document.getElementsByTagName('type')[0].innerHTML;
    let messageSequence = document.getElementsByTagName('sequence')[0].innerHTML;
    this.pdfData = 
      [
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_SWIFT_COPY_DET'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'},
        {  type: 'textonly', value: messageId , y: 65},
        {  type: 'textonly', value: messageType , y: 70},
        {  type: 'textonly', value: messageSequence , y: 75}
        ]

      let yaxis = 75;
      for(var i = 0; i < this.checkData.length; i++){
        
          yaxis = (i == 1) ? yaxis + 10 :  yaxis + 5;
          let sno =  String( i + 4 ).padStart(5, '0');   //format 5 digits
        this.pdfData.push(
          {  type: 'textonly', value:  sno + " " + this.checkData[i] , y:yaxis}
        )
      }
      this.pdfData.push(
        { type: 'save', value:'SwiftDetails.pdf'}
      )
      this.downloadAsPdf.downloadpdf(this.pdfData);

  }

}
