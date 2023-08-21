import { Component, OnInit } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations'; 
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { showFilteredRows } from 'src/app/utility/tableFilter';


@Component({
  selector: 'app-loan-repayment-schedule',
  templateUrl: './loan-repayment-schedule.component.html',
  styleUrls: ['./loan-repayment-schedule.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   
        style({opacity:0}),
        animate(600, style({opacity:1})) 
      ]),
      transition(':leave', [  
        animate(300, style({opacity:0})) 
      ])
    ])
  ]
})
export class LoanRepaymentScheduleComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {
    this.rootScopeData.activeTabName = 'loanRepaymentSchedule';
   }

  ngOnInit(): void {
    
  }

  triggerSearchFilter(event:any): void {
    showFilteredRows('loanRepaymentScheduleCntr', event.target.value); 
  }


  refreshSummary(){
    
  }
}
