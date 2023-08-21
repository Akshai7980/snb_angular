import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {
  }

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'cards';
  }
}
