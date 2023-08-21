import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-cards-inquiry',
  templateUrl: './cards-inquiry.component.html',
  styleUrls: ['./cards-inquiry.component.scss'],
})
export class CardsInquiryComponent implements OnInit {
  showActiveCard: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() {}

  ngOnInit(): void {}

  getActivateCard(event: any, type: string) {
    this.showActiveCard = event;
  }
}
