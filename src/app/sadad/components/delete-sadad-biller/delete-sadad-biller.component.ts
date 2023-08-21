import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';


@Component({
  selector: 'app-delete-sadad-biller',
  templateUrl: './delete-sadad-biller.component.html',
  styleUrls: ['./delete-sadad-biller.component.scss']
})
export class DeleteSadadBillerComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  details: any;
  constructor(private sadadService:SadadPaymentService,public dialog: MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.deleteSadadBillerObject;
  }

  deleteSadadBiller(){
    let dialogRef = this.dialog.open(DeletePopupComponent,{
      width:'400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {
    this.deleteSadadBillerRecord(this.details);
    this.dialog.closeAll();
    });
  }


  deleteSadadBillerRecord(params:any){
    this.isLoadingCompelete=false;
    // console.log(params)
    this.sadadService.sadadbillerDelete(params).subscribe(
      resp =>{
        this.isLoadingCompelete=true;
       if(resp.data.data =="SUCCESS"){
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_SADADBILLER_DELETE_TOAST";
        this.router.navigate(['/sadad/billsInquiry/sadadBillerInquiry'])
       }
     },error => {
       this.isLoadingCompelete = true;
       this.rootScopeData.showSystemError = true;
     }      
    ) 
  }

}
