import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent implements OnInit {

  @Output() onRefresh = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }


  refreshRecord(){
    this.onRefresh.emit();
  }
}
