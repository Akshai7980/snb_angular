import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-authorize-cheque-book-request',
  templateUrl: './authorize-cheque-book-request.component.html',
  styleUrls: ['./authorize-cheque-book-request.component.scss']
})
export class AuthorizeChequeBookRequestComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  constructor() { 
  }

  ngOnInit(): void {
    this.details = this.rootScopeData.chequeBookDetailsObject;
  }

}
