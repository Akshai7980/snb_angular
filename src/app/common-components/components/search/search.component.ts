import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Output() childEvent = new EventEmitter();
  @Output() searchParams = new EventEmitter();
  @Output() blurApiEmit = new EventEmitter();
  @Input() showAdvanceSearch: any;
  @Input() bulkUploadSummaryObject: any;
  @Input() maxDate: any;
  @Input() datalist: any;
  @Input() cardTypes?: any;
  @Input() serviceTypes?: any;
  @Input() statuses?: any;
  @Input() transactionTypes?: any;
  @Input() requestTypes?: any;
  showAdvancedSearchPopup: boolean = false;
  bulkSummaryObject: any;
  @Input() selectedBene :any
  constructor() { }
  callParentMethod(event: any) {
    this.childEvent.emit(event);
  }
  ngOnInit(): void {
    this.bulkSummaryObject = this.bulkUploadSummaryObject;
  }

  onAdvancedSearchClick() {
    this.showAdvancedSearchPopup = !this.showAdvancedSearchPopup;
  }

  onAdvSearchClick(event: any) {
    this.searchParams.emit(event)
  }

  onBlurApi(event:any){
    this.blurApiEmit.emit(event)
  }

}
