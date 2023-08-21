import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions, defaultPageOption } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  // displayNumberStart: number = 0;
  // displayNumberEnd:number = 0;
  length: any;
  fromRow:any;
  toRow:any;
  tablePageSize: any;
  storedPageSize:any;
  // totalRecordsPerRequest=50;
  rootScopeData: RootScopeDeclare = RootScopeData;
  translatedOfValue :string ="";
  @Input() dataSourceLength: any;
  @Input() currentRecord: any;
  @Input() totalRecords: any;
  @Output() onPaginationChange = new EventEmitter();
  @ViewChild('paginator') paginator!: MatPaginator;
  pageSize: number = 0;
  @Input() flagForRefreshPage: boolean = false;
  @Input() storedPageIndex: any;
  @Input() pagesizeFlag: boolean = false;
  @Input() setPageSize :any;
  @Input() dashBoardLanCahnges :any;
  constructor(private ref: ChangeDetectorRef,private translateService:TranslateService) { }

  ngOnInit(): void {
    //debugger;

  if(this.setPageSize){
    let pageSizeOption = [5,10,15,50,100];
    this.tablePageSize = pageSizeOption;
  }else{
    this.tablePageSize = pageOptions;
  
  }  


    
  //   this.fromRow = this.dataSourceLength + 1;
  //   this.toRow = (parseInt(this.dataSourceLength) + totalRecordsPerRequest) > this.totalRecords ? this.totalRecords : parseInt(this.dataSourceLength) + totalRecordsPerRequest;
    if(this.rootScopeData.userInfo.mLanguage === 'en_US'){
     this.translatedOfValue = this.translateService.instant('LBL_OF')
    }
    else if(this.rootScopeData.userInfo.mLanguage === 'ar_SA'){
     this.translatedOfValue = this.translateService.instant('LBL_OF')
    }
  }

  ngOnChanges() { 
    if(this.dashBoardLanCahnges){
      if(this.rootScopeData.userInfo.mLanguage === 'en_US'){
        this.translatedOfValue = this.translateService.instant('LBL_OF')
       }
       else if(this.rootScopeData.userInfo.mLanguage === 'ar_SA'){
        this.translatedOfValue = this.translateService.instant('LBL_OF')
       }
    }

    this.fromRow = parseInt(this.dataSourceLength) + 1;
    this.toRow = (parseInt(this.dataSourceLength) + totalRecordsPerRequest) > this.totalRecords ? this.totalRecords : parseInt(this.dataSourceLength) + totalRecordsPerRequest;


    this.ref.detectChanges();
    this.paginator.initialized.subscribe(
       (event:any) => {
        //  debugger;
         event = this.paginator;
        // this.setPagination(event);
        this.findTotalPages(event);
        if(this.rootScopeData.backToPagination.resFlag === 'Y'){
          this.paginator.pageIndex = this.rootScopeData.backToPagination.storedPageIndex;
          this.paginator.pageSize = this.rootScopeData.backToPagination.storedPageSize;
          this.storedPageSize = this.rootScopeData.backToPagination.storedPageSize;
          this.rootScopeData.backToPagination.resFlag = 'N';
        }
        if(this.storedPageSize){
          this.paginator.pageSize = this.storedPageSize;
        }else{
          this.paginator.pageSize = defaultPageOption;
        }
        
       }
    );
    if(this.flagForRefreshPage){
      this.paginator.initialized.subscribe(
        (event:any) => {
         this.paginator.pageSize = defaultPageOption;
          event = this.paginator;
         this.findTotalPages(event);
         this.storedPageSize = 5;
        }
     );
      this.flagForRefreshPage = false;
    }
  }

  // setPagination(event: any) {
  //   this.displayNumberStart = (event.pageIndex + 1) * event.pageSize - (event.pageSize - 1);
  //   this.displayNumberEnd = (event.pageIndex + 1) * event.pageSize;
  //   this.displayNumberEnd = this.displayNumberEnd > event.length ? event.length : this.displayNumberEnd;
  // }

  pageEvents(event: any) {
    // console.table(event);
    // this.setPagination(event);
    //debugger;
    this.findTotalPages(event);
    let pageLength = this.dataSourceLength/event.pageSize;
    this.storedPageSize = event.pageSize;
    this.rootScopeData.backToPagination.storedPageSize = event.pageSize;
    this.rootScopeData.backToPagination.storedPageIndex = event.pageIndex;
    this.length = parseInt(pageLength+"");
    if(event.length < this.totalRecords){
      if((event.length - ((event.pageIndex) * event.pageSize)) <= event.pageSize) {
        // this.fromRow = this.fromRow + 1;
        // this.toRow = (this.toRow+this.toRow)
        // let params={
        //   fromRow : parseInt(this.dataSourceLength) + 1,
        //   toRow : (parseInt(this.dataSourceLength) + totalRecordsPerRequest) > this.totalRecords ? this.totalRecords : parseInt(this.dataSourceLength) + totalRecordsPerRequest
        // }
        let params={
          fromRow : this.fromRow,
          toRow : this.toRow
        }
        this.onPaginationChange.emit(params);
      }
    }
  }

  

  findTotalPages(e: any) {
    this.translatedOfValue = this.translatedOfValue ? this.translatedOfValue :'of'
    document.querySelectorAll(".mat-paginator-range-label")[0].innerHTML = (e.pageIndex+1) + ' ' + this.translatedOfValue + ' ' + Math.ceil(this.totalRecords / e.pageSize);
  }
    
    

}
