import { Component, OnInit } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
import { Router } from '@angular/router';
@Component({
  selector: 'app-beneficiary-activation',
  templateUrl: './beneficiary-activation.component.html',
  styleUrls: ['./beneficiary-activation.component.scss']
})
export class BeneficiaryActivationComponent implements OnInit {
  displayedColumns:string[]=['AccountNumber','Nickname','BankName','FullName','Type']
  rootScopeData: RootScopeDeclare = RootScopeData;
  details: any =[];
  beneSummary:boolean=true;
  beneficaiaryActivation="beneficiary";
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.selectedBeneficiary;

  }

  getCanelBtnClick(){
    this.router.navigate(['/payments/beneficiaryInquiry']);
  }

}
