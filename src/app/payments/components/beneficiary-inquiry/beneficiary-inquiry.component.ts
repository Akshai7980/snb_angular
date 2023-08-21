import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { pageOptions } from 'src/app/utility/paginator-config';
import { CommonService } from 'src/app/common-components/services/common.service';

@Component({
  selector: 'app-beneficiary-inquiry',
  templateUrl: './beneficiary-inquiry.component.html',
  styleUrls: ['./beneficiary-inquiry.component.scss']
})
export class BeneficiaryInquiryComponent implements OnInit {
activateSelectedButton=false;
dataSource:any=[];
isLoadingCompelete = true;
displayedColumns:string[]=['checkbox','AccountNumber','Nickname','BankName','RefNum','Type','Status','Action']
selectedAll: any;
printSection:string="";
noRecordFoundInfoObj: any;
norecordflag: boolean = false;
responseHeader: any;
sortDirection:string='';
currentColumn: string = '';
rootScopeData:RootScopeDeclare=RootScopeData;
beneficiarySelected:any=[];
dataSourceLength: any;
totalRecords: any;
dataSourceToPass: any;
tablePageSize: any;
fromRow: any;
toRow: any;
advSearchPeriod = "";
advSearchSearchWithin = "";
advSearchSortOrder = "";
advSearchFromDate = "";
advSearchToDate = "";
filterflag:string ="";
filterconstraint:any;
filterfield:any;
filterValue:any;
advancedSearchBeneValues :any;
advancedSearchStatus:any;
advancedSearchType:any;
filterArray:any;
@ViewChild('paginator')
commonPagination!: PaginationComponent;
selectedArray: any=[];
isRefreshFlag: boolean = false;
beneficiaryInquiryActiveTabName: any = "Transfer Within Bank";
selectedBeneTab: string = "BKSIBT";
refreshClickedFlag = false;
isShownDocPrint :boolean=true;
shownPrint:boolean=false;
isShownCheckBox:boolean=true;
isEnabledCheckBox:boolean=true;
constructor(public paymentservice:PaymentsServiceService,public dialog: MatDialog,private router: Router) {
  this.tablePageSize = pageOptions;
  this.fromRow = 1;
  this.rootScopeData.advSearchCurrentPage = 'beneficiaryInquiry'
 }
ngOnInit(): void {
  this.printSection="beneficiaryInquiryPrintSection";
  this.noRecordFoundInfoObj = {
    "msg": "LBL_NO_BENEFICIARY_FOUND",
    "btnLabel": "Apply Now",
    "btnLink": "/dashboard",
    "showBtn": "true",
    "showMsg": "true",
    "showIcon": "true"
  };

  let defaultPassingObj ={  
    "filterField": "",
    "filterConstraint": "contains",
    "filterValue": "",
  }
  this.filterArray =[defaultPassingObj];
  this.currentColumn = 'makerDate';
  this.sortDirection = 'desc';

  this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
}

triggerSearchFilter(event:any): void {
  let columnsToSearch = [ 
    {"name":"accountNo", "fieldType":"string"},
    {"name":"beneId", "fieldType":"string"}, 
    {"name":"beneBankName", "fieldType":"string"},
    {"name":"beneName", "fieldType":"string"},
    {"name":"odLibRefNo", "fieldType":"string"},
    {"name":"subProduct", "fieldType":"string"}
  ];
  let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
  this.dataSourceToPass= new MatTableDataSource(tableData);
  this.commonPagination.paginator.firstPage();
  this.dataSourceToPass.paginator=this.commonPagination.paginator;
  // showFilteredRows('beneficiaryInquiryContainer', event.target.value); 
}
refreshSummary(){
  this.fromRow = 1
  this.toRow = undefined;
  this.isRefreshFlag = true;
  this.dataSource = [];
  this.totalRecords = this.totalRecords;
  this.commonPagination.paginator.pageSize = 5;
  this.commonPagination.paginator.firstPage();
  this.refreshClickedFlag = true;
  this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
  this.selectedAll = false;
  this.activateSelectedButton = false;
}
getBeneficiaryInquiryDetails(selectedTab:any){
  this.isLoadingCompelete = false;
  let params={
    sortcolumn :this.currentColumn,
    sortDirection:this.sortDirection,
    fromRow : this.fromRow,
    toRow : this.toRow,
    flag:this.filterflag,    
    subProdCode: selectedTab
  }

  this.isShownCheckBox = true;
  this.selectedAll=false;
  this.activateSelectedButton = false;

  // this.isEnabledCheckBox = false;

  this.paymentservice.getBeneficiaryInquiry(params,this.filterArray).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
      if (response.headerValue !== undefined) {
        this.responseHeader = response.headerValue;
      }
      if(response.status === 500){
        this.norecordflag = true;
      }
      else {
        if(this.isRefreshFlag === false){
          response.data.forEach((value :any)=> {
            if(value.isCallBackSuccess === 'Inactive'){
              this.isShownCheckBox = false;
            }            
          });
          this.dataSource = this.dataSource.concat(response.data);          
          this.norecordflag = false;
        }else{
          response.data.forEach((value :any)=> {
            if(value.isCallBackSuccess === 'Inactive'){
              this.isShownCheckBox = false;
            }           
          });
          this.dataSource = response.data;
          this.norecordflag = false;
          this.isRefreshFlag = false;
        }
        this.refreshClickedFlag = false;
      // this.dataSource = response.data;
      this.dataSourceLength = this.dataSource.length;
      this.totalRecords = response.headerValue.totalCount?response.headerValue.totalCount : this.dataSourceLength;
      this.dataSourceToPass = new MatTableDataSource(this.dataSource);
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    
      }
      if(response.data === null || response.data === undefined || response.data === "" || response.data.length===0){
        this.norecordflag = true;
      }
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      }
  )
}

  triggerCheckAll(): void {

  if(this.selectedAll) {
    if(this.dataSource && this.dataSource.length > 0) {
      this.activateSelectedButton = true;
    }
  }else {
    this.activateSelectedButton = false;
    this.selectedArray = [];
  }
 
  for (let i = 0; i < this.dataSource.length; i++) {
    this.dataSource[i].selected = this.selectedAll;
    if(this.selectedAll && this.dataSource[i].isCallBackSuccess === 'Inactive'){
      this.selectedArray.push(this.dataSource[i])
    }
  }
}

triggercheckIfAllSelected(selectedObj:any,index:any,isChecked:any) {
    this.activateSelectedButton = false;
    for(let i=0;i<this.dataSource.length;i++){
      if(i === index && isChecked) {
        this.activateSelectedButton = true;
        this.selectedAll = true;
        this.selectedArray.push(selectedObj);
      }
      if(!isChecked){
        for(let j=0;j<this.selectedArray.length;j++){
          if(this.selectedArray[j].odLibRefNo === selectedObj.odLibRefNo){
            this.selectedArray.splice(j,1);
          }
        }
      }
    }
    for (let i = 0; i < this.dataSource.length; i++) {
      if(!this.dataSource[i].selected) {
        this.selectedAll = false;
        break;
      }
    }
}

checkBoxClick(event:any){
  event.stopImmediatePropagation();
}

deleteBeneficiary(event:any,row:any){
  event.stopImmediatePropagation();
  let showContactDetails = false;
  if(row.odSubProd === 'TELTRF'){
    showContactDetails = true
  }else{
    showContactDetails = false
  }
  Object.assign(row, { showContactDetailsFlag: showContactDetails},{beneInquiry:"true"});
  this.rootScopeData.pendingActivitiesSingleBeneficiaryObject= row;
  this.isLoadingCompelete = false;
  this.paymentservice.getSingleBeneficiaryDetails(row.beneId,row.odSubProd).subscribe((data:any)=>{
    this.isLoadingCompelete = true;
    if(data.data){
      this.rootScopeData.singleBeneficiaryDetailsObject = data.data;
      this.router.navigate(['/payments/deleteBeneficiary']);
    }
  }, (error: any) => {
    this.isLoadingCompelete= true;
  })
}


sortColumn(colName: any) {
  this.currentColumn = colName;
  if(this.sortDirection === '' ) {
    this.sortDirection = 'asc';
  }else if(this.sortDirection === 'asc') {
    this.sortDirection = 'desc';
  }else {
    this.sortDirection = '';
  }

  this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
}

activateBeneficiary(data:any){
  let beneficiarySelectedSingle:any=[];
  beneficiarySelectedSingle.push(data);
  this.rootScopeData.selectedBeneficiary = beneficiarySelectedSingle;
  this.router.navigate(['/payments/beneficiaryActivation']);
}
clickDisabledCallIcon(event:any){
  event.stopImmediatePropagation();
}
activateSelectedBeneficiary(){

  this.rootScopeData.selectedBeneficiary = this.selectedArray;
  this.router.navigate(['/payments/beneficiaryActivation']);
}
paginationChangeClick(params: any) {
  this.fromRow = params.fromRow;
  this.toRow = params.toRow;

  this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
}

goToBeneficiaryDetails(row:any){
  let showContactDetails = false;
  if(row.odSubProd === 'TELTRF'){
    showContactDetails = true
  }else{
    showContactDetails = false
  }
  Object.assign(row, { showContactDetailsFlag: showContactDetails},{beneInquiry:"true"});
  this.rootScopeData.pendingActivitiesSingleBeneficiaryObject= row;
  this.router.navigate(['payments/beneficiaryDetailsLayout'])
}

advancedSearchApply(event:any){
 this.filterflag ='Y';
 this.filterValue = event.nickname ? event.nickname : event.bankname;
 this.advancedSearchBeneValues = event.beneficiaryType;
 this.advancedSearchStatus = event.status;
 this.advancedSearchType = event.type; 
 this.filterArray =[];
//  let passingObj ={  
//     "filterField": "subProduct",
//     "filterConstraint": "contains",
//     "filterValue": this.advancedSearchBeneValues
// }
// this.filterArray.push(passingObj); 
// let passingObj1 ={  
//   "filterField": "isCallBackSuccess",
//   "filterConstraint": "contains",
//   "filterValue": this.advancedSearchStatus =='Active' ? 'Active' : 'Inactive',
// }
// this.filterArray.push(passingObj1);
let passingObj2 ={  
  "filterField": this.advancedSearchType == 'NickName' ? 'beneId' : 'beneBankName',
  "filterConstraint": "contains",
  "filterValue": this.filterValue,
}
this.filterArray.push(passingObj2);

this.fromRow = 1;

  this.dataSourceToPass = [];
  this.isRefreshFlag = true
 this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
}

selectedTab(selectData:any){
  this.dataSource =[];
  this.dataSourceToPass=[];
  this.filterArray=[];
  if(selectData === 'Transfer Within Bank'){
    this.beneficiaryInquiryActiveTabName = "Transfer Within Bank";
    this.selectedBeneTab = "BKSIBT";    
    this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
  }else if(selectData === 'Domestic Fund Transfer'){
    this.beneficiaryInquiryActiveTabName = "Domestic Fund Transfer";
    this.selectedBeneTab = "BKSRNT";
    this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
  }else if(selectData === 'International Fund Transfer'){
    this.beneficiaryInquiryActiveTabName = "International Fund Transfer";
    this.selectedBeneTab = "TELTRF";
    this.getBeneficiaryInquiryDetails(this.selectedBeneTab);
  }
}
}
