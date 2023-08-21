import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';


@Component({
  selector: 'app-short-profile',
  templateUrl: './short-profile.component.html',
  styleUrls: ['./short-profile.component.scss']
})
export class ShortProfileComponent implements OnInit {
  logo ="assets/images/logo.png";
  // profile_pic ="assets/images/profile.png";
  rootScopeData: RootScopeDeclare = RootScopeData;
  userId:string="";
  corpId:string="";
  lastLoginDate:string="";
  lastLoginTime:any;
  profile_pic:any;
  constructor() {  }

  ngOnInit(): void {
    this.profile_pic = `${environment.retriveUserImage}`;
    this.userId =  this.rootScopeData.userInfo.loginID;
    this.corpId =  this.rootScopeData.userInfo.corpID;
    this.lastLoginDate = this.rootScopeData.userInfo.last_login_date;
    if(this.lastLoginDate) {
      let splitedDate = this.lastLoginDate.split(" ");
      this.lastLoginDate = splitedDate[0];
      this.lastLoginTime =  splitedDate[1];
      let timeArr = this.lastLoginTime.split(':');
      // let valdate = new Date().setHours(timeArr[0], timeArr[1]);
      let converted_HH: number = +timeArr[0];
      if(converted_HH > 12){
      let calculatedHrs = converted_HH - 12;
      let timeStamp = "PM";
      let finalTimeStamp = calculatedHrs + ":" + timeArr[1] + " " + timeStamp ;
      this.lastLoginTime = finalTimeStamp;
      }
      else if(converted_HH <= 12){
        let timeStamp = "AM";
        let finalTimeStamp = converted_HH + ":" + timeArr[1] + " " + timeStamp ;
        this.lastLoginTime = finalTimeStamp;
      }
    }
  }

}
