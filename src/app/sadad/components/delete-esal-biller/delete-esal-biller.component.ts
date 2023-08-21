import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';

@Component({
  selector: 'app-delete-esal-biller',
  templateUrl: './delete-esal-biller.component.html',
  styleUrls: ['./delete-esal-biller.component.scss']
})
export class DeleteEsalBillerComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  details: any;
  constructor(private sadadService:SadadPaymentService,public dialog: MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.esalBillerSummaryObject;
  }

  deleteEsalBiller(){
    let dialogRef = this.dialog.open(DeletePopupComponent,{
      width:'400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {

    this.deleteEsalBillerRecord(this.details);
    this.dialog.closeAll();
    });
  }


  deleteEsalBillerRecord(params:any){
    this.isLoadingCompelete=false;
    // console.log(params)
    this.sadadService.esalBillerDelete(params).subscribe(
      resp =>{
        this.isLoadingCompelete=true;
       if(resp.data.data =="SUCCESS"){
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ESALBILLER_DELETE_TOAST";
        this.router.navigate(['/sadad/billsInquiry/esalBillerInquiry'])
       }
     },error => {
       this.isLoadingCompelete = true;
       this.rootScopeData.showSystemError = true;
     }      
    ) 
  }

  onClickBack() {
    this.router.navigate(['/sadad/billsInquiry/esalBillerInquiry']);
  }

}
