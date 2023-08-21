import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { defaultPageOption, pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-secondary-pagination',
  templateUrl: './secondary-pagination.component.html',
  styleUrls: ['./secondary-pagination.component.scss']
})
export class SecondaryPaginationComponent implements OnInit {

  // displayNumberStart: number = 0;
  // displayNumberEnd:number = 0;
  length: any;
  fromRow:any;
  toRow:any;
  tablePageSize: any;
  storedPageSize:any;
  // totalRecordsPerRequest=50;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() dataSourceLength: any;
  @Input() currentRecord: any;
  @Input() totalRecords: any;
  @Output() onPaginationChange = new EventEmitter();
  @ViewChild('paginator') paginator!: MatPaginator;
  pageSize: number = 0;
  @Input() flagForRefreshPage: boolean = false;
  @Input() previousRecordID : any;
  @Input() nextRecordID : any;
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    //debugger;
    // this.tablePageSize = pageOptions;
    
    this.tablePageSize = [10];
    this.fromRow = parseInt(this.dataSourceLength) + 1;
    this.toRow = (parseInt(this.dataSourceLength) + totalRecordsPerRequest) > this.totalRecords ? this.totalRecords : parseInt(this.dataSourceLength) + totalRecordsPerRequest;
    // var e = document.querySelectorAll(".mat-paginator-navigation-next")[0];
    // document.getElementsByClassName("mat-paginator-navigation-next") as HTMLCollectionOf<HTMLElement>;
    // e.setAttribute("disabled", "false");
    // e.classList.remove("mat-button-disabled");

  }

  ngOnChanges() {
    
    this.ref.detectChanges();
    this.paginator.initialized.subscribe(
       (event:any) => {
         event = this.paginator;
        // this.setPagination(event);
        // this.findTotalPages(event);
        if(this.storedPageSize){
          this.paginator.pageSize = this.storedPageSize;
        }else{
          this.paginator.pageSize = this.tablePageSize;
        }
        
       }
    );
  }

  pageEvents(event: any) {
    let params = {}
    if(event.previousPageIndex > event.pageIndex){
      params={
        pageClick: "Back",
        pageSize: event.pageSize,
        pageIndex: event.pageIndex
      }
    }else{
      params={
        pageClick: "Next",
        pageSize: event.pageSize,
        pageIndex: event.pageIndex
      }
    }   
    
    this.onPaginationChange.emit(params);
    
  }

  // findTotalPages(e: any) {
  //   document.querySelectorAll(".mat-paginator-range-label")[0].innerHTML = (e.pageIndex+1) + ' of ' + Math.ceil(this.totalRecords / e.pageSize);
  // }
    
    

}
