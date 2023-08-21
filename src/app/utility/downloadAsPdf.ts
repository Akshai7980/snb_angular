import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import { Amirifont } from 'src/app/utility/fontConversion';
@Injectable({
    providedIn: 'root',
  })
export class downloadAsPdf{
    constructor( public translateService:TranslateService){

    }
    downloadpdf(resData:any){
          let PDF = new jsPDF('p', 'mm', 'a4');
          let pdfWidth = PDF.internal.pageSize.getWidth();
          let img:any = new Image()
          PDF.setFontSize(6);
          PDF.addFileToVFS(
            "Amiri-Regular-normal.ttf",
            Amirifont
          );
          PDF.addFont(
            "Amiri-Regular-normal.ttf",
            "Amiri-Regular",
            "normal"
          );
          PDF.addImage('assets/images/snb-logo-print.png','png', 90, 3, 30, 20);
          PDF.rect(10,38,190,160);
          PDF.rect(15, 60,180,130);
      PDF.setTextColor(63, 153, 124);
      PDF.text("The Saudi National Bank | A Saudi Joint Stock Company | Paid-up Capital SAR 44,780,000,000 | VAT Number 300002471110003 | C.R. 4030001588", 30,220);
      PDF.text("Under the supervision and control of The Saudi Central Bank | Licensed pursuant to Royal Decree No. 3737 issued on 20/4/1373H (corresponding to 26/12/1953G",23,227)
      PDF.text("Head Office The Saudi National Bank Tower King Abdullah Financial District | King Fahd Road | 3208 - Al Aqeeq District | Unit No. 778 | Riyadh 13519 – 6676 | 920001000 | www.alahli.com | Any reference ",10,234)
      PDF.text("to the National Commercial Bank, NCB or the Bank shall mean the Saudi National Bank",60,237)
          for(var i=0; i<resData.length; i++){
               if(resData[i].type=='setFontSize')
              {
                PDF.setFontSize(resData[i].size);
              }
              else if(resData[i].type=='setDrawColor')
              {
                PDF.setDrawColor(resData[i].val)
              }
              else if(resData[i].type=='drawRect')
              {
                PDF.rect(resData[i].x,resData[i].y, resData[i].w, resData[i].h, resData[i].s)
              }
              else if(resData[i].type=='setFillColor')
              {
                PDF.setFillColor(resData[i].val1,resData[i].val2,resData[i].val3)
              }
              else if(resData[i].type=='setFont')
              {
                PDF.setFont(resData[i].fontName, resData[i].fontStyle);
              }
              else if(resData[i].type=='title'){
                PDF.text(resData[i].value, resData[i].x, resData[i].y);
              }
              else if(resData[i].type=='setTextColor'){
                // console.log(resData[i].val1, resData[i].val2, resData[i].val3)
                PDF.setTextColor(resData[i].val1, resData[i].val2, resData[i].val3);
              }
              else if(resData[i].type=='heading'){
                PDF.text(resData[i].value, (pdfWidth/2 - 85), resData[i].y, {maxWidth: 170})
              } 
              else if(resData[i].type=='text'){
                  PDF.text(resData[i].value, (pdfWidth/2 - 33), resData[i].y, {maxWidth: 120})
              }
              else if(resData[i].type=='textonly'){
                PDF.text(resData[i].value, (pdfWidth/2 - 85), resData[i].y, {maxWidth: 150})
            }
              else if(resData[i].type=='table'){
                PDF.table(resData[i].x, resData[i].y, resData[i].body, resData[i].head, {
                  headerBackgroundColor: '#525659',
                  fontSize: 8,
                  headerTextColor: "#ffffff"
                })
              }
              else if(resData[i].type=='save'){
                PDF.save(resData[i].value)
            }
              else if(resData[i].type=='print'){
               PDF.autoPrint();
                 PDF.output("dataurlnewwindow"); 
           }
             
        }
         
         
    }
}