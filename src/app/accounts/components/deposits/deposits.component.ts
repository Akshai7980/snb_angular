import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent implements OnInit {
  @ViewChild('paginator')
  paginator!: MatPaginator;
  dataLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData
  dataSourceToPass:any;
  displayedColumns: string[] = ['nickName', 'fullName', 'accNumber','status', 'accBalance','equivalentAmt','action'];
  dataSource: any;
  isNickNameEditible=false;
  editSelected=true;
  curerentSelection:any;
  noRecordFoundInfoObj = {
    "msg":"LBL_NO_INVSTMNT_FND", 
    "btnLabel":"Invest Now", 
    "btnLink": "/dashboard",
    "showBtn": "true",
    "showMsg": "true",
    "showIcon": "true"
  };
  norecordflag:boolean = false;
  constructor(private accountService:AccountDetailsService, private router:Router) { 
    this.rootScopeData.activeTabName = 'deposits' }

  ngOnInit(): void {
    
    this.getCasaInfo();
      }
      getCasaInfo(){
        this.accountService.getdeposistsActDtls().subscribe((res:any)=>{
          this.dataSource = res.DATA.ALL_RECORDS;
          this.rootScopeData.depositeSummaryCount = res.DATA.TOTAL_COUNT;
          // console.log(res)
          this.dataLength=this.dataSource.length;
              this.dataSourceToPass= new MatTableDataSource(this.dataSource)
              this.dataSourceToPass.paginator=this.paginator;
              // console.log(this.dataSourceToPass)
              if(this.dataSource ===null || this.dataSource === '' || this.dataSource === undefined){
                this.norecordflag = !this.norecordflag;
              }
        })
      }
    isSelected(row:any){
      this.router.navigate(['/accounts/account-details'])
    }
    nickNameEditClick(i:any){
      this.curerentSelection=i;
      this.editSelected=false
        this.isNickNameEditible=false;
      }
      closeNickName(i:any){
        this.curerentSelection = null;
      }
      isSelectedRow(res:any){ 
        if(this.editSelected){
          this.isSelected(res)
        }
        else{
          this.editSelected=true;
        }
      }
    }