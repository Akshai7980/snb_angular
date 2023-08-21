import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-popup',
  templateUrl: './email-popup.component.html',
  styleUrls: ['./email-popup.component.scss']
})
export class EmailPopupComponent implements OnInit {
  isAttached:boolean=false;
  width = 0
  toAddress:any;
  subject:any;
  message:any;
  isToaddressvalid:boolean = true;
  isSubjectvalid:boolean = true;
  isMessagevalid:boolean = true;
  constructor() { }

  ngOnInit(): void {
    this.attachmentLoading();
  }
  attachmentLoading() {
    setInterval(()=>{
      if(this.width >= 0 && this.width <100){
        this.width +=10;
      }else{
        this.isAttached = true;
      }
    },100)
 

  }
  sendMail(){
    this.isToaddressvalid = this.toAddress ? true : false;
    this.isSubjectvalid = this.subject ? true : false;
    this.isMessagevalid = this.message ? true : false;
    if(this.isToaddressvalid && this.isSubjectvalid && this.isMessagevalid){
      
    }
  }

}
