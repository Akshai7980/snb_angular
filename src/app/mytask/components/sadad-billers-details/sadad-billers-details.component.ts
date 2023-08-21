import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-sadad-billers-details',
  templateUrl: './sadad-billers-details.component.html',
  styleUrls: ['./sadad-billers-details.component.scss']
})
export class SadadBillersDetailsComponent implements OnInit {

  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  sadadBillerDetailsData: any;
  childValues: any;
  parentValues: any;
  subProduct: any;
  // beneId: any;
  sadadGalleryDetails: any=[];
  constructor(private myTaskService:MyTaskService) { }

  ngOnInit(): void {
    this.sadadBillerDetailsData = this.rootScopeData.pendingActivitiesSingleBeneficiaryObject; 
    // this.beneId = this.sadadBillerDetailsData.lib_ref_no;   
    this.getSingleBeneficiaryDetails(this.sadadBillerDetailsData);
  }



  getSingleBeneficiaryDetails(data:any){
    this.isLoadingCompelete = false;
    this.myTaskService.getSadadGalleryDetails(data).subscribe((data:any)=>{
      this.isLoadingCompelete = true;
      if(data.data){
        this.rootScopeData.singleBeneficiaryDetailsObject = data.data[0];
        this.sadadGalleryDetails = data.data[0];
      }
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }


 


}
