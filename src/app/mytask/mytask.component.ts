import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from '../rootscope-data';
import { RootScopeDeclare } from '../rootscope-declare';

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements OnInit {

  rootScopeData:RootScopeDeclare=RootScopeData;
  constructor(private route: Router) { }

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'payments'
  }



  // selectMenu_click(val:any){
  //   if(val == "Payments")
  //   {
  //     this.route.navigate(['/mytask/payment/single-payments'])
  //   }
  //   else if(val == "ServiceRequest"){
  //     this.route.navigate(['/mytask/serviceRequest'])
  //   }
  //    else if(val == "beneficiaries"){
  //     this.route.navigate(['/mytask/beneficiary'])
  //   }
  //   else if(val == "sadadbiller"){
  //     this.route.navigate(['/mytask/sadad-billers'])
  //   }
    
  // }
}
