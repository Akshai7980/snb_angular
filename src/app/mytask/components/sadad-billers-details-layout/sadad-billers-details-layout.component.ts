import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sadad-billers-details-layout',
  templateUrl: './sadad-billers-details-layout.component.html',
  styleUrls: ['./sadad-billers-details-layout.component.scss']
})
export class SadadBillersDetailsLayoutComponent implements OnInit {

  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  constructor(private router:Router) { }
 
  ngOnInit(): void {
  }



  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSadadBillerRequest'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSadadBillerRequest'])
  }
  back(){
    this.router.navigate(['/mytask/billerManagement/sadad-billers'])
  }

}
