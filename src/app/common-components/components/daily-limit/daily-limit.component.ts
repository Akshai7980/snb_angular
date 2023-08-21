import { Component, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-daily-limit',
  templateUrl: './daily-limit.component.html',
  styleUrls: ['./daily-limit.component.scss']
})
export class DailyLimitComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData
  dailyLimitObj:any;

  constructor() {
    this.dailyLimitObj = this.rootScopeData.dailyLimit;
   }

  ngOnInit(): void {
  }

}
