import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRows } from 'src/app/utility/tableFilter';

@Component({
  selector: 'app-e-pay-debit',
  templateUrl: './e-pay-debit.component.html',
  styleUrls: ['./e-pay-debit.component.scss']
})
export class EPayDebitComponent implements OnInit {
  @Input() dataSource : any;
  rootScopeData: RootScopeDeclare = RootScopeData
  @Input() IS_ALL_SELECTED : any;
  dummySource :any =[]
  isProceed : boolean =false;
  ccy : any;
  selectedRows: any = [];
  displayedColumns: string[] = [
    'checkbox',
    'accNo',
    'nickName',
    'fullName',
    'status',
    'balance',
  ];
  @Output() selectedData = new EventEmitter();
  @Output() debitIconClick =new EventEmitter();
  constructor() { }
  

  ngOnInit(): void {
  }

  reset(row: any) {
    if (row == 'iconClick') {
      this.debitIconClick.emit(true);
      this.displayedColumns = [
        'checkbox',
        'accNo',
        'nickName',
        'fullName',
        'status',
        'balance',
      ];
      this.dummySource=[]
      this.isProceed = false
    }
  }

  triggerSearchFilter(event:any){
    showFilteredRows('accountsData', event.target.value);
  }
  checked(value:any,index:any){
    this.dataSource[index].IS_SELECTED = !this.dataSource[index].IS_SELECTED;
    if(this.dataSource[index].IS_SELECTED){
        this.selectedRows.push(this.dataSource[index]);
    }else {
    for(let i=0; i<this.selectedRows.length; i++){
      if (this.dataSource[index].accNo == this.selectedRows[i].accNo) {
        this.selectedRows.splice(i, 1);
      }
    }
  }
  }
  selectAll(event:any){
    this.IS_ALL_SELECTED = !this.IS_ALL_SELECTED;
    if(this.IS_ALL_SELECTED){
      this.selectedRows=this.dataSource;
    }else{
      this.selectedRows=[];
    }
    this.dataSource.forEach((element:any) => {
      element.IS_SELECTED=this.IS_ALL_SELECTED;
    });

  }
  proceedNext(){
    if(this.selectedRows.length>10){
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_MORE_ACCOUNT_SELECTED_ERR_MSG";
    }else if(this.selectedRows.length===0){
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_SLCT_ACCOUNT_ERR_MSG";
    }else{
      this.displayedColumns=[
        'accNo',
        'nickName',
        'fullName',
        'status',
        'balance',
        'action'
      ]
      if(this.selectedRows.length===1){
        this.dummySource=this.selectedRows
      }else{
        this.dummySource=[{
          IS_DUMMY:true,
          data:'',
          IS_SELECTED:true
        }]
      }
      this.isProceed=true;
      this.selectedData.emit(this.selectedRows)
    }
  }
}
