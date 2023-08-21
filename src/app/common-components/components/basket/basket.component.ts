import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit,OnChanges {
  transferTotal = 0;
  transferData: any = [];
  basketDataToDisplay: any
  @Input() basketData: any;
  @Output() editedDatasource = new EventEmitter()
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.getTotal();
  }
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basketDataToDisplay = Object.assign({}, this.basketData);
    this.getTotal();
  }
  deleteRecord(i: any) {
    this.basketData.data.splice(i, 1);
    this.getTotal();
    if (this.basketData.data.length > 0) {
      this.editedDatasource.emit(this.basketData.data);
    }
  }
  editRecord(i: any) {
    this.rootScopeData.basketEdit = i
    this.editedDatasource.emit(this.basketData.data);
     this.getTotal();
  }
  getTotal() {
    this.transferTotal = 0
    this.basketData.data.forEach((ele: any) => {
      let formatType = ele.amt.slice(-3);
      let amt = ele.amt.replace(/([a-zA-Z])/g, '');
      this.transferTotal = this.transferTotal + Number(amt)
    })
  }
}
