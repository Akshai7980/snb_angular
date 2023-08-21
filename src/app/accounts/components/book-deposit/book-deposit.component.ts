import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-book-deposit',
  templateUrl: './book-deposit.component.html',
  styleUrls: ['./book-deposit.component.scss']
})
export class BookDepositComponent implements OnInit {
  displayedColumns: string[] = ['nickName', 'accNumber', 'accStatus', 'balance', 'action'];
  dataSource:any=[];
  bookDepositeInfo:any;
  settlementChecked=false;
  termsAccept=false;
  rowLength=0;
  valueDate=new Date();

// formfields

product="";
amount="";
tenure="";
renewOption="";
principle="";
interest="";
//errorCodes

productError=false;
amountError=false;
tenureError=false;
renewError=false;
principleError=false;
interestError=false;

rootScopeData:RootScopeDeclare=RootScopeData
  constructor(private accountService:AccountDetailsService) {this.rootScopeData.lhsActiveComp = 'bookDeposit' }

  ngOnInit(): void {
    this.getBookDepositData();
  }
  getBookDepositData(){
    this.accountService.getGenerateStatementInfo().subscribe((chequeBookData:any)=>{
      this.bookDepositeInfo=chequeBookData.DATA.ALL_RECORDS;
      this.dataSource=this.bookDepositeInfo;
          })
  }
  selectedRow(row:any){
    if(this.dataSource.length > 1){
    this.dataSource = [row];
    this.rowLength=this.dataSource.length;

  }
    else{
      this.dataSource = this.bookDepositeInfo;
      this.rowLength=this.dataSource.length
    }
  }
  submit(){
    this.productError=this.product ? false : true;
    this.amountError=this.amount ? false : true;
    this.tenureError=this.tenure ? false : true;
    this.renewError=this.renewOption ? false : true;
    if(this.settlementChecked){
    this.principleError=this.principle ? false : true;
    this.interestError=this.interest ? false : true;
  }
}
}
