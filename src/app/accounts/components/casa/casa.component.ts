import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions } from 'src/app/utility/paginator-config';
import { AccountDetailsService } from '../../services/account-details.service';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
import { omit_special_char } from 'src/app/utility/common-utility';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';


@Component({
  selector: 'app-casa',
  templateUrl: './casa.component.html',
  styleUrls: ['./casa.component.scss']
})
export class CasaComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  @ViewChild(MatSort) sort !: MatSort;
  @Output() onEnabledProp = new EventEmitter<any>();

  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceToPass: any;
  displayedColumns: string[] = ['ALIAS_NAME', 'OD_ACC_NO', 'STATUS', 'CURR_AVAIL_BAL_AMT', 'HIDE_CURR_AVAIL_BAL_AMT','EQU_AMT','HIDE_EQU_AMT', 'COD_CORECIF', 'action'];
  dataSource: any;
  noRecordFoundInfoObj: any;
  norecordflag: boolean = false;
  responseHeader: any;
  totalRecords: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  isLoadingCompelete = true;
  errorMessage: boolean = false;
  nickName: any;
  editedNickName: any;
  enablePropertty:boolean =true;
  routeDetailScreen:any;
  contextMenuList: any = [];

  constructor(private accountService: AccountDetailsService, private router: Router,private service: CommonInjectServiceService) {
    this.rootScopeData.activeTabName = 'casa';
    this.rootScopeData.accountsActiveModule = 'CASASUMMARY';
    this.rootScopeData.filterTableId = 'accountsInquirytable';

    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.contextMenuList = [
      { "display_key": 'LBL_VIEW_E_STATEMENT', "value": 'viewEStatement', "item_id": 'VIEW_E-STATEMENT' },
      { "display_key": 'LBL_GENERATE_STATEMENT', "value": 'generateStatement', "item_id": 'GENERATE_STATEMENT' }
    ]
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_CASA_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getCasaInfo();
    this.routeDetailScreen="accounts/account-details/recenttransaction";
  }
  triggerDropdownFilter(event:any):void{
   
  //  showFilteredRows('accountsInquirytable', event); 
  let columnsToSearch = [     
    {"name":"COD_CORECIF", "fieldType":"string"}    
  ];
  // debugger
  let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event);
  this.dataSourceToPass= new MatTableDataSource(tableData); 
  this.dataSourceToPass.paginator = this.commonPagination.paginator;  
 
  }
  triggerSearchFilter(event:any){
    let columnsToSearch = [ 
      {"name":"ALIAS_NAME", "fieldType":"string"},
      {"name":"OD_ACC_NO", "fieldType":"string"},
      {"name":"STATUS", "fieldType":"string"}, 
      {"name":"COD_CORECIF", "fieldType":"string"},
      {"name":"OD_CCY_CODE", "fieldType":"ccy1"},
      {"name":"EQU_AMT", "fieldType":"amount1"},
      {"name":"CURR_AVAIL_BAL_AMT", "fieldType":"amount1"},
      
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData); 
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
  }

  refreshSummary() {
    this.getCasaInfo();
  }
  getCasaInfo() {
    let flag = "N";
    this.isLoadingCompelete = false;
    this.accountService.getcasaActDtls(flag).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.HEADER_VALUE !== undefined) {
        this.responseHeader = res.HEADER_VALUE;
      }
      if(res.status === 500){
        this.enablePropertty = false;
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }
      else {
       // debugger;
      this.dataSourceToPass = res.DATA.ALL_RECORDS;
      this.dataSource = this.dataSourceToPass;
      this.norecordflag = false;
      this.service.changeData("true");  //invoke new Data
      this.dataSourceLength = this.dataSourceToPass.length;
      this.dataSourceToPass = new MatTableDataSource(this.dataSource);
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
      this.dataSourceToPass.sort = this.sort;
      this.totalRecords = res.DATA.TOTAL_COUNT;
      this.dataSourceToPass.sortingDataAccessor = (item:any, property:any) => {
        switch (property) {
          case 'CURR_AVAIL_BAL_AMT': {
            return Number(item[property]);
          }
          default: {
            return item[property];
          }
        };
      }
      this.rootScopeData.accountsSummaryObject = res.DATA.ALL_RECORDS;
      this.rootScopeData.accountsSummaryCount = res.DATA.TOTAL_COUNT;
      }
      if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0) {
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }

    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.service.changeData("false");  //invoke new Data
    }
    )
  }
  isSelected(row: any) {
    this.rootScopeData.accountsSummaryObject = row;
    this.router.navigate(['accounts/account-details/recenttransaction']);
  }

  nickNameEditClick(i: any) {
    this.errorMessage = false;
    document.querySelectorAll('.dslk_flex').forEach(function (obj) {
      obj.classList.remove('edit');
    });
    document.getElementById('nickNameCntr_' + i)?.classList.add('edit');
    let availableNickName: any;
    availableNickName = document.getElementById('nickNameCntr_' + i)?.querySelector('.nickNameLabel')?.innerHTML;
    if(availableNickName === "" || availableNickName === undefined)
    {
      this.editedNickName = null;
    }
    else{
      this.editedNickName = availableNickName;
    }
    
  }

  closeNickName(i: any) {
    this.editedNickName = '';
    document.getElementById('nickNameCntr_' + i)?.classList.remove('edit');
  }

  acceptNickName(i: any, data: any) {
    this.nickName = this.nickName.trim();
    if (this.nickName) {
      this.isLoadingCompelete = false;
      this.accountService.updateNickName(data, this.nickName).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.status === "SUCCESS") {
          // this.dataSource[i].ALIAS_NAME = this.nickName;
          this.getCasaInfo();
        }
        this.nickName = ""
        document.getElementById('nickNameCntr_' + i)?.classList.remove('edit');
      }, (error: any) => {
        this.isLoadingCompelete = true;
        // this.rootScopeData.showSystemError = true;
      }
      )
      this.editedNickName = '';
    }else{
      this.errorMessage = true;
      return
    }

    document.getElementById('nickNameCntr_' + i)?.classList.remove('edit');

  }

  getUpdatedNickName(event: any) {
    this.nickName = event.target.value;
  }


  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getCasaInfo();
  }

  selectedRecord(event: any ,element :any){
    this.rootScopeData.accountsSummaryObject = element;
    event?.stopPropagation();
  }

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
   menuClick(event:any){
    
    if(event.item_id==="IBAN"){
      // this.isLoadingCompelete=false
      let params ={
        "moduleId": "DOWNIBANLETR",
        "accountNo": event.accNo,
        "cifNo": this.rootScopeData.dataFromContextMenu.COD_CORECIF,
      };
      let exportType ="PDF"
      this.accountService.downlodIBAN(params).subscribe((response:any)=>{
        // this.isLoadingCompelete=true
        const src = 'data:application/'+response.dataValue.format+';base64,'+ response.dataValue.filecontent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = response.dataValue.filename; //Dynamic FileName
        link.click();
        link.remove();
      }, error => {
      
      })
    }
   }
}
