import { Component, OnInit } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
@Component({
  selector: 'app-add-beneficiary',
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.scss']
})
export class AddBeneficiaryComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() { }

  ngOnInit(): void {
  }


 
}
  

