import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';


@Component({
  selector: 'app-additional-account-request',
  templateUrl: './additional-account-request.component.html',
  styleUrls: ['./additional-account-request.component.scss']
})
export class AdditionalAccountRequestComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  logo :string ="";

  constructor() {this.logo = logoprint(); }

  ngOnInit(): void {
  }

}
