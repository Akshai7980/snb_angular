import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-card-inquiry-layout',
  templateUrl: './card-inquiry-layout.component.html',
  styleUrls: ['./card-inquiry-layout.component.scss'],
})
export class CardInquiryLayoutComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  logo = 'assets/images/snb-logo-print.png';
  printSection:string="";
  constructor() {
    this.rootScopeData.lhsActiveComp = 'cardsInquiry';
    this.rootScopeData.accountsActiveModule = 'CASASUMMARY';
    this.printSection="cardsPrintSection";
  }

  ngOnInit(): void {}
}
