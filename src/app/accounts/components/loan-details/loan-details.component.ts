import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { AccountDetailsService } from '../../services/account-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
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
export class LoanDetailsComponent implements OnInit {
  isEdit:boolean=true;
  isShow:boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  loanSummaryData: any;
  loanDetailsData: any;
  isLoadingCompelete = true;

  constructor(public accService:AccountDetailsService,private router: Router) { }

  ngOnInit(): void {
    //debugger;
    this.loanSummaryData = this.rootScopeData.loanSummaryobject;
    this.getLoanDetails();
  }

  getLoanDetails(){
    this.isLoadingCompelete = false;
    this.accService.loanDetailsApiCall(this.loanSummaryData.LOAN_OD_ACC_NO).subscribe(
      (res:any) =>{
        this.isLoadingCompelete = true;
        this.loanDetailsData = res.DATA.cms_loan_detail_response;
        console.log(this.loanDetailsData);
        
      },
      (error:any) =>{ 
        this.isLoadingCompelete = true;
      }
    )
  }

  isEdit_click(){
    this.isEdit = !this.isEdit;
  }
  showDetails(){
    this.isShow = !this.isShow
  }
  changeName(){
    this.isEdit = !this.isEdit;
  }
  onBackArrowClick(){
    this.router.navigate(['/accounts/accounts-inquiry/loans']);
  }

}
