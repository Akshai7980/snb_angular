import { Component, OnInit } from '@angular/core';
import { AccountDetailsService } from '../../services/account-details.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { omit_special_char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({height: "0px", opacity: 0,overflow: 'hidden'}),
          animate('300ms', style({ height: "*", opacity: 1}))
        ]),
        transition(':leave', [
          style({ height: "*", opacity: 1, overflow: 'hidden'}),
          animate('300ms', style({ height: "0",opacity: 0, overflow: 'hidden'}))
        ])
      ]
    )
  ]
})
export class AccountDetailsComponent implements OnInit {
  isEdit:boolean=true;
  isShow:boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  accountDetailsData: any;
  enteredNickName:any;
  isLoadingCompelete = true;
  errorMessage: boolean = false;
  detailedDataSrc:any=[];

  constructor(public accService:AccountDetailsService,private router: Router) { }

  ngOnInit(): void {
    this.accountDetailsData = this.rootScopeData.accountsSummaryObject;
    this.getAccountDetails();
  }

  getAccountDetails()
  {
    this.isLoadingCompelete = false;
    this.accService.getAccountDetails(this.accountDetailsData).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      this.detailedDataSrc = res.DATA.ACC_DETAILS;
      this.rootScopeData.accDetailsObject = this.detailedDataSrc;
    }, (error: any) => {
      this.isLoadingCompelete = true;
    }
    )
  }

  isEdit_click(){
    this.isEdit = !this.isEdit;
    this.enteredNickName=this.accountDetailsData.ALIAS_NAME;
    this.errorMessage = false;
  }
  showDetails(){
    this.isShow = !this.isShow
  }
  changeName(){
    if (this.enteredNickName.trim()) {
      this.isLoadingCompelete = false;
      this.accService.updateNickName(this.accountDetailsData, this.enteredNickName).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.status === "SUCCESS") {
          this.accountDetailsData.ALIAS_NAME = this.enteredNickName;
        }
        this.enteredNickName = ""
        this.isEdit = !this.isEdit;
      }, (error: any) => {
        this.isLoadingCompelete = true;
        // this.rootScopeData.showSystemError = true;
      }
      )
    }else{
      this.errorMessage = true;
      return
    }
  }
  onBackArrowClick(){
    this.rootScopeData.backToPagination.resFlag = 'Y';
    this.router.navigate(['/accounts/accounts-inquiry/casa']);
  }
  
  // nickNameValidation(val: any) {
  //   return omit_special_char(val)
  //  }

   nickNameValidation(val: any) {
    let typedValue = val,
    regexp = new RegExp('^[\p{Arabic}\s\p{N}]+$')
      if( typedValue.key === "!" || typedValue.key === "@" || typedValue.key ==="#" || typedValue.key === "$" || typedValue.key === "%" || typedValue.key === "^" || typedValue.key === "&" || typedValue.key === "*" || typedValue.key === "("|| typedValue.key === ")"|| typedValue.key === "_"|| typedValue.key === "-"|| typedValue.key === "+"|| typedValue.key === "="|| typedValue.key === "{" || typedValue.key === "}" || typedValue.key === "[" || typedValue.key === "]" ||
      typedValue.key === "|" || typedValue.key === "'" ||  typedValue.key === ":" || typedValue.key === ";" || typedValue.key === "/" || typedValue.key === "." || typedValue.key === "," || typedValue.key === ">"|| typedValue.key === "<"|| typedValue.key === "?"|| typedValue.key === "~"|| typedValue.key === "`"|| typedValue.keyCode === 34 || typedValue.keyCode === 92 ){
      return false;
     }else{
       return true;

     }
   }
}
