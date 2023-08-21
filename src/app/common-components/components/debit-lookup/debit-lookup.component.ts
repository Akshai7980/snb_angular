import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRows } from 'src/app/utility/tableFilter';

@Component({
  selector: 'app-debit-lookup',
  templateUrl: './debit-lookup.component.html',
  styleUrls: ['./debit-lookup.component.scss']
})
export class DebitLookupComponent implements OnInit ,OnChanges {
  displayedColumns: string[] = ['nickName', 'accNumber', 'fullname', 'Status', 'balance', 'action'];
  dataSource:any;
  debitinfo:any;
  rowLength=0;
  debitlookup=true;
  isSearchShhown:boolean=true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() debitAccDetails : any;
  @Input() clear :any;
  @Input() shownsearch :any;
  @Output() onAccountSelect = new EventEmitter();
  @Input() tableId:any;
  @Input() setWidth=false;
  @Input() isDownArrowNotRequired=false;
  accountDetailsToDisplay: any;
  constructor(private accountService:AccountDetailsService) { }

  ngOnInit(): void {
    this.getdebitinfo()

    // this.accountDetailsToDisplay = this.debitAccDetails;
  }

  ngOnChanges()
  {
   if(this.clear == true)
   {
    this.selectedRow('iconClick');
   }
  }

  triggerSearchFilter(event:any): void {
    showFilteredRows(this.tableId, event.target.value); 
  }

  getdebitinfo(){
    this.accountDetailsToDisplay = Object.assign({}, this.debitAccDetails);
    this.isSearchShhown = this.shownsearch;
    // this.accountService.getdebitlookup().subscribe((debitBookData:any)=>{
    // this.debitinfo=debitBookData.DATA.ALL_RECORDS;  
    // this.dataSource=this.debitinfo;
    // })
  }
  selectedRow(rowData:any){
    if(rowData == 'iconClick') {
      this.getdebitinfo();
      event?.stopPropagation();
      this.isSearchShhown = true;
      this.rootScopeData.sadadMoiFromRest=true

    }else {
      this.accountDetailsToDisplay.data = [];
      this.accountDetailsToDisplay.data[0] = rowData;
      this.isSearchShhown = false;
    }
    this.onAccountSelect.emit(rowData);
    // if(row == 'iconClick') {
    //   this.dataSource = this.debitinfo;
    //   this.rowLength=this.dataSource.length;
    //   event?.stopPropagation();
    // }else {
    //   this.dataSource = [row]
    //   this.rowLength=this.dataSource.length;
    // }
  }
  
}
